const pool = require('../config/db');
const axios = require('axios');
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://127.0.0.1:8011';
const FormData = require('form-data');
const fs = require('fs');

const uploadResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a valid PDF or DOCX file' });
        }

        const userId = req.user.id;
        const filePath = req.file.path;
        const fileType = req.file.mimetype;

        // 1. Save initial record into Database
        const [result] = await pool.query(
            'INSERT INTO resumes (user_id, file_path, file_type) VALUES (?, ?, ?)',
            [userId, filePath, fileType]
        );

        const resumeId = result.insertId;

        // 2. Call the Python AI Service
        const formData = new FormData();
        formData.append('file', fs.createReadStream(filePath));

        try {
            const aiResponse = await axios.post(`${AI_SERVICE_URL}/api/analyze`, formData, {
                headers: {
                    ...formData.getHeaders(),
                },
            });

            const parsedData = aiResponse.data.data;
            const score = parsedData.evaluation ? parsedData.evaluation.score : 0;
            
            // 3. Update the resume record with the parsed data
            await pool.query(
                'UPDATE resumes SET parsed_data = ?, score = ? WHERE id = ?',
                [JSON.stringify(parsedData), score, resumeId]
            );

            // 4. Clear old extracted skills from user_skills table so this new resume is the source of truth
            await pool.query('DELETE FROM user_skills WHERE user_id = ?', [userId]);

            // 5. Save freshly extracted skills to user_skills table
            if (parsedData.skills_extracted && parsedData.skills_extracted.length > 0) {
                for (const skillName of parsedData.skills_extracted) {
                    // Find or create skill
                    let [skills] = await pool.query('SELECT id FROM skills WHERE name = ?', [skillName]);
                    let skillId;
                    
                    if (skills.length === 0) {
                        const [newSkill] = await pool.query('INSERT INTO skills (name) VALUES (?)', [skillName]);
                        skillId = newSkill.insertId;
                    } else {
                        skillId = skills[0].id;
                    }

                    // Insert into user_skills (ignore if already exists due to composite primary key)
                    await pool.query(
                        'INSERT IGNORE INTO user_skills (user_id, skill_id, proficiency_level, source_resume_id) VALUES (?, ?, ?, ?)',
                        [userId, skillId, 'beginner', resumeId]
                    );
                }
            }

            res.status(201).json({
                message: 'Resume uploaded and analyzed successfully',
                resumeId,
                score,
                analysis: parsedData.evaluation
            });

        } catch (aiError) {
            console.error('AI Service Error:', aiError.response ? aiError.response.data : aiError.message);
            res.status(500).json({ message: 'Resume uploaded, but AI analysis failed.', resumeId });
        }

    } catch (error) {
        console.error('Resume Upload Error:', error);
        res.status(500).json({ message: 'Server error processing file upload' });
    }
};

module.exports = {
    uploadResume
};
