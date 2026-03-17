const express = require('express');
const router = express.Router();
const { getAllSkills, getQuizBySkill, submitQuizAnswers } = require('../controllers/quizController');
const { getAIInterviewQuestions, evaluateAIInterviewAnswer } = require('../controllers/aiInterviewController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/all', protect, getAllSkills);
router.get('/:skillId', protect, getQuizBySkill);
router.post('/:quizId/submit', protect, submitQuizAnswers);

// AI Voice Interview Routes
router.post('/ai-interview/questions', protect, getAIInterviewQuestions);
router.post('/ai-interview/evaluate', protect, evaluateAIInterviewAnswer);

module.exports = router;
