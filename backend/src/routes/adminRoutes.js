const express = require('express');
const router = express.Router();
const { getUsers, getStats, addJobRole } = require('../controllers/adminController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.get('/users', protect, admin, getUsers);
router.get('/stats', protect, admin, getStats);
router.post('/jobs', protect, admin, addJobRole);

module.exports = router;
