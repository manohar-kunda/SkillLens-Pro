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
        const [skillRes] = await pool.query('SELECT id FROM skills WHERE name = ?', ['linux']);
        let skillId;
        if(skillRes.length === 0) {
            const [ins] = await pool.query("INSERT INTO skills (name) VALUES (?)", ['linux']);
            skillId = ins.insertId;
        } else {
            skillId = skillRes[0].id;
        }
        
        const [quizRes] = await pool.query('INSERT INTO quizzes (skill_id, title, difficulty) VALUES (?, ?, ?)', [skillId, 'Linux Fundamentals Assessment', 'medium']);
        const quizId = quizRes.insertId;
        
        await pool.query('INSERT INTO questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option) VALUES (?, ?, ?, ?, ?, ?, ?)', [quizId, 'Which command is used to list all files and directories including hidden ones in Linux?', 'ls -l', 'ls -a', 'dir -h', 'show -all', 'B']);
        await pool.query('INSERT INTO questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option) VALUES (?, ?, ?, ?, ?, ?, ?)', [quizId, 'What command changes a files permissions?', 'chown', 'chmod', 'chgrp', 'perm', 'B']);
        await pool.query('INSERT INTO questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option) VALUES (?, ?, ?, ?, ?, ?, ?)', [quizId, 'Which directory contains configuration files for the system?', '/etc', '/bin', '/usr', '/var', 'A']);
        await pool.query('INSERT INTO questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option) VALUES (?, ?, ?, ?, ?, ?, ?)', [quizId, 'What command creates an empty file?', 'make', 'create', 'touch', 'new', 'C']);
        await pool.query('INSERT INTO questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option) VALUES (?, ?, ?, ?, ?, ?, ?)', [quizId, 'Which of these commands locates a process ID by name?', 'top', 'find', 'pidof', 'search', 'C']);
        
        console.log('Successfully seeded local fallback Linux quiz.');
    } catch(e) {
        console.error(e.message);
    } finally {
        process.exit(0);
    }
}
seed();
