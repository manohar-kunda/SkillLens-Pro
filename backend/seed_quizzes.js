const mysql = require('mysql2/promise');

const quizzesData = [
  {
    skillName: 'node.js',
    title: 'Node.js Backend Basics',
    difficulty: 'medium',
    questions: [
      ['What is the V8 engine in Node.js?', 'A database management system', 'Google open source high-performance JavaScript engine', 'A web framework', 'A testing library', 'B'],
      ['How do you handle asynchronous operations in Node.js?', 'Using only Callbacks', 'Using Promises and Async/Await', 'Node.js is synchronous only', 'Using Threads', 'B'],
      ['What is the purpose of module.exports?', 'To import external libraries', 'To define a global variable', 'To expose functions and objects for other files to require', 'To start the server', 'C']
    ]
  },
  {
    skillName: 'python',
    title: 'Python Core Concepts',
    difficulty: 'medium',
    questions: [
      ['Which of the following data types is immutable in Python?', 'List', 'Dictionary', 'Set', 'Tuple', 'D'],
      ['What is a decorator in Python?', 'A design pattern for UI', 'A function that modifies the behavior of another function', 'A special class for logging', 'A built-in variable type', 'B'],
      ['How do you handle exceptions in Python?', 'try/catch', 'try/except', 'do/while', 'error/handle', 'B']
    ]
  },
  {
    skillName: 'javascript',
    title: 'Advanced JavaScript',
    difficulty: 'hard',
    questions: [
      ['What does closures allow in JavaScript?', 'Faster execution time', 'Access to an outer function scope from an inner function', 'Automatic memory management', 'Synchronous API calls', 'B'],
      ['What is the output of typeof null?', '"null"', '"undefined"', '"object"', '"NaN"', 'C'],
      ['Which method is used to serialize an object into a JSON string?', 'JSON.parse()', 'JSON.serialize()', 'JSON.toString()', 'JSON.stringify()', 'D']
    ]
  },
  {
    skillName: 'java',
    title: 'Java Fundamentals',
    difficulty: 'medium',
    questions: [
      ['Which principle of OOP allows a class to inherit properties from another?', 'Polymorphism', 'Encapsulation', 'Abstraction', 'Inheritance', 'D'],
      ['What is the size of an int variable in Java?', '8 bit', '16 bit', '32 bit', '64 bit', 'C'],
      ['Which keyword is used to prevent a method from being overridden?', 'static', 'final', 'const', 'private', 'B']
    ]
  },
  {
    skillName: 'sql',
    title: 'SQL Masterclass',
    difficulty: 'hard',
    questions: [
      ['What is the difference between INNER JOIN and LEFT JOIN?', 'There is no difference', 'INNER JOIN returns all rows; LEFT JOIN returns matching rows', 'INNER JOIN returns matching rows; LEFT JOIN returns all rows from the left table', 'LEFT JOIN is faster', 'C'],
      ['Which command is used to remove all rows from a table without logging individual row deletions?', 'DROP', 'DELETE', 'REMOVE', 'TRUNCATE', 'D'],
      ['What does ACID stand for in databases?', 'Atomicity, Consistency, Isolation, Durability', 'Active, Consistent, Isolated, Durable', 'Automatic, Concurrency, Isolation, Database', 'Array, Class, Integer, Double', 'A']
    ]
  },
  {
    skillName: 'cyber security',
    title: 'Cyber Security Essentials',
    difficulty: 'medium',
    questions: [
      ['What is a Phishing attack?', 'Installing malware directly', 'Tricking individuals into revealing sensitive information', 'Denial of service', 'Password cracking', 'B'],
      ['Which of the following is symmetric encryption?', 'RSA', 'Diffie-Hellman', 'AES', 'ECC', 'C'],
      ['What does SQL injection aim to do?', 'Crash the server', 'Inject malicious SQL statements into entry fields for execution', 'Bypass firewalls', 'Intercept network traffic', 'B']
    ]
  }
];

async function seedAdditionalQuizzes() {
  let conn;
  try {
    conn = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      database: 'skilllens_db'
    });

    console.log('Connected to the database. Seeding more quizzes...');

    for (const quizData of quizzesData) {
      // 1. Ensure the skill exists in the db
      let skillId;
      const [skillRows] = await conn.query('SELECT id FROM skills WHERE name = ?', [quizData.skillName]);
      
      if (skillRows.length > 0) {
        skillId = skillRows[0].id;
      } else {
        // Create skill if it doesn't exist
        const [insertSkill] = await conn.query('INSERT INTO skills (name) VALUES (?)', [quizData.skillName]);
        skillId = insertSkill.insertId;
        console.log(`Created new skill: ${quizData.skillName}`);
      }

      // 2. Check if this quiz already exists to avoid duplicates
      const [existingQuiz] = await conn.query('SELECT id FROM quizzes WHERE title = ?', [quizData.title]);
      if (existingQuiz.length > 0) {
        console.log(`Quiz '${quizData.title}' already exists. Skipping.`);
        continue;
      }

      // 3. Insert Quiz
      const [qResult] = await conn.query(
        'INSERT INTO quizzes (title, skill_id, difficulty) VALUES (?, ?, ?)',
        [quizData.title, skillId, quizData.difficulty]
      );
      const newQuizId = qResult.insertId;

      // 4. Insert Questions
      for (const q of quizData.questions) {
        await conn.query(
          'INSERT INTO questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [newQuizId, ...q]
        );
      }
      
      console.log(`Successfully seeded quiz: ${quizData.title}`);
    }

    console.log('Finished seeding quizzes!');
  } catch (error) {
    console.error('Error seeding quizzes:', error);
  } finally {
    if (conn) await conn.end();
  }
}

seedAdditionalQuizzes();
