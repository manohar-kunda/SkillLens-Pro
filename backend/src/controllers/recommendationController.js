/**
 * -----------------------------------------------------------------------------
 * File: recommendationController.js
 * Component: Backend MVC Controller
 * Purpose: Provides structured course recommendations and scores user resumes 
 *          against specific target job profiles or custom career paths.
 *
 * Responsibilities:
 * - Generate customized study roadmap cards for missing skills gaps.
 * - Calculate detailed resume score alignment (mismatches and keywords match list).
 * - Implement resilient offline fallbacks for local scoring using raw term-frequency intersections.
 * - Map curated resources (such as freeCodeCamp, roadmap.sh) dynamically.
 *
 * External Dependencies:
 * - db (MySQL Connection Pool promise instance)
 * - axiosWithRetry (Utility carrying exponential retry wrappers)
 * - Python AI Service (Evaluates advanced syntactic and semantic overlap via FastAPI)
 *
 * Author: Manohar Kunda
 * -----------------------------------------------------------------------------
 */

const pool = require('../config/db');
const axios = require('axios');
const axiosWithRetry = require('../utils/axiosWithRetry');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://127.0.0.1:8011';

/**
 * Computes a direct keyword overlap score between a resume and a job description.
 * Utilized as a backup scoring mechanism when the Python AI service is offline.
 *
 * Algorithm details:
 * 1. Tokenize inputs and discard common English structural stopwords.
 * 2. Form unique sets of extracted tokens (lowercased).
 * 3. Calculate intersections to identify matched and missing terms.
 * 4. Derive percentage score relative to the job requirements.
 *
 * @param {string} resumeText - Full text compiled from user resume profile.
 * @param {string} jobDescription - Combined title and responsibility text.
 * @returns {Object} Object carrying score metrics, matched_skills, missing_skills, and explanations.
 */
const localScoreResume = (resumeText, jobDescription) => {
    const extractKeywords = (text) => {
        // High-density filter mapping standard grammatical structural nouns
        const commonWords = new Set(['a', 'an', 'the', 'in', 'on', 'at', 'for', 'with', 'is', 'are', 'was', 'were', 'and', 'or', 'to', 'of', 'from', 'by', 'as', 'it', 'its', 'he', 'she', 'we', 'they', 'you', 'your', 'my', 'our', 'their', 'this', 'that', 'these', 'those', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'not', 'no', 'yes', 'but', 'so', 'if', 'then', 'than', 'when', 'where', 'why', 'how', 'what', 'which', 'who', 'whom', 'whose', 'can', 'could', 'will', 'would', 'should', 'may', 'might', 'must', 'get', 'got', 'go', 'went', 'gone', 'make', 'made', 'making', 'see', 'saw', 'seen', 'say', 'said', 'saying', 'come', 'came', 'coming', 'take', 'took', 'taken', 'know', 'knew', 'known', 'think', 'thought', 'thinking', 'find', 'found', 'finding', 'give', 'gave', 'given', 'tell', 'told', 'telling', 'work', 'worked', 'working', 'use', 'used', 'using', 'also', 'much', 'many', 'more', 'most', 'less', 'least', 'only', 'even', 'just', 'about', 'above', 'across', 'after', 'against', 'along', 'among', 'around', 'before', 'behind', 'below', 'beneath', 'beside', 'between', 'beyond', 'during', 'except', 'inside', 'into', 'like', 'near', 'off', 'onto', 'outside', 'over', 'past', 'since', 'through', 'under', 'until', 'up', 'upon', 'within', 'without', 'per', 'via', 'etc', 'e.g.', 'i.e.', 'vs', 'etc', 'etcetera', 'etc.']);
        return new Set(text.toLowerCase().split(/\W+/).filter(word => word.length > 2 && !commonWords.has(word)));
    };

    const resumeKeywords = extractKeywords(resumeText);
    const jobKeywords = extractKeywords(jobDescription);

    let matchedCount = 0;
    const matchedSkills = [];
    const missingSkills = [];

    jobKeywords.forEach(jobKw => {
        if (resumeKeywords.has(jobKw)) {
            matchedCount++;
            matchedSkills.push(jobKw);
        } else {
            missingSkills.push(jobKw);
        }
    });

    const score = jobKeywords.size > 0 ? (matchedCount / jobKeywords.size) * 100 : 0;

    return {
        score: parseFloat(score.toFixed(2)),
        matched_skills: matchedSkills,
        missing_skills: missingSkills,
        explanation: 'Local fallback scoring: AI service was unavailable. Score based on simple keyword overlap.'
    };
};

