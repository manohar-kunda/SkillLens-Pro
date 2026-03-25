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
    const [r] = await pool.query(
      "UPDATE users SET role='admin' WHERE email='manoharkunda5@gmail.com'"
    );
    console.log('Rows updated:', r.affectedRows);
    const [u] = await pool.query(
      "SELECT id, name, email, role FROM users WHERE email='manoharkunda5@gmail.com'"
    );
    console.log('User now:', JSON.stringify(u[0]));
    await pool.end();
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
})();
