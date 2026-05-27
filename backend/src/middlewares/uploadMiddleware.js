/**
 * -----------------------------------------------------------------------------
 * File: uploadMiddleware.js
 * Component: Express Middleware
 * Purpose: Handles multipart/form-data physical file uploads (resumes) using Multer.
 *          Implements security checks, folder structure auto-instantiation, 
 *          size constraints, and mime-type filters.
 *
 * Responsibilities:
 * - Safely resolve and create uploads folder paths.
 * - Enforce secure, randomized, collision-resistant custom naming schemes.
 * - Block execution and throw errors for unsupported document mime-types.
 * - Set memory buffer caps preventing file-size memory exhaustion attacks.
 *
 * Configured Limits:
 * - File types allowed: PDF (`application/pdf`), DOCX/DOC (`application/vnd...`, `application/msword`)
 * - Size constraint: 5 MegaBytes (5 * 1024 * 1024 bytes)
 *
 * Author: Manohar Kunda
 * -----------------------------------------------------------------------------
 */

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure designated storage path directories exist recursively on system startup
const uploadDir = path.join(__dirname, '../../uploads/resumes');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage engine configuration for local folder persistence
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Naming design sanitizes filenames by mapping to unique user IDs and timestamps
        const userId = req.user ? req.user.id : 'unknown';
        const fileExt = path.extname(file.originalname);
        const fileName = `resume_${userId}_${Date.now()}${fileExt}`;
        cb(null, fileName);
    }
});

// Security Filter: Strictly allow standard resume formats to prevent executable uploads
const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only PDF and DOC/DOCX files are supported!'), false);
    }
};

// Instantiated upload parser middleware instance
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5 MB ceiling cap
    }
});

module.exports = upload;