/**
 * Compiles missing skill gap vectors for a user and constructs a chronological study roadmap.
 * Pulls from a curated dataset of top-tier 100% free courses (e.g. FreeCodeCamp, Coursera, official MDN guides)
 * and outputs dynamic YouTube search parameters as fallbacks for custom skill categories.
 *
 * @param {Object} req - Express request holding credentials and `jobRoleId` params.
 * @param {Object} res - Express response returning the structured roadmap steps.
 * @returns {Promise<void>}
 */
const getRecommendations = async (req, res) => {
    try {
        const userId = req.user.id;
        const jobRoleId = req.params.jobRoleId;

        // 1. Retrieve the designated skill gaps recorded during analysis from the DB
        const [gaps] = await pool.query(
            `SELECT sg.missing_skill_id, s.name as skill_name
             FROM skill_gaps sg
             JOIN skills s ON sg.missing_skill_id = s.id
             WHERE sg.user_id = ? AND sg.job_role_id = ?`,
            [userId, jobRoleId]
        );

        if (gaps.length === 0) {
            return res.status(200).json({ 
                message: 'No skill gaps found for this job role. You are fully qualified!',
                recommendations: [] 
            });
        }

        const missingSkillNames = gaps.map(g => g.skill_name.toLowerCase());

        // 2. Define Curated Reference Learning Roadmaps (Enterprise Framework Mappings)
        const roleRoadmaps = {
            'Web Developer': [
                { skill: 'html', title: 'HTML5 Semantic Foundations (FreeCodeCamp)', url: 'https://www.freecodecamp.org/learn/2022/responsive-web-design/' },
                { skill: 'css', title: 'CSS3 Styling & Flexbox (Web.dev)', url: 'https://web.dev/learn/css/' },
                { skill: 'javascript', title: 'JavaScript Full Course (JavaScript.info)', url: 'https://javascript.info/' },
                { skill: 'react', title: 'React Official Documentation', url: 'https://react.dev/learn' },
                { skill: 'node.js', title: 'Node.js Backend Architecture (Official Docs)', url: 'https://nodejs.dev/en/learn/' },
                { skill: 'sql', title: 'Relational Databases & SQL (FreeCodeCamp)', url: 'https://www.freecodecamp.org/news/learn-sql-in-10-minutes/' },
                { skill: 'git', title: 'Version Control with Git (Roadmap.sh)', url: 'https://roadmap.sh/git-github' },
                { skill: 'docker', title: 'Containerization with Docker (Docker Docs)', url: 'https://docs.docker.com/get-started/' }
            ],
            'Java Developer': [
                { skill: 'java', title: 'Core Java Programming (University of Helsinki Free MOOC)', url: 'https://java-programming.mooc.fi/' },
                { skill: 'sql', title: 'Database Design & SQL (Khan Academy - Free)', url: 'https://www.khanacademy.org/computing/computer-programming/sql' },
                { skill: 'spring boot', title: 'Enterprise Java with Spring Boot (Spring Official)', url: 'https://spring.io/guides' },
                { skill: 'hibernate', title: 'Java ORM with Hibernate (JBoss Official)', url: 'https://hibernate.org/orm/documentation/5.5/' },
                { skill: 'git', title: 'Version Control with Git (Official Docs)', url: 'https://git-scm.com/doc' },
                { skill: 'docker', title: 'Docker for Java Developers (Docker Docs)', url: 'https://docs.docker.com/get-started/' }
            ],
            'Data Analyst': [
                { skill: 'python', title: 'Python for Data Science (Kaggle - Free)', url: 'https://www.kaggle.com/learn/python' },
                { skill: 'sql', title: 'Advanced Data Querying (SQLBolt - Free Interactive)', url: 'https://sqlbolt.com/' },
                { skill: 'data analysis', title: 'Data Analysis with Pandas (Kaggle - Free)', url: 'https://www.kaggle.com/learn/pandas' },
                { skill: 'machine learning', title: 'Intro to Machine Learning (Kaggle - Free)', url: 'https://www.kaggle.com/learn/intro-to-machine-learning' }
            ],
            'Cyber Security Analyst': [
                { skill: 'linux', title: 'Linux Operating System Fundamentals (LinuxJourney)', url: 'https://linuxjourney.com/' },
                { skill: 'network security', title: 'Network Security Principles (Cisco NetAcad - Free)', url: 'https://www.netacad.com/courses/security/introduction-cybersecurity' },
                { skill: 'cyber security', title: 'Cyber Security Essentials Roadmap', url: 'https://roadmap.sh/cyber-security' },
                { skill: 'ethical hacking', title: 'Ethical Hacking basics (TryHackMe - Free Tier)', url: 'https://tryhackme.com/paths' },
                { skill: 'python', title: 'Python for Beginners (FreeCodeCamp)', url: 'https://www.freecodecamp.org/learn/scientific-computing-with-python/' }
            ]
        };

        // Determine job title to filter reference roadmaps
        const [roleData] = await pool.query('SELECT title FROM job_roles WHERE id = ?', [jobRoleId]);
        const roleTitle = roleData.length > 0 ? roleData[0].title : 'Unknown Role';

        // 3. Assemble study roadmap blocks sequentially
        const masterRoadmap = roleRoadmaps[roleTitle] || [];
        
        let stepCounter = 1;
        const personalizedRoadmap = [];

        // Check if matching roadmap coordinates exist
        if (masterRoadmap.length > 0) {
            masterRoadmap.forEach((mapObj) => {
                if (missingSkillNames.includes(mapObj.skill)) {
                    personalizedRoadmap.push({
                        step: stepCounter++,
                        skill: mapObj.skill.toUpperCase(),
                        title: mapObj.title,
                        url: mapObj.url
                    });
                }
            });
            
            // Check for edge-case skills missing from the hardcoded roadmap and add general study links
            missingSkillNames.forEach((targetSkill) => {
                const alreadyMapped = personalizedRoadmap.find(pr => pr.skill.toLowerCase() === targetSkill);
                if (!alreadyMapped) {
                    personalizedRoadmap.push({
                        step: stepCounter++,
                        skill: targetSkill.toUpperCase(),
                        title: `Learn ${targetSkill.toUpperCase()} Fundamentals`,
                        url: `https://www.youtube.com/results?search_query=${encodeURIComponent(targetSkill + ' tutorial')}`
                    });
                }
            });
        } else {
             // Fallback dynamically generated study recommendations for customized jobs
             missingSkillNames.forEach((targetSkill) => {
                personalizedRoadmap.push({
                    step: stepCounter++,
                    skill: targetSkill.toUpperCase(),
                    title: `Master ${targetSkill.toUpperCase()}`,
                    url: `https://www.youtube.com/results?search_query=${encodeURIComponent(targetSkill + ' crash course')}`
                });
            });
        }

        res.status(200).json({
            message: 'Recommendations generated successfully',
            jobRoleId,
            jobTitle: roleTitle,
            roadmap: personalizedRoadmap
        });

     } catch (error) {
        console.error('Recommendations Error:', error);
        res.status(500).json({ message: 'Server error fetching learning recommendations' });
    }
};

