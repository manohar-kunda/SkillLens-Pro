const pool = require('../config/db');
const axios = require('axios');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://127.0.0.1:8011';

// @desc    Get learning recommendations for a user's missing skills for a specific job role
// @route   GET /api/recommendations/:jobRoleId
// @access  Private
const getRecommendations = async (req, res) => {
    try {
        const userId = req.user.id;
        const jobRoleId = req.params.jobRoleId;

        // 1. Fetch missing skills from skill_gaps table
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

        // 2. Define Authorized Role Roadmaps (Step-by-Step - 100% FREE RESOURCES)
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

        // Get the role name
        const [roleData] = await pool.query('SELECT title FROM job_roles WHERE id = ?', [jobRoleId]);
        const roleTitle = roleData.length > 0 ? roleData[0].title : 'Unknown Role';

        // 3. Build the Structured User Roadmap
        const masterRoadmap = roleRoadmaps[roleTitle] || [];
        
        let stepCounter = 1;
        const personalizedRoadmap = [];

        // If a roadmap exists for this role, map missing skills Chronologically
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
            
            // Catch missing skills that weren't in our hardcoded roadmap
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
             // Fallback for custom roles: Just use YouTube resources
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

// @desc    Score a user's resume against a specific job role
// @route   POST /api/recommendations/score
// @access  Private
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
            // 1. Fetch Job Description from DB
            const [jobRows] = await pool.query('SELECT title, description FROM job_roles WHERE id = ?', [jobRoleId]);
            if (jobRows.length === 0) {
                return res.status(404).json({ message: 'Job Role not found' });
            }
            jobTitle = jobRows[0].title;
            jobDescription = `${jobRows[0].title}. ${jobRows[0].description}`;
        } else {
            // 2. Use Custom Role Title
            jobTitle = customRole;
            jobDescription = `Job Role: ${customRole}. Core skills and technologies required for a ${customRole}.`;
        }

        // 3. Fetch User Resume Info — try Resume Builder first, then fall back to uploaded resume
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
            // Fallback: use the most recently uploaded and analyzed resume
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

        // 4. Call AI Service for scoring
        const aiResponse = await axios.post(`${AI_SERVICE_URL}/api/score-resume`, {
            resume_text: resumeText,
            job_description: jobDescription
        }, { timeout: 20000 });

        const aiData = aiResponse.data;

        res.status(200).json({
            message: 'Resume scored successfully',
            jobTitle: jobTitle,
            score: aiData.score || 0,
            matches: aiData.matches || [],
            missing: aiData.missing || [],
            suggestions: aiData.suggestions || []
        });

    } catch (error) {
        console.error('Resume Scoring Error:', error.response?.data || error.message);
        res.status(500).json({ message: 'Server error during resume scoring' });
    }
};

module.exports = {
    getRecommendations,
    scoreResumeAgainstJob
};
