/**
 * -------------------------------------------------------
 * File: adminController.js
 * Purpose: Handles all platform-wide administrative functions,
 * including user management, role injection, and metric analytics.
 *
 * Responsibilities:
 * - Gathers global platform stats (user counts, resumes, quizzes)
 * - Queries and deletes user profiles
 * - Manages target job role creation and deletions
 *
 * Dependencies:
 * - db (MySQL Connection Pool)
 *
 * Author: Manohar Kunda
 * -------------------------------------------------------
 */

const pool = require('../config/db');

/**
 * Retrieves all registered users in descending order of creation.
 *
 * @param {Object} req - Express request
 * @param {Object} res - Express response returning user list
 * @returns {Promise<void>}
 */
const getUsers = async (req, res) => {
  try {
    const [users] = await pool.query('SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC');
    res.json(users);
  } catch (error) {
    console.error('Admin getUsers Error:', error);
    res.status(500).json({ message: 'Server error retrieving users' });
  }
};

/**
 * Gathers aggregate platform metrics for display on the admin panel dashboard.
 *
 * @param {Object} req - Express request
 * @param {Object} res - Express response returning total counts
 * @returns {Promise<void>}
 */
const getStats = async (req, res) => {
  try {
    const [[{ totalUsers }]] = await pool.query('SELECT COUNT(*) as totalUsers FROM users');
    const [[{ totalResumes }]] = await pool.query('SELECT COUNT(*) as totalResumes FROM resumes');
    const [[{ totalJobs }]] = await pool.query('SELECT COUNT(*) as totalJobs FROM job_roles');
    const [[{ totalQuizzesTaken }]] = await pool.query('SELECT COUNT(*) as totalQuizzesTaken FROM user_results');

    res.json({
        totalUsers,
        totalResumes,
        totalJobs,
        totalQuizzesTaken
    });
  } catch (error) {
    console.error('Admin getStats Error:', error);
    res.status(500).json({ message: 'Server error retrieving stats' });
  }
};

/**
 * Creates a new curated job role in the database.
 *
 * @param {Object} req - Express request containing title and description in req.body
 * @param {Object} res - Express response returning success status and new role ID
 * @returns {Promise<void>}
 */
const addJobRole = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title) return res.status(400).json({ message: 'Job title is required' });

    const [result] = await pool.query('INSERT INTO job_roles (title, description) VALUES (?, ?)', [title, description]);
    res.json({ message: 'Job role created successfully', jobId: result.insertId });
  } catch (error) {
    console.error('Admin addJobRole Error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
       return res.status(400).json({ message: 'Job role already exists' });
    }
    res.status(500).json({ message: 'Server error creating job role' });
  }
};

/**
 * Permanently deletes a user from the platform (cascading deletes and clearing foreign relationships).
 *
 * @param {Object} req - Express request with user ID in req.params
 * @param {Object} res - Express response returning status
 * @returns {Promise<void>}
 */
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM users WHERE id = ?', [id]);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Admin deleteUser Error:', error);
    res.status(500).json({ message: 'Server error deleting user' });
  }
};

/**
 * Retrieves all registered job roles sorted alphabetically by title.
 *
 * @param {Object} req - Express request
 * @param {Object} res - Express response returning job roles list
 * @returns {Promise<void>}
 */
const getJobRoles = async (req, res) => {
  try {
    const [roles] = await pool.query('SELECT * FROM job_roles ORDER BY title ASC');
    res.json(roles);
  } catch (error) {
    console.error('Admin getJobRoles Error:', error);
    res.status(500).json({ message: 'Server error retrieving job roles' });
  }
};

/**
 * Deletes a curated job role from the database, automatically purging gaps and mapping profiles.
 *
 * @param {Object} req - Express request with role ID in req.params
 * @param {Object} res - Express response returning status
 * @returns {Promise<void>}
 */
const deleteJobRole = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM job_roles WHERE id = ?', [id]);
    res.json({ message: 'Job role deleted successfully' });
  } catch (error) {
    console.error('Admin deleteJobRole Error:', error);
    res.status(500).json({ message: 'Server error deleting job role' });
  }
};

module.exports = {
    getUsers,
    getStats,
    addJobRole,
    deleteUser,
    getJobRoles,
    deleteJobRole
};
