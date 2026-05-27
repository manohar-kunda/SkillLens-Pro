/**
 * -----------------------------------------------------------------------------
 * File: setupDB.js
 * Component: Command-line Database Setup Utility
 * Purpose: Automates relational database bootstrap operations for developers.
 *          Creates `skilllens_db` from scratch and pre-seeds necessary tables 
 *          with default datasets.
 *
 * Responsibilities:
 * - Load base environment keys resolving local/production MySQL hosts.
 * - Create a non-db connection to verify target DB coordinates.
 * - Read structural and schema creation statements from `init.sql` and execute them.
 * - Read default seed data profiles from `seed.sql` and inject records.
 * - Output process feedback logs and gracefully exit with terminal status codes.
 *
 * Execution Command:
 * - Run `node backend/src/config/setupDB.js` or through launcher packages.
 *
 * Author: Manohar Kunda
 * -----------------------------------------------------------------------------
 */

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

/**
 * Connects to the database server, executes structure DDL schemas, and populates
 * base datasets. Exits process upon completion.
 *
 * @returns {Promise<void>}
 */
async function setupDB() {
    try {
        // Step 1: Create connection without selecting database first to ensure creation holds
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 3306,
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            multipleStatements: true, // Crucial parameter to run composite SQL scripts
            ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : null
        });

        console.log('Connected to MySQL server.');

        // Step 2: Read and execute init.sql schema specifications
        const initSqlPath = path.join(__dirname, 'init.sql');
        const initSql = fs.readFileSync(initSqlPath, 'utf8');
        
        console.log('Running init.sql...');
        await connection.query(initSql);
        console.log('init.sql executed successfully.');

        // Step 3: Read and execute seed.sql default seed profile
        const seedSqlPath = path.join(__dirname, 'seed.sql');
        const seedSql = fs.readFileSync(seedSqlPath, 'utf8');

        console.log('Running seed.sql...');
        await connection.query(seedSql);
        console.log('seed.sql executed successfully.');

        console.log('Database setup complete!');
        process.exit(0); // Terminate process with success status
    } catch (error) {
        console.error('Error setting up the database:', error);
        process.exit(1); // Terminate process with failure status
    }
}

// Immediately trigger database schema instantiation
setupDB();
