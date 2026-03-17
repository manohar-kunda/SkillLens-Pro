const express = require('express');
const router = express.Router();
const { getJobRoles, analyzeSkillGap, analyzeCustomRole, getInDepthCurriculum, getJobSuggestions } = require('../controllers/jobController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/', getJobRoles);
router.get('/suggestions', getJobSuggestions);
router.post('/custom-roadmap', protect, analyzeCustomRole);
router.get('/curriculum/:roleName', protect, getInDepthCurriculum);
router.post('/:id/analyze-gap', protect, analyzeSkillGap);

module.exports = router;
