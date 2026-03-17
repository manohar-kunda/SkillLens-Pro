const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'skilllens_db'
});

async function seed() {
    try {
        const [skillRes] = await pool.query('SELECT id FROM skills WHERE name = ?', ['python']);
        let skillId;
        if(skillRes.length === 0) {
            const [ins] = await pool.query("INSERT INTO skills (name) VALUES (?)", ['python']);
            skillId = ins.insertId;
        } else {
            skillId = skillRes[0].id;
        }
        
        const [quizRes] = await pool.query('INSERT INTO quizzes (skill_id, title, difficulty) VALUES (?, ?, ?)', [skillId, 'Python Basics Mock Interview', 'medium']);
        const quizId = quizRes.insertId;
        
        await pool.query('INSERT INTO questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option) VALUES (?, ?, ?, ?, ?, ?, ?)', [quizId, 'What is the correct file extension for Python files?', '.pyt', '.py', '.pt', '.pyth', 'B']);
        await pool.query('INSERT INTO questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option) VALUES (?, ?, ?, ?, ?, ?, ?)', [quizId, 'How do you create a variable with the numeric value 5?', 'x = int(5)', 'x = 5', 'Both are correct', 'None', 'C']);
        await pool.query('INSERT INTO questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option) VALUES (?, ?, ?, ?, ?, ?, ?)', [quizId, 'What is the correct syntax to output "Hello World" in Python?', 'print("Hello World")', 'echo "Hello World"', 'p("Hello World")', 'print Hello', 'A']);
        await pool.query('INSERT INTO questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option) VALUES (?, ?, ?, ?, ?, ?, ?)', [quizId, 'Which of the following is a Python tuple?', '[1, 2, 3]', '{1, 2, 3}', '(1, 2, 3)', '<1, 2, 3>', 'C']);
        await pool.query('INSERT INTO questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option) VALUES (?, ?, ?, ?, ?, ?, ?)', [quizId, 'Which collection is ordered, changeable, and allows duplicate members?', 'Set', 'Tuple', 'Dictionary', 'List', 'D']);
        
        console.log('Successfully seeded local fallback Python quiz.');
    } catch(e) {
        console.error(e.message);
    } finally {
        process.exit(0);
    }
}
seed();
