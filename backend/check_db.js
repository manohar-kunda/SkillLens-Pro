const mysql = require('mysql2/promise');
async function run() {
  const conn = await mysql.createConnection({ host: 'localhost', user: 'root', database: 'skilllens_db' });
  const [rows] = await conn.query(`
    SELECT s.name, q.difficulty, COUNT(qs.id) as count 
    FROM skills s 
    LEFT JOIN quizzes q ON s.id = q.skill_id 
    LEFT JOIN questions qs ON q.id = qs.quiz_id 
    GROUP BY s.name, q.difficulty
    ORDER BY s.name, q.difficulty;
  `);
  console.log("DB Content:");
  console.table(rows);
  await conn.end();
}
run();
