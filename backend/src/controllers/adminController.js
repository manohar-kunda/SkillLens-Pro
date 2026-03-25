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

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
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

// @desc    Get all job roles
// @route   GET /api/admin/job-roles
// @access  Private/Admin
const getJobRoles = async (req, res) => {
  try {
    const [roles] = await pool.query('SELECT * FROM job_roles ORDER BY title ASC');
    res.json(roles);
  } catch (error) {
    console.error('Admin getJobRoles Error:', error);
    res.status(500).json({ message: 'Server error retrieving job roles' });
  }
};

// @desc    Delete a job role
// @route   DELETE /api/admin/job-roles/:id
// @access  Private/Admin
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
