/**
 * localAnalyzer.js
 * A self-contained resume analysis fallback that runs entirely in Node.js.
 * Used when the Python AI service is unavailable (e.g., Render cold-start 502).
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
 * Extract raw text from a PDF or DOCX buffer.
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
 * Extract a set of known tech skills from raw text.
 */
function extractSkills(text) {
    const lower = text.toLowerCase();
    const found = new Set();

    for (const skill of KNOWN_SKILLS) {
        const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`\\b${escaped}\\b`);
        if (regex.test(lower)) {
            found.add(skill);
        }
    }
    return Array.from(found);
}

/**
 * Evaluate resume quality and return a score + feedback array.
 */
function analyzeQuality(text, skills) {
    const lower = text.toLowerCase();
    const wordCount = text.split(/\s+/).filter(Boolean).length;
    const feedback = [];
    let score = 100;

    // Section checks (-30 pts)
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

    // Length check (-20 pts)
    if (wordCount < 150) {
        score -= 10;
        feedback.push('Resume is too short — add more detail about your experience and achievements.');
    } else if (wordCount > 1000) {
        score -= 5;
        feedback.push('Resume is quite long — consider condensing to 1-2 pages of highlights.');
    }

    // Skills check (-50 pts)
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
        score: Math.max(score, 5),
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
 * Full local resume analysis pipeline.
 * Returns the same shape as the Python AI service response.
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
