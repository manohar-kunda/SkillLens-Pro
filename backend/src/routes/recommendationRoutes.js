const express = require('express');
const router = express.Router();
const { getRecommendations, scoreResumeAgainstJob } = require('../controllers/recommendationController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/:jobRoleId', protect, getRecommendations);
router.post('/score', protect, scoreResumeAgainstJob);

module.exports = router;
