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
        const [skillRes] = await pool.query('SELECT id FROM skills WHERE name = ?', ['java']);
        let skillId;
        if(skillRes.length === 0) {
            const [ins] = await pool.query("INSERT INTO skills (name) VALUES (?)", ['java']);
            skillId = ins.insertId;
        } else {
            skillId = skillRes[0].id;
        }
        
        const [quizRes] = await pool.query('INSERT INTO quizzes (skill_id, title, difficulty) VALUES (?, ?, ?)', [skillId, 'Core Java Assessment', 'medium']);
        const quizId = quizRes.insertId;
        
        await pool.query('INSERT INTO questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option) VALUES (?, ?, ?, ?, ?, ?, ?)', [quizId, 'Which of these is not a feature of Java?', 'Object-oriented', 'Use of pointers', 'Portable', 'Dynamic and Extensible', 'B']);
        await pool.query('INSERT INTO questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option) VALUES (?, ?, ?, ?, ?, ?, ?)', [quizId, 'True or False: Java is a strictly pass-by-reference language.', 'True', 'False, it is pass-by-value', 'Only for primitives', 'Only for objects', 'B']);
        await pool.query('INSERT INTO questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option) VALUES (?, ?, ?, ?, ?, ?, ?)', [quizId, 'Which component is responsible to run java program?', 'JVM', 'JDK', 'JRE', 'JIT', 'A']);
        await pool.query('INSERT INTO questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option) VALUES (?, ?, ?, ?, ?, ?, ?)', [quizId, 'What is the default value of a boolean variable in Java?', 'true', 'false', '0', 'null', 'B']);
        await pool.query('INSERT INTO questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option) VALUES (?, ?, ?, ?, ?, ?, ?)', [quizId, 'Which keyword is used for accessing the features of a package?', 'package', 'import', 'extends', 'export', 'B']);
        
        console.log('Successfully seeded local fallback Java quiz.');
    } catch(e) {
        console.error(e.message);
    } finally {
        process.exit(0);
    }
}
seed();
