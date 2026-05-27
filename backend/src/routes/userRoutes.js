/**
 * -------------------------------------------------------
 * File: userRoutes.js
 * Purpose: Routing mapping for user profile operations and image uploads.
 *
 * Responsibilities:
 * - Controls profile text query/update routes
 * - Manages profile picture uploads via Multer engine
 * - Filters profile uploads to only allow secure image extensions
 *
 * Dependencies:
 * - express
 * - multer (Multipart upload handler)
 * - userController
 * - authMiddleware
 *
 * Author: Manohar Kunda
 * -------------------------------------------------------
 */

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { getProfile, updateProfile, updateProfilePic } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/profiles/');
    },
    filename: (req, file, cb) => {
        cb(null, `user-${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

// Secure image filter validation
const upload = multer({ 
    storage,
    limits: { fileSize: 10000000 }, // 10MB size limit
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb('Error: Images Only!');
        }
    }
});

/**
 * @route   GET /api/users/profile
 * @desc    Retrieves standard profile text details for active user
 * @access  Private (Protect)
 */
router.get('/profile', protect, getProfile);

/**
 * @route   PUT /api/users/profile
 * @desc    Updates text profile information
 * @access  Private (Protect)
 */
router.put('/profile', protect, updateProfile);

/**
 * @route   PATCH /api/users/profile-pic
 * @desc    Uploads a new profile picture to disk and updates user table pic path
 * @access  Private (Protect)
 */
router.patch('/profile-pic', protect, upload.single('profilePic'), updateProfilePic);

module.exports = router;
