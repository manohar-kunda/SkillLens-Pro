/**
 * -------------------------------------------------------
 * File: aiRoutes.js
 * Purpose: Routing configuration for general AI assistant chats.
 *
 * Responsibilities:
 * - Coordinates user chats with standard security guards
 * - Integrates with multi-tier LLM fallbacks via aiController
 *
 * Dependencies:
 * - express
 * - aiController
 * - authMiddleware
 *
 * Author: Manohar Kunda
 * -------------------------------------------------------
 */

const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { protect } = require('../middlewares/authMiddleware');

/**
 * @route   POST /api/ai/chat
 * @desc    Executes high-speed chat query via Groq (llama) or Python microservice
 * @access  Private (Protect)
 */
router.post('/chat', protect, aiController.chatWithAI);

module.exports = router;
