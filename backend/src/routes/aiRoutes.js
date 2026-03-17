const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { protect } = require('../middlewares/authMiddleware');

// All AI chats require authentication
router.post('/chat', protect, aiController.chatWithAI);

module.exports = router;
