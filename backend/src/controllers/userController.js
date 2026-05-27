/**
 * -------------------------------------------------------
 * File: userController.js
 * Purpose: Handles user profile retrieval, textual updates,
 * and profile picture uploads.
 *
 * Responsibilities:
 * - Fetches complete profile records from user table
 * - Updates name, social handles, and GitHub details
 * - Commits newly uploaded avatar path to the users record
 *
 * Dependencies:
 * - db (MySQL Connection Pool)
 *
 * Author: Manohar Kunda
 * -------------------------------------------------------
 */

const pool = require('../config/db');

/**
 * Retrieves the profile metadata of the currently authenticated user.
 *
 * @param {Object} req - Express request object containing verified req.user.id
 * @param {Object} res - Express response object returning the matching user record
 * @returns {Promise<void>}
 */
const getProfile = async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT id, name, first_name, last_name, email, github_url, linkedin_url, profile_pic, role, created_at FROM users WHERE id = ?',
            [req.user.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Get Profile Error:', error);
        res.status(500).json({ message: 'Server error while fetching profile' });
    }
};

/**
 * Updates textual profile attributes (first name, last name, and social handles).
 *
 * @param {Object} req - Express request object containing req.body update payloads
 * @param {Object} res - Express response object returning success status
 * @returns {Promise<void>}
 */
const updateProfile = async (req, res) => {
    try {
        const { first_name, last_name, github_url, linkedin_url } = req.body;

        await pool.query(
            `UPDATE users 
             SET first_name = ?, last_name = ?, github_url = ?, linkedin_url = ?
             WHERE id = ?`,
            [first_name, last_name, github_url, linkedin_url, req.user.id]
        );

        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Update Profile Error:', error);
        res.status(500).json({ message: 'Server error while updating profile' });
    }
};

/**
 * Commits the filepath of a newly uploaded avatar picture into the user's row.
 *
 * @param {Object} req - Express request containing single Multer req.file info
 * @param {Object} res - Express response returning the secure local filepath of the picture
 * @returns {Promise<void>}
 */
const updateProfilePic = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a file' });
        }

        const profilePicPath = `/uploads/profiles/${req.file.filename}`;

        await pool.query(
            'UPDATE users SET profile_pic = ? WHERE id = ?',
            [profilePicPath, req.user.id]
        );

        res.json({ 
            message: 'Profile picture updated successfully',
            profile_pic: profilePicPath
        });
    } catch (error) {
        console.error('Update Profile Pic Error:', error);
        res.status(500).json({ message: 'Server error while updating profile picture' });
    }
};

module.exports = {
    getProfile,
    updateProfile,
    updateProfilePic
};
