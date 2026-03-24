const pool = require('../config/db');
const axios = require('axios');
const { findStaticRoadmap, getStaticSuggestions } = require('../utils/staticRoles');

// Intelligent Memory Cache System
const roadmapCache = new Map(); // Key: roleName, Value: roadmapData
const suggestionCache = new Map(); // Key: query, Value: suggestions
const CACHE_TTL = 1000 * 60 * 60; // 1 hour TTL

// @desc    Get all job roles
// @route   GET /api/jobs
// @access  Public or Private
const getJobRoles = async (req, res) => {
    try {
        const [roles] = await pool.query('SELECT * FROM job_roles');
        res.status(200).json(roles);
    } catch (error) {
        console.error('Job Roles Error:', error);
        res.status(500).json({ message: 'Server error fetching job roles' });
    }
};

// @desc    Compare user skills against a target job role and calculate skill gaps
// @route   POST /api/jobs/:id/analyze-gap
// @access  Private
const analyzeSkillGap = async (req, res) => {
    try {
        const userId = req.user.id;
        const jobRoleId = req.params.id;

        // 1. Get user skills
        const [userSkillsData] = await pool.query(
            `SELECT s.id, s.name 
             FROM user_skills us 
             JOIN skills s ON us.skill_id = s.id 
             WHERE us.user_id = ?`,
            [userId]
        );
        const userSkillIds = userSkillsData.map(s => s.id);

        // 2. Get required skills for the job role
        const [jobSkillsData] = await pool.query(
            `SELECT s.id, s.name, jrs.importance_level 
             FROM job_role_skills jrs 
             JOIN skills s ON jrs.skill_id = s.id 
             WHERE jrs.job_role_id = ?`,
            [jobRoleId]
        );

        if (jobSkillsData.length === 0) {
            return res.status(404).json({ message: 'No skills defined for this job role yet.' });
        }

        // 3. Calculate missing skills (Skill Gap Algorithm)
        const missingSkills = [];
        const matchingSkills = [];

        jobSkillsData.forEach(requiredSkill => {
            if (userSkillIds.includes(requiredSkill.id)) {
                matchingSkills.push(requiredSkill);
            } else {
                missingSkills.push(requiredSkill);
            }
        });

        // 4. Clear old skill gaps for this user and job role to refresh
        await pool.query(
            'DELETE FROM skill_gaps WHERE user_id = ? AND job_role_id = ?',
            [userId, jobRoleId]
        );

        // 5. Save new skill gaps in DB
        if (missingSkills.length > 0) {
            const gapValues = missingSkills.map(ms => [userId, jobRoleId, ms.id]);
            await pool.query(
                'INSERT INTO skill_gaps (user_id, job_role_id, missing_skill_id) VALUES ?',
                [gapValues]
            );
        }

        // 6. Calculate Job Fit Score percentage
        const totalRequired = jobSkillsData.length;
        const totalMatched = matchingSkills.length;
        const matchPercentage = Math.round((totalMatched / totalRequired) * 100);

        res.status(200).json({
            message: 'Skill gap analysis complete',
            jobRoleId,
            matchPercentage,
            matchingSkills,
            missingSkills
        });

    } catch (error) {
        console.error('Skill Gap Error:', error);
        res.status(500).json({ message: 'Server error analyzing skill gaps' });
    }
};

