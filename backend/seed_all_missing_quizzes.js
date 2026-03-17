const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'skilllens_db'
});

async function seedAllMissing() {
    try {
        console.log('Scanning for skills without fallback quizzes...');
        
        // Find all skills that don't have a quiz
        const [missingSkills] = await pool.query(`
            SELECT s.id, s.name 
            FROM skills s 
            LEFT JOIN quizzes q ON s.id = q.skill_id 
            WHERE q.id IS NULL
        `);
        
        if (missingSkills.length === 0) {
            console.log('All skills already have a fallback quiz. Nothing to seed!');
            process.exit(0);
        }

        console.log(`Found ${missingSkills.length} skills without a quiz. Generating fallbacks...`);

        for (const skill of missingSkills) {
            const skillNameUpper = skill.name.charAt(0).toUpperCase() + skill.name.slice(1);
            
            // Insert exactly 1 Mock Quiz (Medium) for this skill
            const [quizRes] = await pool.query('INSERT INTO quizzes (skill_id, title, difficulty) VALUES (?, ?, ?)', [skill.id, `${skillNameUpper} General Assessment`, 'medium']);
            const quizId = quizRes.insertId;
            
            // Insert 5 generic but technically sound fallback questions
            await pool.query('INSERT INTO questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option) VALUES (?, ?, ?, ?, ?, ?, ?)', [quizId, `What is the primary purpose of ${skillNameUpper}?`, 'To style web pages', 'To manage databases', 'To build and engineer robust solutions', 'To format text', 'C']);
            
            await pool.query('INSERT INTO questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option) VALUES (?, ?, ?, ?, ?, ?, ?)', [quizId, `Which of the following is a best practice when working with ${skillNameUpper}?`, 'Ignoring documentation', 'Writing modular and reusable components', 'Hardcoding sensitive API keys', 'Skipping error handling', 'B']);
            
            await pool.query('INSERT INTO questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option) VALUES (?, ?, ?, ?, ?, ?, ?)', [quizId, `How can performance be optimized in a typical ${skillNameUpper} environment?`, 'By increasing the amount of unoptimized loops', 'By reducing the number of unnecessary operations and managing memory effectively', 'By duplicating code', 'By removing all comments', 'B']);
            
            await pool.query('INSERT INTO questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option) VALUES (?, ?, ?, ?, ?, ?, ?)', [quizId, `What is a common pitfall to avoid in ${skillNameUpper}?`, 'Writing unit tests', 'Documenting code', 'Using outdated or deprecated methods', 'Using version control', 'C']);
            
            await pool.query('INSERT INTO questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option) VALUES (?, ?, ?, ?, ?, ?, ?)', [quizId, `Which methodology works best for integrating ${skillNameUpper} into a CI/CD pipeline?`, 'Manual deployment only', 'Automated testing and containerization', 'Deploying only on Fridays', 'Skipping code reviews', 'B']);
            
            console.log(`Seeded 5-question fallback for: ${skillNameUpper}`);
        }
        
        console.log('Successfully seeded local fallbacks for ALL missing skills.');
    } catch(e) {
        console.error('Migration Error:', e.message);
    } finally {
        process.exit(0);
    }
}
seedAllMissing();
