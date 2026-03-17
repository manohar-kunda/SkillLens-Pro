const pool = require('../config/db');

// @desc    Save/Update resume builder info
// @route   POST /api/resumes/builder
// @access  Private
const saveResumeInfo = async (req, res) => {
    try {
        const { 
            phone, address, summary, experience, education, projects, skills, template_id,
            github_url, linkedin_url, portfolio_url, certifications, languages, achievements 
        } = req.body;
        const userId = req.user.id;

        // Check if info already exists for this user
        const [existing] = await pool.query('SELECT id FROM resume_builder_info WHERE user_id = ?', [userId]);

        const queryParams = [
            phone, address, summary, 
            JSON.stringify(experience), JSON.stringify(education), JSON.stringify(projects), JSON.stringify(skills), 
            template_id || 'template1',
            github_url, linkedin_url, portfolio_url,
            JSON.stringify(certifications || []), JSON.stringify(languages || []), JSON.stringify(achievements || [])
        ];

        if (existing.length > 0) {
            // Update
            await pool.query(
                `UPDATE resume_builder_info 
                 SET phone = ?, address = ?, summary = ?, experience = ?, education = ?, projects = ?, skills = ?, template_id = ?,
                     github_url = ?, linkedin_url = ?, portfolio_url = ?, certifications = ?, languages = ?, achievements = ?
                 WHERE user_id = ?`,
                [...queryParams, userId]
            );
            res.json({ message: 'Resume information updated successfully' });
        } else {
            // Insert
            await pool.query(
                `INSERT INTO resume_builder_info (
                    user_id, phone, address, summary, experience, education, projects, skills, template_id,
                    github_url, linkedin_url, portfolio_url, certifications, languages, achievements
                )
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [userId, ...queryParams]
            );
            res.status(201).json({ message: 'Resume information saved successfully' });
        }
    } catch (error) {
        console.error('Save Resume Info Error:', error);
        res.status(500).json({ message: 'Server error while saving resume info' });
    }
};

// @desc    Get resume builder info
// @route   GET /api/resumes/builder
// @access  Private
const getResumeInfo = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM resume_builder_info WHERE user_id = ?', [req.user.id]);
        
        if (rows.length === 0) {
            return res.json({}); // Return empty object if no info found
        }

        const data = rows[0];
        // Parse JSON strings back to objects
        res.json({
            ...data,
            experience: JSON.parse(data.experience || '[]'),
            education: JSON.parse(data.education || '[]'),
            projects: JSON.parse(data.projects || '[]'),
            skills: JSON.parse(data.skills || '[]'),
            certifications: JSON.parse(data.certifications || '[]'),
            languages: JSON.parse(data.languages || '[]'),
            achievements: JSON.parse(data.achievements || '[]')
        });
    } catch (error) {
        console.error('Get Resume Info Error:', error);
        res.status(500).json({ message: 'Server error while fetching resume info' });
    }
};

module.exports = {
    saveResumeInfo,
    getResumeInfo
};
