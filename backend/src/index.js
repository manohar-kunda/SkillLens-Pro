/**
 * -----------------------------------------------------------------------------
 * File: index.js
 * Component: Backend Entry Point
 * Purpose: Launches the Express HTTP server, binding to the configured network
 *          port.
 *
 * Responsibilities:
 * - Load system-wide configurations from environment variables (`dotenv`).
 * - Mount and listen to Express application instances.
 * - Establish active logging for successful boots indicating target execution modes.
 *
 * Author: Manohar Kunda
 * -----------------------------------------------------------------------------
 */

require('dotenv').config();
const app = require('./app');

// Network port allocation config with fallback
const PORT = process.env.PORT || 5000;

// Listen to incoming connections on allocated port interface
app.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
