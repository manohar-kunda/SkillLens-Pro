const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

async function setupDB() {
    try {
        // Create connection without selecting database first
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 3306,
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            multipleStatements: true,
            ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : null
        });

        console.log('Connected to MySQL server.');

        // Read init.sql
        const initSqlPath = path.join(__dirname, 'init.sql');
        const initSql = fs.readFileSync(initSqlPath, 'utf8');
        
        console.log('Running init.sql...');
        await connection.query(initSql);
        console.log('init.sql executed successfully.');

        // Read seed.sql
        const seedSqlPath = path.join(__dirname, 'seed.sql');
        const seedSql = fs.readFileSync(seedSqlPath, 'utf8');

        console.log('Running seed.sql...');
        await connection.query(seedSql);
        console.log('seed.sql executed successfully.');

        console.log('Database setup complete!');
        process.exit(0);
    } catch (error) {
        console.error('Error setting up the database:', error);
        process.exit(1);
    }
}

setupDB();
