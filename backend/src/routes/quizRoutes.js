/**
 * -------------------------------------------------------
 * File: quizRoutes.js
 * Purpose: Routing configuration for standard technical quizzes and AI voice interviews.
 *
 * Responsibilities:
 * - Maps skills list, quiz question retrieval, and score submissions
 * - Directs voice interview question generation to aiInterviewController
 * - Handles audio transcript evaluations through aiInterviewController
 *
 * Dependencies:
 * - express
 * - quizController
 * - aiInterviewController
 * - authMiddleware
 *
 * Author: Manohar Kunda
 * -------------------------------------------------------
 */

const express = require('express');
const router = express.Router();
const { getAllSkills, getQuizBySkill, submitQuizAnswers } = require('../controllers/quizController');
const { getAIInterviewQuestions, evaluateAIInterviewAnswer } = require('../controllers/aiInterviewController');
const { protect } = require('../middlewares/authMiddleware');

/**
 * @route   GET /api/quizzes/all
 * @desc    Retrieves all skills with quizzes available for student testing
 * @access  Private (Protect)
 */
router.get('/all', protect, getAllSkills);

/**
 * @route   GET /api/quizzes/:skillId
 * @desc    Retrieves standard quiz options and questions for a specific skill
 * @access  Private (Protect)
 */
router.get('/:skillId', protect, getQuizBySkill);

/**
 * @route   POST /api/quizzes/:quizId/submit
 * @desc    Evaluates submitted answers, scores the quiz, and registers user results in DB
 * @access  Private (Protect)
 */
router.post('/:quizId/submit', protect, submitQuizAnswers);

/**
 * @route   POST /api/quizzes/ai-interview/questions
 * @desc    Generates open-ended voice interview questions for a role via FastAPI LLM engine
 * @access  Private (Protect)
 */
router.post('/ai-interview/questions', protect, getAIInterviewQuestions);

/**
 * @route   POST /api/quizzes/ai-interview/evaluate
 * @desc    Scores and provides feedback on speech-to-text user answers using FastAPI evaluation models
 * @access  Private (Protect)
 */
router.post('/ai-interview/evaluate', protect, evaluateAIInterviewAnswer);

module.exports = router;
