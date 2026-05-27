/**
 * -------------------------------------------------------
 * File: adminRoutes.js
 * Purpose: Defines secure administrative route endpoints.
 *
 * Responsibilities:
 * - Directs metrics and dashboard requests to adminController
 * - Sets double guards: checks JWT (protect) and checks role (admin)
 * - Exposes users and job role deletion capabilities
 *
 * Dependencies:
 * - express
 * - adminController
 * - authMiddleware
 *
 * Author: Manohar Kunda
 * -------------------------------------------------------
 */

const express = require('express');
const router = express.Router();
const { getUsers, getStats, addJobRole, deleteUser, getJobRoles, deleteJobRole } = require('../controllers/adminController');
const { protect, admin } = require('../middlewares/authMiddleware');

/**
 * @route   GET /api/admin/users
 * @desc    Retrieves all users enrolled on the platform
 * @access  Private (Admin Only)
 */
router.get('/users', protect, admin, getUsers);

/**
 * @route   GET /api/admin/stats
 * @desc    Retrieves global metric indicators (user count, resume uploads, quiz metrics)
 * @access  Private (Admin Only)
 */
router.get('/stats', protect, admin, getStats);

/**
 * @route   POST /api/admin/jobs
 * @desc    Manually injects / creates a new target job role
 * @access  Private (Admin Only)
 */
router.post('/jobs', protect, admin, addJobRole);

/**
 * @route   DELETE /api/admin/users/:id
 * @desc    Permanently deletes a student account
 * @access  Private (Admin Only)
 */
router.delete('/users/:id', protect, admin, deleteUser);

/**
 * @route   GET /api/admin/job-roles
 * @desc    Fetches curated job roles list
 * @access  Private (Admin Only)
 */
router.get('/job-roles', protect, admin, getJobRoles);

/**
 * @route   DELETE /api/admin/job-roles/:id
 * @desc    Deletes an existing job role and cascades deletes
 * @access  Private (Admin Only)
 */
router.delete('/job-roles/:id', protect, admin, deleteJobRole);

module.exports = router;
