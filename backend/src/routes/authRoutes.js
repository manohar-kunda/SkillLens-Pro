/**
 * -------------------------------------------------------
 * File: authRoutes.js
 * Purpose: Defines Express endpoints for student & admin authentication.
 *
 * Responsibilities:
 * - Directs registration requests to authController
 * - Directs login requests to authController
 * - Exposes token context retrieval endpoint (/me)
 *
 * Dependencies:
 * - express
 * - authController
 * - authMiddleware
 *
 * Author: Manohar Kunda
 * -------------------------------------------------------
 */

const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

/**
 * @route   POST /api/auth/register
 * @desc    Registers a new student account
 * @access  Public
 */
router.post('/register', register);

/**
 * @route   POST /api/auth/login
 * @desc    Authenticates credentials and returns a JWT token
 * @access  Public
 */
router.post('/login', login);

/**
 * @route   GET /api/auth/me
 * @desc    Retrieves current user contextual details from JWT
 * @access  Private (Protect)
 */
router.get('/me', protect, (req, res) => {
    res.json({ message: 'If you see this, you are authenticated.', user: req.user });
});

module.exports = router;
