/**
 * -----------------------------------------------------------------------------
 * File: resumeBuilderController.js
 * Component: Backend MVC Controller
 * Purpose: Manages user inputs and configuration details for the interactive 
 *          Resume Builder module.
 *
 * Responsibilities:
 * - Serialize and save structured resume sections (experience, education, projects, 
 *   certifications, languages, and achievements) as JSON strings into the relational store.
 * - Retrieve user-built resume profile segments and parse MySQL serialized JSON fields 
 *   back to active Javascript arrays for immediate frontend UI rendering.
 * - Check and handle updates (UPSERT logic: update if exists, insert if new).
 *
 * Database Table Utilized:
 * - `resume_builder_info` (Contains user_id primary key, phone, address, and JSON columns)
 *
 * Author: Manohar Kunda
 * -----------------------------------------------------------------------------
 */

const pool = require('../config/db');

/**
 * Saves or updates structured candidate information in the database (UPSERT).
 *
 * Details:
 * 1. Checks if a profile configuration already exists for the authenticated user ID.
 * 2. Serializes nested array objects (experience, projects, education, certs, achievements) 
 *    into secure JSON string segments.
 * 3. Executes UPDATE if matching record is present, otherwise executes INSERT.
 *
 * @param {Object} req - Express request object containing parsed JSON body coordinates.
 * @param {Object} res - Express response returning success status.
 * @returns {Promise<void>}
 */
const saveResumeInfo = async (req, res) => {
    try {
        const { 
            phone, address, summary, experience, education, projects, skills, template_id,
            github_url, linkedin_url, portfolio_url, certifications, languages, achievements 
        } = req.body;
        const userId = req.user.id;

        // Perform existence lookup to determine insert vs update pathways
        const [existing] = await pool.query('SELECT id FROM resume_builder_info WHERE user_id = ?', [userId]);

        const queryParams = [
            phone, address, summary, 
            JSON.stringify(experience), JSON.stringify(education), JSON.stringify(projects), JSON.stringify(skills), 
            template_id || 'template1',
            github_url, linkedin_url, portfolio_url,
            JSON.stringify(certifications || []), JSON.stringify(languages || []), JSON.stringify(achievements || [])
        ];

        if (existing.length > 0) {
            // Record exists: Perform UPDATE operation
            await pool.query(
                `UPDATE resume_builder_info 
                 SET phone = ?, address = ?, summary = ?, experience = ?, education = ?, projects = ?, skills = ?, template_id = ?,
                     github_url = ?, linkedin_url = ?, portfolio_url = ?, certifications = ?, languages = ?, achievements = ?
                 WHERE user_id = ?`,
                [...queryParams, userId]
            );
            res.json({ message: 'Resume information updated successfully' });
        } else {
            // New entry: Perform INSERT operation
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

/**
 * Retrieves the compiled builder configuration mapping for the authenticated user.
 * De-serializes database JSON columns (experience, education, projects, skills, etc.)
 * back to Javascript object format to ensure clean, structured state ingestion by React.
 *
 * @param {Object} req - Express request holding verified user credentials.
 * @param {Object} res - Express response returning parsed data or empty payload.
 * @returns {Promise<void>}
 */
const getResumeInfo = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM resume_builder_info WHERE user_id = ?', [req.user.id]);
        
        if (rows.length === 0) {
            return res.json({}); // Return clean empty structure to allow UI input defaults initialization
        }

        const data = rows[0];
        
        // Parse raw DB JSON string payloads safely back to high-fidelity Javascript objects
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