// @desc    Dynamically generate a 5-step learning roadmap for a custom job role searched by the user
// @route   POST /api/jobs/custom-roadmap
// @access  Private
const analyzeCustomRole = async (req, res) => {
    try {
        const { roleName } = req.body;
        
        if (!roleName || roleName.trim() === '') {
            return res.status(400).json({ message: 'Please provide a valid job role to search.' });
        }

        const formattedRole = roleName.trim();
        const encodedRole = encodeURIComponent(formattedRole);
        const userId = req.user.id;

        // 1. Fetch user's actual skills from the database (extracted from their resume)
        const [userSkillsData] = await pool.query(
            `SELECT s.id, s.name 
             FROM user_skills us 
             JOIN skills s ON us.skill_id = s.id 
             WHERE us.user_id = ?`,
            [userId]
        );
        // Create an array of lowercased user skill names for easy comparison
        const userSkillNames = userSkillsData.map(s => s.name.toLowerCase());

        // 2. CHECK CACHE FIRST
        const cachedResult = roadmapCache.get(formattedRole.toLowerCase());
        if (cachedResult && (Date.now() - cachedResult.timestamp < CACHE_TTL)) {
            console.log(`[Cache Hit] Serving roadmap for: ${formattedRole}`);
            return res.status(200).json(cachedResult.data);
        }

        // 3. PARALLEL DISCOVERY: DEEP AI & Wikipedia Description
        let extractedSkills = [];
        let hierarchicalRoadmap = null;
        let roleDescription = `The ${formattedRole} is a key role in the modern technology landscape.`;

        try {
            const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://127.0.0.1:8011';
            const [aiPromise, wikiPromise] = await Promise.allSettled([
                axios.post(`${aiServiceUrl}/api/generate-skills`, { text: formattedRole }, { timeout: 8000 }),
                axios.get(`https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&titles=${encodedRole}&format=json`, { 
                    timeout: 4000,
                    headers: { 'User-Agent': 'SkillLensApp/1.0' }
                })
            ]);

            // Handle AI Response
            if (aiPromise.status === 'fulfilled' && aiPromise.value.data?.data) {
                hierarchicalRoadmap = aiPromise.value.data.data;
                if (Array.isArray(hierarchicalRoadmap.roadmap)) {
                    extractedSkills = hierarchicalRoadmap.roadmap.flatMap(r => r.skills || []);
                }
            }

            // Handle Wiki Response
            if (wikiPromise.status === 'fulfilled') {
                const pages = wikiPromise.value.data?.query?.pages;
                if (pages && Object.keys(pages)[0] !== '-1') {
                    const pageId = Object.keys(pages)[0];
                    if (pages[pageId].extract) {
                        const rawText = pages[pageId].extract.replace(/<[^>]*>?/gm, '');
                        roleDescription = rawText.substring(0, 300) + '...';
                        
                        // NLP Fallback if AI failed
                        if (extractedSkills.length === 0) {
                            try {
                                const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://127.0.0.1:8011';
                                const nlpRes = await axios.post(`${aiServiceUrl}/api/extract-text`, { text: rawText }, { timeout: 3000 });
                                if (nlpRes.data && nlpRes.data.skills) extractedSkills = nlpRes.data.skills;
                            } catch (e) {}
                        }
                    }
                }
            }
        } catch (err) {
            console.error('Parallel Discovery Error:', err.message);
        }

        // 4. FINAL FALLBACK: Use static role KB if AI and Wiki extraction failed
        if (extractedSkills.length === 0) {
            const staticRole = findStaticRoadmap(formattedRole);
            if (staticRole) {
                hierarchicalRoadmap = staticRole;
                extractedSkills = staticRole.roadmap.flatMap(r => r.skills || []);
                console.log(`[Roadmap] Using static KB for: ${formattedRole}`);
            } else {
                extractedSkills = ['Technical Architecture', 'Problem Solving', 'System Design', 'Core Infrastructure', 'Version Control', 'APIs', 'Databases'];
            }
        }

        // 4. Calculate actual Skill Gaps (Matched vs Missing) dynamically
        const matchingSkills = [];
        const missingSkills = [];
        let virtualSkillId = 1000; // Generate fake/unique IDs for the frontend chips

        extractedSkills.forEach(reqSkill => {
            const skillObj = { id: `dyn-skill-${virtualSkillId++}`, name: reqSkill.charAt(0).toUpperCase() + reqSkill.slice(1) };
            
            // IMPROVED: Fuzzy/Normalized matching (e.g., "Fullstack" matches "Full Stack")
            const normalize = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
            const nReq = normalize(reqSkill);
            
            const isMatch = userSkillNames.some(userSkill => {
                const nUser = normalize(userSkill);
                return nUser.includes(nReq) || nReq.includes(nUser);
            });
            
            if (isMatch) {
                matchingSkills.push(skillObj);
            } else {
                missingSkills.push(skillObj);
            }
        });

        // 5. Calculate honest Match Percentage
        const totalRequired = extractedSkills.length;
        const matchPercentage = totalRequired > 0 ? Math.round((matchingSkills.length / totalRequired) * 100) : 0;

        // 5. Build Final Response with hierarchical structure
        let structuredRoadmap = null;
        
        if (hierarchicalRoadmap && Array.isArray(hierarchicalRoadmap.roadmap)) {
            structuredRoadmap = hierarchicalRoadmap.roadmap.map(cat => ({
                category: cat.category,
                skills: (cat.skills || []).map(s => {
                    const normalize = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, '');
                    const nSkill = normalize(s);
                    const isMatch = userSkillNames.some(u => {
                        const nU = normalize(u);
                        return nU.includes(nSkill) || nSkill.includes(nU);
                    });
                    return { name: s, matched: isMatch };
                })
            }));
        } else if (extractedSkills.length > 0) {
            // FALLBACK HIERARCHY: Group all skills into a "Core Technology" folder
            structuredRoadmap = [{
                category: 'Core Technology & Requirements',
                skills: extractedSkills.map(s => {
                    const normalize = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, '');
                    const nSkill = normalize(s);
                    const isMatch = userSkillNames.some(u => {
                        const nU = normalize(u);
                        return nU.includes(nSkill) || nSkill.includes(nU);
                    });
                    return { name: s, matched: isMatch };
                })
            }];
        }

        const responsePayload = {
            jobTitle: formattedRole,
            description: hierarchicalRoadmap ? hierarchicalRoadmap.description : roleDescription,
            matchingSkills,
            missingSkills,
            matchPercentage: Math.round(matchPercentage),
            hierarchicalRoadmap: structuredRoadmap, // The new Roadmap.sh style data
            steps: (hierarchicalRoadmap && Array.isArray(hierarchicalRoadmap.roadmap)) 
                ? hierarchicalRoadmap.roadmap.map((cat, i) => ({
                    id: i + 1,
                    title: cat.category,
                    description: `Master ${Array.isArray(cat.skills) ? cat.skills.join(', ') : 'this category'}`,
                    skills: cat.skills || []
                })) : [
                    { id: 1, title: 'Foundations', description: `Learn ${extractedSkills.slice(0, 2).join(', ')}`, skills: extractedSkills.slice(0, 2) },
                    { id: 2, title: 'Core Skills', description: `Master ${extractedSkills.slice(2, 4).join(', ')}`, skills: extractedSkills.slice(2, 4) },
                    { id: 3, title: 'Advanced Tools', description: `Explore ${extractedSkills.slice(4).join(', ')}`, skills: extractedSkills.slice(4) }
                ]
        };

        // SAVE TO CACHE
        roadmapCache.set(formattedRole.toLowerCase(), {
            timestamp: Date.now(),
            data: responsePayload
        });

        res.status(200).json(responsePayload);

    } catch (error) {
        console.error('Custom Role Error:', error);
        res.status(500).json({ message: 'Server error analyzing custom role' });
    }
};