/**
 * Computes the suitability metrics of a candidate's resume relative to a target career role.
 *
 * Pipeline Flow:
 * 1. Resolves targeted job description details (using database records or user custom strings).
 * 2. Fetches candidate resume information from:
 *    - Structured JSON saved inside the platform's `resume_builder_info` table.
 *    - Fallback: The text extraction of the most recently parsed physical PDF/DOCX file.
 * 3. Calls the Python AI service `/api/score-resume` containing the payload coordinates.
 * 4. In case of cold-starts or network blocks, executes a local keyterm overlap comparison.
 *
 * @param {Object} req - Express request holding credentials and query targets (jobRoleId, customRole).
 * @param {Object} res - Express response returning the computed percentage score, matches, and recommendations.
 * @returns {Promise<void>}
 */
const scoreResumeAgainstJob = async (req, res) => {
    try {
        const userId = req.user.id;
        const { jobRoleId, customRole } = req.body;

        if (!jobRoleId && !customRole) {
            return res.status(400).json({ message: 'Job Role ID or Custom Role Title is required' });
        }

        let jobDescription;
        let jobTitle;

        if (jobRoleId) {
            // Resolve job specification from the MySQL catalog
            const [jobRows] = await pool.query('SELECT title, description FROM job_roles WHERE id = ?', [jobRoleId]);
            if (jobRows.length === 0) {
                return res.status(404).json({ message: 'Job Role not found' });
            }
            jobTitle = jobRows[0].title;
            jobDescription = `${jobRows[0].title}. ${jobRows[0].description}`;
        } else {
            // Compile custom specification description
            jobTitle = customRole;
            jobDescription = `Job Role: ${customRole}. Core skills and technologies required for a ${customRole}.`;
        }

        // Fetch user resume data prioritizing structured builder info over file uploads
        let resumeText = '';
        const [resumeBuilderRows] = await pool.query('SELECT * FROM resume_builder_info WHERE user_id = ?', [userId]);
        
        if (resumeBuilderRows.length > 0) {
            const r = resumeBuilderRows[0];
            resumeText = `
                Name: ${req.user.name}
                Summary: ${r.summary || ''}
                Skills: ${r.skills || ''}
                Experience: ${JSON.stringify(r.experience) || ''}
                Projects: ${JSON.stringify(r.projects) || ''}
                Education: ${JSON.stringify(r.education) || ''}
                Certifications: ${r.certifications || ''}
            `;
        } else {
            // Fallback: load text content parsed from the physical file upload
            const [uploadedRows] = await pool.query(
                'SELECT parsed_data FROM resumes WHERE user_id = ? AND parsed_data IS NOT NULL ORDER BY upload_date DESC LIMIT 1',
                [userId]
            );
            if (uploadedRows.length === 0) {
                return res.status(400).json({ 
                    message: 'No resume found. Please upload a resume or complete your Resume Builder profile first.' 
                });
            }
            const parsed = typeof uploadedRows[0].parsed_data === 'string' 
                ? JSON.parse(uploadedRows[0].parsed_data) 
                : uploadedRows[0].parsed_data;
            
            resumeText = `
                Name: ${req.user.name}
                Summary: ${parsed.summary || ''}
                Skills: ${(parsed.skills_extracted || []).join(', ')}
                Raw Text: ${parsed.raw_text || ''}
            `;
        }

        // Execute remote API connection or handle fallback in case of networking timeouts
        let scoreData;
        try {
            const aiResponse = await axiosWithRetry(() => axios.post(`${AI_SERVICE_URL}/api/score-resume`, {
                resume_text: resumeText,
                job_description: jobDescription
            }, { timeout: 45000 }));
            scoreData = aiResponse.data;
        } catch (aiErr) {
            console.warn('[Score] Python AI unavailable, using local overlap scorer:', aiErr.message);
            // Dynamic local score mapping based on simple keyword sets intersections
            const resumeLower = resumeText.toLowerCase();
            const jobWords = jobDescription.toLowerCase()
                .split(/[\s,;.\-()]+/)
                .filter(w => w.length > 3 && !['with','that','this','from','have','will','your','their','they'].includes(w));
            
            const uniqueJobWords = [...new Set(jobWords)];
            const matches = uniqueJobWords.filter(w => resumeLower.includes(w));
            const missing = uniqueJobWords.filter(w => !resumeLower.includes(w)).slice(0, 8);
            const score = uniqueJobWords.length > 0 ? Math.min(95, Math.round((matches.length / uniqueJobWords.length) * 100)) : 30;
            
            scoreData = {
                score,
                matches: matches.slice(0, 12),
                missing,
                suggestions: score >= 70
                    ? ['Great alignment with this role\'s requirements!']
                    : score >= 40
                        ? ['Consider adding more keywords from the job description to your resume.']
                        : ['Your resume may need significant additions — study the job role closely and add relevant skills.']
            };
        }

        res.status(200).json({
            message: 'Resume scored successfully',
            jobTitle: jobTitle,
            score: scoreData.score || 0,
            matches: scoreData.matches || [],
            missing: scoreData.missing || [],
            suggestions: scoreData.suggestions || []
        });

    } catch (error) {
        console.error('Resume Scoring Error:', error.response?.data || error.message);
        res.status(500).json({ message: 'Server error during resume scoring: ' + error.message });
    }
};

module.exports = {
    getRecommendations,
    scoreResumeAgainstJob
};
