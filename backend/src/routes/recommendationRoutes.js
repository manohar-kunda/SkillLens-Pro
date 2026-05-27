/**
 * -----------------------------------------------------------------------------
 * File: recommendationRoutes.js
 * Component: Express Router
 * Purpose: Defines API routes for study resources recommendations and 
 *          scoring resumes against targeted profile definitions.
 *
 * Route Directory:
 * - GET  /api/recommendations/:jobRoleId - Constructs course mappings matching skill gaps
 * - POST /api/recommendations/score       - Evaluates candidate alignment score against profile
 *
 * Author: Manohar Kunda
 * -----------------------------------------------------------------------------
 */

const express = require('express');
const router = express.Router();
const { 
    getRecommendations, 
    scoreResumeAgainstJob 
} = require('../controllers/recommendationController');
const { protect } = require('../middlewares/authMiddleware');

// Retrieves chronologically ordered study links mapping to detected skill gaps
router.get('/:jobRoleId', protect, getRecommendations);

// Calculates resume-to-job-profile overlap score using live AI or local backends
router.post('/score', protect, scoreResumeAgainstJob);

module.exports = router;
