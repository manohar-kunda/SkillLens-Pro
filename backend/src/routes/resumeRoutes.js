/**
 * -------------------------------------------------------
 * File: resumeRoutes.js
 * Purpose: Routes for uploading parsed resume assets and managing resume builder templates.
 *
 * Responsibilities:
 * - Manages PDF/DOCX file uploads using uploadMiddleware
 * - Directs parsed resume extraction processing to resumeController
 * - Handles resume builder structured data mapping via resumeBuilderController
 *
 * Dependencies:
 * - express
 * - resumeController
 * - resumeBuilderController
 * - authMiddleware
 * - uploadMiddleware
 *
 * Author: Manohar Kunda
 * -------------------------------------------------------
 */

const express = require('express');
const router = express.Router();
const { uploadResume } = require('../controllers/resumeController');
const { saveResumeInfo, getResumeInfo } = require('../controllers/resumeBuilderController');
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

/**
 * @route   POST /api/resumes/upload
 * @desc    Uploads a binary resume (PDF/DOCX) file and triggers FastAPI spaCy parsing
 * @access  Private (Protect)
 */
router.post('/upload', protect, upload.single('resume'), uploadResume);

/**
 * @route   GET /api/resumes/builder
 * @desc    Retrieves saved resume builder template text and lists (experience, projects, education)
 * @access  Private (Protect)
 */
router.get('/builder', protect, getResumeInfo);

/**
 * @route   POST /api/resumes/builder
 * @desc    Saves / Updates structured template information in JSON columns
 * @access  Private (Protect)
 */
router.post('/builder', protect, saveResumeInfo);

module.exports = router;
