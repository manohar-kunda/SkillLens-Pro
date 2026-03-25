const mysql = require('mysql2/promise');
require('dotenv').config();

(async () => {
  try {
    const pool = mysql.createPool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: { rejectUnauthorized: false }
    });
    
    // Add columns if they don't exist
    try {
        await pool.query(`
          ALTER TABLE users
          ADD COLUMN first_name VARCHAR(100) AFTER name,
          ADD COLUMN last_name VARCHAR(100) AFTER first_name,
          ADD COLUMN github_url VARCHAR(255),
          ADD COLUMN linkedin_url VARCHAR(255),
          ADD COLUMN profile_pic VARCHAR(255)
        `);
        console.log('Added missing profile columns to users table.');
    } catch (e) {
        if (e.code === 'ER_DUP_FIELDNAME') {
            console.log('Columns already exist.');
        } else {
            throw e;
        }
    }
    
    // To ensure "Legal Name" can use the name given at registration,
    // we should run an update to copy "name" to "first_name" if "first_name" is null.
    await pool.query('UPDATE users SET first_name = name WHERE first_name IS NULL');
    
    await pool.end();
    process.exit(0);
  } catch(e) { 
    console.error(e.message); 
    process.exit(1);
  }
})();
