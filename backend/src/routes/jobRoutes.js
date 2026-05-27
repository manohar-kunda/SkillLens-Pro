/**
 * -----------------------------------------------------------------------------
 * File: jobRoutes.js
 * Component: Express Router
 * Purpose: Defines API routes for career discovery, custom roadmap analysis,
 *          dynamic curriculum extraction, and user skill gap scans.
 *
 * Route Directory:
 * - GET  /api/jobs/              - Retrieves all predefined jobs in system
 * - GET  /api/jobs/suggestions   - Retrieves career autocomplete names list
 * - POST /api/jobs/custom-roadmap- Generates dynamic AI career roadmap charts
 * - GET  /api/jobs/curriculum/:roleName - Scrapes curriculum information
 * - POST /api/jobs/:id/analyze-gap - Maps missing skill gaps for a specific job
 *
 * Author: Manohar Kunda
 * -----------------------------------------------------------------------------
 */

const express = require('express');
const router = express.Router();
const { 
    getJobRoles, 
    analyzeSkillGap, 
    analyzeCustomRole, 
    getInDepthCurriculum, 
    getJobSuggestions 
} = require('../controllers/jobController');
const { protect } = require('../middlewares/authMiddleware');

// Get list of standard curated job roles
router.get('/', getJobRoles);

// Get matching search suggestion strings for career role search fields
router.get('/suggestions', getJobSuggestions);

// Request dynamically created roadmaps for customized career roles
router.post('/custom-roadmap', protect, analyzeCustomRole);

// Scrapes custom deep educational curriculum mapping files
router.get('/curriculum/:roleName', protect, getInDepthCurriculum);

// Execute algorithm computing fit percentage and missing skill sets
router.post('/:id/analyze-gap', protect, analyzeSkillGap);

module.exports = router;
