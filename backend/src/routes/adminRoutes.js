const express = require('express');
const router = express.Router();
const { getUsers, getStats, addJobRole, deleteUser, getJobRoles, deleteJobRole } = require('../controllers/adminController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.get('/users', protect, admin, getUsers);
router.get('/stats', protect, admin, getStats);
router.post('/jobs', protect, admin, addJobRole);
router.delete('/users/:id', protect, admin, deleteUser);
router.get('/job-roles', protect, admin, getJobRoles);
router.delete('/job-roles/:id', protect, admin, deleteJobRole);

module.exports = router;