// @desc    Dynamically generate the deep 5-step learning roadmap using web scraping
// @route   GET /api/jobs/curriculum/:roleName
// @access  Private
const getInDepthCurriculum = async (req, res) => {
    try {
        const { roleName } = req.params;
        
        if (!roleName || roleName.trim() === '') {
            return res.status(400).json({ message: 'Invalid role for curriculum.' });
        }

        const formattedRole = roleName.trim();
        const encodedRole = encodeURIComponent(formattedRole);

        // Utility to scrape YouTube for the first video ID
        const getYoutubeVideoUrl = async (searchQuery) => {
            try {
                const response = await axios.get(`https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}&sp=CAM%253D`);
                const match = response.data.match(/\/watch\?v=[a-zA-Z0-9_-]{11}/);
                if (match) {
                    return `https://www.youtube.com${match[0]}`;
                }
            } catch (err) {
                console.error('YouTube scrape error:', err.message);
            }
            return `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`;
        };

        // Execute Heavy Scraping
        const foundationUrl = await getYoutubeVideoUrl(`${formattedRole} crash course`);
        const coreTechUrl = await getYoutubeVideoUrl(`${formattedRole} full course freecodecamp`);
        
        let cleanRole = formattedRole.toLowerCase()
            .replace(/\b(developer|engineer|designer|architect|manager|analyst|specialist|consultant|programmer|coder)\b/g, '')
            .trim();
        if (!cleanRole) cleanRole = formattedRole.toLowerCase();

        let roadmapSlug = cleanRole.replace(/[^a-z0-9]+/g, '-');
        roadmapSlug = roadmapSlug.replace(/^-+|-+$/g, ''); 

        const architectureUrl = `https://roadmap.sh/${roadmapSlug}`;
        const projectUrl = `https://github.com/search?q=${encodedRole}+portfolio+projects&type=repositories&s=stars&o=desc`;
        const interviewUrl = `https://github.com/search?q=${encodedRole}+interview+questions&type=repositories&s=stars&o=desc`;

        const personalizedRoadmap = [
            {
                step: 1,
                skill: '1. Foundation',
                title: `${formattedRole} Crash Course (Auto-Play Video)`,
                url: foundationUrl
            },
            {
                step: 2,
                skill: '2. Core Technologies',
                title: `${formattedRole} Full Course (FreeCodeCamp Video)`,
                url: coreTechUrl
            },
            {
                step: 3,
                skill: '3. Deep Dive Architecture',
                title: `Explore the ${formattedRole} Career Path (Roadmap.sh)`,
                url: architectureUrl
            },
            {
                step: 4,
                skill: '4. Hands-On Projects',
                title: `Top-Rated ${formattedRole} Projects to Build (GitHub)`,
                url: projectUrl
            },
            {
                step: 5,
                skill: '5. Interview Prep',
                title: `Best ${formattedRole} Interview Questions (GitHub)`,
                url: interviewUrl
            }
        ];

        res.status(200).json({
            jobTitle: formattedRole,
            roadmap: personalizedRoadmap
        });

    } catch (error) {
        console.error('Custom Role Error:', error);
        res.status(500).json({ message: 'Server error generating custom roadmap' });
    }
};

const getJobSuggestions = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) return res.json({ suggestions: [] });

        const query = q.trim().toLowerCase();
        
        // CHECK CACHE
        const cached = suggestionCache.get(query);
        if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
            return res.json({ suggestions: cached.data });
        }

        const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://127.0.0.1:8011';
        const aiRes = await axios.get(`${aiServiceUrl}/api/job-suggestions?q=${encodeURIComponent(q)}`, { timeout: 3000 });
        const suggestions = aiRes.data.suggestions || [];
        
        // SAVE CACHE
        suggestionCache.set(query, {
            timestamp: Date.now(),
            data: suggestions
        });

        res.json({ suggestions });
    } catch (error) {
        console.error('Job Suggestions Error:', error.message);
        // Fallback to static role suggestions when Python AI is unavailable
        const staticSuggestions = getStaticSuggestions(query);
        res.json({ suggestions: staticSuggestions });
    }
};

module.exports = {
    getJobRoles,
    analyzeSkillGap,
    analyzeCustomRole,
    getInDepthCurriculum,
    getJobSuggestions
};
