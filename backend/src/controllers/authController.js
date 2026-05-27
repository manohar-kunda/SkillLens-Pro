/**
 * -------------------------------------------------------
 * File: authController.js
 * Purpose: Handles authentication operations including login,
 * registration, JWT token generation, and password validation.
 *
 * Responsibilities:
 * - Directs user registration and email validation checks
 * - Generates bcrypt salt hashes for securing passwords
 * - Validates credentials during login procedures
 * - Creates 30-day signed JWT tokens for authenticated sessions
 *
 * Dependencies:
 * - bcryptjs
 * - jsonwebtoken
 * - db (MySQL Connection Pool)
 *
 * Author: Manohar Kunda
 * -------------------------------------------------------
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

/**
 * Registers a new student or admin user.
 *
 * @param {Object} req - Express request object containing name, email, password, and role
 * @param {Object} res - Express response object returning the signed token and registered profile
 * @returns {Promise<void>}
 * @throws {DatabaseError} - If database insertions fail
 */
const register = async (req, res) => {
  try {
    let { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
    
    email = email.trim().toLowerCase();

    // Check if user already exists
    const [existingUsers] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert the new user
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role || 'student']
    );

    const newUserId = result.insertId;

    // Generate JWT token
    const token = jwt.sign(
      { id: newUserId, role: role || 'student' },
      process.env.JWT_SECRET || 'fallback_secret_key',
      { expiresIn: '30d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUserId,
        name,
        email,
        role: role || 'student',
        profile_pic: null // New users don't have a pic yet
      }
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

/**
 * Authenticates user credentials and returns a JWT session token.
 *
 * @param {Object} req - Express request object containing email and password
 * @param {Object} res - Express response object returning JWT token and user profile
 * @returns {Promise<void>}
 * @throws {DatabaseError} - If user lookup fails
 */
const login = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    email = email.trim().toLowerCase();

    // Find user
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = users[0];

    // Check password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate Token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'fallback_secret_key',
      { expiresIn: '30d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile_pic: user.profile_pic
      }
    });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

module.exports = {
  register,
  login
};
