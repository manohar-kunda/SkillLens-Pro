/**
 * -----------------------------------------------------------------------------
 * File: db.js
 * Component: Backend Database Configuration
 * Purpose: Instantiates a relational database connection pool using the high-performance
 *          `mysql2/promise` driver, targeting the MySQL instance.
 *
 * Responsibilities:
 * - Read database connection host, credentials, and SSL preferences from environmental configurations.
 * - Establish a promise-based connection pool to run non-blocking async queries.
 * - Harden connections by setting bounds preventing server connections leaks.
 * - Encapsulate SSL connection settings supporting secure cloud instances (e.g. Aiven, AWS RDS).
 *
 * Pool Configurations:
 * - `waitForConnections`: true (Blocks queries and queue them instead of throwing immediate errors)
 * - `connectionLimit`: 10 (Allocates maximum concurrent open connections to DB)
 * - `queueLimit`: 0 (Limits queue sizing, 0 is unlimited)
 *
 * SQL Injection (SQLi) Hardening Note:
 * - This project uses raw connection pools instead of full ORMs. SQLi safety is strictly 
 *   enforced by executing parameterized queries (`pool.query(query, [values])`) in all MVC controllers.
 *
 * Author: Manohar Kunda
 * -----------------------------------------------------------------------------
 */

const mysql = require('mysql2/promise');

// Instantiates the MySQL2 promise-based pool interface
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'skilllens_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // Enables secure SSL handshakes for production database endpoints
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : null
});

module.exports = pool;
