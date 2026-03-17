const express = require('express');
const router = express.Router();
const { uploadResume } = require('../controllers/resumeController');
const { saveResumeInfo, getResumeInfo } = require('../controllers/resumeBuilderController');
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

// Route: POST /api/resumes/upload
router.post('/upload', protect, upload.single('resume'), uploadResume);

// Resume Builder Routes
router.get('/builder', protect, getResumeInfo);
router.post('/builder', protect, saveResumeInfo);

module.exports = router;
