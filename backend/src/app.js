/**
 * -----------------------------------------------------------------------------
 * File: app.js
 * Component: Express Application Bootstrapper
 * Purpose: Central Express configuration module. Integrates request parsers,
 *          CORS security controls, developmental logging, static uploads routing,
 *          and mounts REST API routers.
 *
 * Responsibilities:
 * - Configure CORS options supporting specific client domains.
 * - Wire up body-parsers (`express.json`, `urlencoded`) to process REST payloads.
 * - Establish development request logger interceptors (`morgan`).
 * - Expose `/api/health` endpoints for orchestration probes and container monitors.
 * - Set up static file-serving directories for multipart uploaded user files.
 * - Orchestrate main routing mounting coordinates mapping sub-modules.
 *
 * Author: Manohar Kunda
 * -----------------------------------------------------------------------------
 */

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// CORS (Cross-Origin Resource Sharing) Security Hardening Options
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
};
app.use(cors(corsOptions));

// Foundational Express request body parsing middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTTP Request Logger Middleware
app.use(morgan('dev'));

// Import API Routing Sub-Modules
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const jobRoutes = require('./routes/jobRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const quizRoutes = require('./routes/quizRoutes');
const adminRoutes = require('./routes/adminRoutes');
const aiRoutes = require('./routes/aiRoutes');
const path = require('path');

/**
 * Health Check Probe Endpoint.
 * Utilized by orchestration tools (Kubernetes/Render/AWS) to monitor service availability.
 *
 * @route   GET /api/health
 * @access  Public
 */
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'SkillLens API is running smoothly.' });
});

// Serve Local Disk Multi-part Document Uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Mount Main Gateway REST Routers
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ai', aiRoutes);

module.exports = app;
