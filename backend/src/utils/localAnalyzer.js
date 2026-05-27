/**
 * -----------------------------------------------------------------------------
 * File: localAnalyzer.js
 * Component: Backend Utility
 * Purpose: A self-contained fallback resume parser and ATS scorer running entirely 
 *          in the Node.js process. Prevents app service interruptions if the 
 *          Python FastAPI service is offline.
 *
 * Capabilities:
 * - Direct binary buffer extraction for PDF (`pdf-parse`) and DOCX (`mammoth`).
 * - High-speed substring boundaries matching using pre-configured technical keywords set.
 * - Score deductions and heuristic feedback generations matching structure and length metrics.
 * - Complete payload parity with the primary Python AI service API interface.
 *
 * Heuristic Math Weights (Max 100 pts):
 * - Technical Skills: Up to 50 pts (deductions for under 3 identified skills)
 * - Section Structure: Up to 30 pts (requires 'Education', 'Experience', and 'Projects' sections)
 * - Length Communication: Up to 20 pts (optimal span: 150-1000 words)
 *
 * Author: Manohar Kunda
 * -----------------------------------------------------------------------------
 */

const KNOWN_SKILLS = new Set([
    'python', 'java', 'javascript', 'typescript', 'react', 'node.js', 'nodejs', 'express',
    'mysql', 'postgresql', 'mongodb', 'sql', 'nosql', 'html', 'css', 'bootstrap', 'tailwind',
    'machine learning', 'data analysis', 'git', 'aws', 'docker', 'kubernetes', 'azure', 'gcp',
    'agile', 'c++', 'c#', 'cybersecurity', 'linux', 'pandas', 'spring boot', 'mern stack',
    'cloud computing', 'devops', 'microservices', 'ci/cd', 'rest api', 'graphql', 'redux',
    'angular', 'vue', 'django', 'flask', 'laravel', 'php', 'swift', 'kotlin', 'flutter',
    'firebase', 'redis', 'elasticsearch', 'terraform', 'ansible', 'jenkins', 'figma'
]);

/**
 * Extracts raw textual content from document file buffers based on file extensions.
 *
 * @param {Buffer} buffer - The raw binary file buffer from multer.
 * @param {string} filename - Base name of the file (used to resolve extension type).
 * @returns {Promise<string>} Extracted raw string text, or empty string on parsing failures.
 */
async function extractText(buffer, filename) {
    const name = filename.toLowerCase();

    if (name.endsWith('.pdf')) {
        try {
            const pdfParse = require('pdf-parse');
            const result = await pdfParse(buffer);
            return result.text || '';
        } catch (err) {
            console.error('[LocalAnalyzer] PDF parse error:', err.message);
            return '';
        }
    }

    if (name.endsWith('.docx')) {
        try {
            const mammoth = require('mammoth');
            const result = await mammoth.extractRawText({ buffer });
            return result.value || '';
        } catch (err) {
            console.error('[LocalAnalyzer] DOCX parse error:', err.message);
            return '';
        }
    }

    return '';
}

/**
 * Scans raw text for occurrences of pre-registered technical skill strings.
 * Applies word boundary regular expression shields to prevent partial token overlaps.
 *
 * @param {string} text - Raw input string text.
 * @returns {Array<string>} Deduped list of identified technical skill strings.
 */
function extractSkills(text) {
    const lower = text.toLowerCase();
    const found = new Set();

    for (const skill of KNOWN_SKILLS) {
        // Escapes special regex characters (e.g. C++, .NET) to safely construct RegExp
        const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`\\b${escaped}\\b`);
        if (regex.test(lower)) {
            found.add(skill);
        }
    }
    return Array.from(found);
}

/**
 * Computes ATS score deductions and provides custom structured feedback blocks.
 * Checks segment headers matching key terms, counts words, and counts technical skills density.
 *
 * @param {string} text - Raw resume text string.
 * @param {Array<string>} skills - Previously extracted skills array.
 * @returns {Object} Analytical evaluation payload with structural breakdown, scores, and feedback strings.
 */
function analyzeQuality(text, skills) {
    const lower = text.toLowerCase();
    const wordCount = text.split(/\s+/).filter(Boolean).length;
    const feedback = [];
    let score = 100;

    // 1. Structure Audit: Scans for core resume sections (deducts 10 pts per missing section)
    const sections = {
        'Education': ['education', 'university', 'college', 'degree', 'academic'],
        'Experience': ['experience', 'work history', 'employment'],
        'Projects': ['projects', 'portfolio', 'personal projects'],
    };
    for (const [name, kws] of Object.entries(sections)) {
        if (!kws.some(k => lower.includes(k))) {
            score -= 10;
            feedback.push(`Missing '${name}' section — add it to improve ATS scoring.`);
        }
    }

    // 2. Length Audit: Validates size metrics to prevent outlier formats (deducts up to 10 pts)
    if (wordCount < 150) {
        score -= 10;
        feedback.push('Resume is too short — add more detail about your experience and achievements.');
    } else if (wordCount > 1000) {
        score -= 5;
        feedback.push('Resume is quite long — consider condensing to 1-2 pages of highlights.');
    }

    // 3. Skills Audit: Verifies technical stack coverage (deducts up to 40 pts)
    if (skills.length === 0) {
        score -= 40;
        feedback.push('No recognizable tech skills were detected — add a dedicated Skills section.');
    } else if (skills.length < 3) {
        score -= 20;
        feedback.push('Very few skills detected — list specific technologies and frameworks you know.');
    }

    if (feedback.length === 0) {
        feedback.push('Excellent resume structure and content!');
    }

    return {
        score: Math.max(score, 5), // Ensures absolute score floor of 5 points
        breakdown: {
            structure: Math.min(30, 30 - (3 - Object.keys(sections).filter(n =>
                sections[n].some(k => lower.includes(k))
            ).length) * 10),
            length_communication: wordCount >= 150 && wordCount <= 1000 ? 20 : wordCount < 150 ? 10 : 15,
            technical_skills: skills.length > 5 ? 50 : skills.length > 2 ? 30 : skills.length > 0 ? 10 : 0,
        },
        feedback,
    };
}

/**
 * Executes full synchronous processing pipeline on file buffers.
 * Translates findings into a standardized schema matching Python service responses.
 *
 * @param {Buffer} buffer - File buffer.
 * @param {string} filename - Document filename.
 * @returns {Promise<Object>} Output payload matching FastAPI schemas.
 */
async function analyzeResumeLocally(buffer, filename) {
    const rawText = await extractText(buffer, filename);
    const wordCount = rawText.split(/\s+/).filter(Boolean).length;
    const skills = extractSkills(rawText);
    const evaluation = analyzeQuality(rawText, skills);

    return {
        text_length: wordCount,
        skills_extracted: skills,
        evaluation,
        raw_text_preview: rawText.slice(0, 500),
        source: 'local_fallback',
    };
}

module.exports = { analyzeResumeLocally };
