const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/register', register);
router.post('/login', login);

// Example protected route for testing
router.get('/me', protect, (req, res) => {
    res.json({ message: 'If you see this, you are authenticated.', user: req.user });
});

module.exports = router;
