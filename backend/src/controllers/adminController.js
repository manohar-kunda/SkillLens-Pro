const pool = require('../config/db');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const [users] = await pool.query('SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC');
    res.json(users);
  } catch (error) {
    console.error('Admin getUsers Error:', error);
    res.status(500).json({ message: 'Server error retrieving users' });
  }
};

// @desc    Get platform statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
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

// @desc    Add a new job role
// @route   POST /api/admin/jobs
// @access  Private/Admin
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

module.exports = {
    getUsers,
    getStats,
    addJobRole
};
