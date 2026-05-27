/**
 * -------------------------------------------------------
 * File: resumeController.js
 * Purpose: Coordinates binary resume parsing, ATS scoring,
 * and profile skill synchronization.
 *
 * Responsibilities:
 * - Directs incoming multi-part resume file uploads
 * - Orchestrates communications with the FastAPI AI service
 * - Handles local Node.js skill analysis fallback when AI service is offline
 * - Syncs newly discovered skills with the database tables
 *
 * Dependencies:
 * - axios
 * - db (MySQL Connection Pool)
 * - form-data
 * - fs (Local file system buffers)
 * - axiosWithRetry
 * - localAnalyzer
 *
 * Author: Manohar Kunda
 * -------------------------------------------------------
 */

const pool = require('../config/db');
const axios = require('axios');
const axiosWithRetry = require('../utils/axiosWithRetry');
const { analyzeResumeLocally } = require('../utils/localAnalyzer');
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://127.0.0.1:8011';
const FormData = require('form-data');
const fs = require('fs');

/**
 * Uploads a student's resume PDF/DOCX, delegates parsing to FastAPI,
 * records results, and updates the user's active skills.
 *
 * Runs a multi-tier parsing flow:
 * 1. Read uploaded file buffer.
 * 2. Send multi-part request to FastAPI NLP engine.
 * 3. Fallback to node-local spaCy approximation if FastAPI is offline.
 * 4. Sync unique extracted skills into MySQL master `skills` and mapping tables.
 *
 * @param {Object} req - Express request containing verified req.user.id and req.file
 * @param {Object} res - Express response returning resume ID and skill matching metrics
 * @returns {Promise<void>}
 * @throws {DatabaseError} - If transaction query operations fail
 */
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

        // 2. Read file into Buffer - prevents "stream aborted" on slow network transfers
        const fileBuffer = fs.readFileSync(filePath);

        // 3. Try Python AI Service first, fall back to local analyzer if unavailable
        let parsedData;
        try {
            const formData = new FormData();
            formData.append('file', fileBuffer, {
                filename: req.file.originalname,
                contentType: fileType
            });

            const aiResponse = await axiosWithRetry(() => axios.post(`${AI_SERVICE_URL}/api/analyze`, formData, {
                headers: { ...formData.getHeaders() },
                timeout: 45000,
                maxContentLength: Infinity,
                maxBodyLength: Infinity,
            }));

            parsedData = aiResponse.data.data;
            console.log('[Resume] Analyzed via Python AI Service');
        } catch (aiError) {
            // Python service unavailable — use local Node.js analyzer as fallback
            console.warn('[Resume] Python AI Service unavailable, using local fallback:', aiError.message);
            parsedData = await analyzeResumeLocally(fileBuffer, req.file.originalname);
        }

        const score = parsedData.evaluation ? parsedData.evaluation.score : 0;

        // 4. Update the resume record with the parsed data
        await pool.query(
            'UPDATE resumes SET parsed_data = ?, score = ? WHERE id = ?',
            [JSON.stringify(parsedData), score, resumeId]
        );

        // 5. Clear old extracted skills from user_skills table
        await pool.query('DELETE FROM user_skills WHERE user_id = ?', [userId]);

        // 6. Save freshly extracted skills to user_skills table
        if (parsedData.skills_extracted && parsedData.skills_extracted.length > 0) {
            for (const skillName of parsedData.skills_extracted) {
                let [skills] = await pool.query('SELECT id FROM skills WHERE name = ?', [skillName]);
                let skillId;

                if (skills.length === 0) {
                    const [newSkill] = await pool.query('INSERT INTO skills (name) VALUES (?)', [skillName]);
                    skillId = newSkill.insertId;
                } else {
                    skillId = skills[0].id;
                }

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
            analysis: parsedData.evaluation,
            source: parsedData.source || 'ai_service'
        });

    } catch (error) {
        console.error('Resume Upload Error:', error);
        res.status(500).json({ message: 'Server error processing file upload: ' + error.message });
    }
};

module.exports = {
    uploadResume
};
