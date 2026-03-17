const mysql = require('mysql2/promise');

const skillsList = [
  'react', 'node.js', 'python', 'javascript', 
  'java', 'sql', 'cyber security', 'html', 'css'
];
const difficulties = ['easy', 'medium', 'hard'];

// Generic question generators for mock data that looks somewhat realistic
const generateQuestion = (skill, diff, index) => {
  const isCodeMatch = ['react', 'node.js', 'python', 'javascript', 'java'].includes(skill);
  
  if (isCodeMatch) {
    if (diff === 'easy') {
      return {
        text: `[${skill.toUpperCase()} - Easy Q${index}] Which of the following is a basic concept or keyword closely associated with ${skill}?`,
        opts: ['Variable declaration', 'Virtual DOM routing', 'System hardware registry', 'Compiler byte-code injection'],
        ans: 'A'
      };
    } else if (diff === 'medium') {
      return {
        text: `[${skill.toUpperCase()} - Medium Q${index}] How would you optimize a typical data processing loop in ${skill}?`,
        opts: ['Use a single-threaded block', 'Leverage asynchronous execution or optimized iterators', 'Reboot the compiler', 'Dump memory to disk'],
        ans: 'B'
      };
    } else {
      return {
        text: `[${skill.toUpperCase()} - Hard Q${index}] Describe the exact memory lifecycle and garbage collection trigger for an isolated closure in ${skill}.`,
        opts: ['It is randomly deleted', 'Manual free() must be called', 'It persists as long as the lexical environment is referenced', 'The OS kernel manages it globally'],
        ans: 'C'
      };
    }
  } else if (skill === 'sql') {
    return {
      text: `[SQL - ${diff.toUpperCase()} Q${index}] Write a query to solve data anomaly #${index}.`,
      opts: ['SELECT * FROM table', 'UPDATE table SET id = NULL', 'DROP TABLE items', `Proper optimized JOIN for scenario ${index}`],
      ans: 'D'
    };
  } else {
    // Cyber security or others
    return {
      text: `[${skill.toUpperCase()} - ${diff.toUpperCase()} Q${index}] Identify the best practice for scenario ${index} to prevent vulnerabilities.`,
      opts: ['Keep default passwords', 'Implement principle of least privilege', 'Disable the firewall temporarily', 'Share keys via email'],
      ans: 'B'
    };
  }
};

async function seedMassive() {
  let conn;
  try {
    conn = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      database: 'skilllens_db'
    });
    console.log('Connected. Starting massive seed...');

    for (let skill of skillsList) {
      // 1. Get or create skill
      let skillId;
      const [sRows] = await conn.query('SELECT id FROM skills WHERE name = ?', [skill]);
      if (sRows.length > 0) {
        skillId = sRows[0].id;
      } else {
        const [insertS] = await conn.query('INSERT INTO skills (name) VALUES (?)', [skill]);
        skillId = insertS.insertId;
      }

      for (let diff of difficulties) {
        const quizTitle = `${skill.toUpperCase()} ${diff.charAt(0).toUpperCase() + diff.slice(1)} Assessment`;
        
        // 2. Check if quiz exists
        let quizId;
        const [qRows] = await conn.query('SELECT id FROM quizzes WHERE title = ? AND skill_id = ?', [quizTitle, skillId]);
        
        if (qRows.length > 0) {
          quizId = qRows[0].id;
          // Delete existing questions so we can cleanly replace with 40 new ones
          await conn.query('DELETE FROM questions WHERE quiz_id = ?', [quizId]);
        } else {
          const [insertQ] = await conn.query(
            'INSERT INTO quizzes (title, skill_id, difficulty) VALUES (?, ?, ?)',
            [quizTitle, skillId, diff]
          );
          quizId = insertQ.insertId;
        }

        // 3. Generate 40 questions for this quiz to ensure 25 random ones can be pulled
        for (let i = 1; i <= 40; i++) {
          const qData = generateQuestion(skill, diff, i);
          await conn.query(
            'INSERT INTO questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [quizId, qData.text, qData.opts[0], qData.opts[1], qData.opts[2], qData.opts[3], qData.ans]
          );
        }
        console.log(`Seeded 40 dynamic questions for ${quizTitle}`);
      }
    }

    console.log('Massive seed completed successfully!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    if (conn) await conn.end();
  }
}

seedMassive();
