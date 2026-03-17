const pool = require('../config/db');
const axios = require('axios');

// @desc    Get all available quiz skills
// @route   GET /api/quizzes/all
// @access  Private
const getAllSkills = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM skills ORDER BY name ASC');
        res.json(rows);
    } catch (error) {
        console.error('Get All Skills Error:', error);
        res.status(500).json({ message: 'Server error while fetching available skills' });
    }
};



// @desc    Get mock interview quiz for a skill
// @route   GET /api/quizzes/:skillId
// @access  Private
const getQuizBySkill = async (req, res) => {
    try {
        const { skillId } = req.params;
        const { difficulty, name: querySkillName } = req.query;

        // Skill Aliasing Map
        let targetSkillId = skillId;
        let skillName = querySkillName || 'Unknown';
        
        let isDynamic = typeof skillId === 'string' && skillId.startsWith('dyn-skill-');

        if (isDynamic) {
            if (!querySkillName) {
                return res.status(400).json({ message: 'Dynamic skills require a valid name parameter for fallback conversion.' });
            }
            // Check if this dynamically extracted skill already exists in our DB organically
            const [existRes] = await pool.query('SELECT id FROM skills WHERE name = ?', [skillName.toLowerCase()]);
            if (existRes.length > 0) {
                targetSkillId = existRes[0].id; // Swap back to native INT id
            } else {
                // If it's a completely new tech stack string, seamlessly insert it so MockInterview logic holds
                const [insertSkill] = await pool.query('INSERT INTO skills (name) VALUES (?)', [skillName.toLowerCase()]);
                targetSkillId = insertSkill.insertId;
            }
        } else {
            const [skillResult] = await pool.query('SELECT name FROM skills WHERE id = ?', [skillId]);
            if (skillResult.length > 0) {
                skillName = skillResult[0].name.toLowerCase();
            }
        }
        
        // Proceed normally, but ensure it always uses aliases effectively
        if (skillName && skillName !== 'Unknown') {
            const aliases = {
                'mysql': 'sql',
                'postgresql': 'sql',
                'nosql': 'sql',
                'express': 'node.js',
                'spring boot': 'java',
                'hibernate': 'java',
                'pandas': 'python',
                'machine learning': 'python',
                'linux': 'cyber security',
                'network security': 'cyber security',
                'data analysis': 'python',
                'ethical hacking': 'cyber security',
                'typescript': 'javascript'
            };
            
            if (aliases[skillName]) {
                const [aliasResult] = await pool.query('SELECT id FROM skills WHERE name = ?', [aliases[skillName]]);
                if (aliasResult.length > 0) {
                    targetSkillId = aliasResult[0].id;
                }
            }
        }

        // --- 1. TRY TO FETCH FROM QuizAPI.io FIRST ---
        let externalQuestions = [];
        try {
            const apiKey = process.env.QUIZ_API_KEY;
            
            // Only attempt if the user actually inserted a real key
            if (apiKey && apiKey !== 'your_api_key_here') {
                // Map local skills to QuizAPI's limited tagging system to maximize hits
                let apiTag = skillName;
                if (['node.js', 'react', 'express.js', 'express', 'mern stack'].includes(skillName)) apiTag = 'JavaScript';
                else if (['sql', 'mysql', 'postgresql'].includes(skillName)) apiTag = 'MySQL';
                else if (['linux', 'cyber security', 'network security', 'ethical hacking'].includes(skillName)) apiTag = 'Linux';
                else if (['c++', 'c#'].includes(skillName)) apiTag = 'BASH';
                else if (['python', 'pandas', 'machine learning'].includes(skillName)) apiTag = 'Python';
                else if (['html', 'css', 'bootstrap'].includes(skillName)) apiTag = 'HTML';
                else if (['docker', 'aws', 'cloud computing', 'kubernetes'].includes(skillName)) apiTag = 'DevOps';
                
                const fetchWithDifficulty = async (diffParam) => {
                    return axios.get('https://quizapi.io/api/v1/questions', {
                        params: {
                            apiKey: apiKey,
                            limit: 20, 
                            tags: apiTag,
                            difficulty: diffParam
                        }
                    });
                };

                let response;
                try {
                    response = await fetchWithDifficulty(difficulty === 'hard' ? 'Hard' : difficulty === 'medium' ? 'Medium' : 'Easy');
                } catch (diffErr) {
                    // QuizAPI returns 404 if no questions match that specific difficulty.
                    // Instead of aborting the whole API, we intercept and retry with ANY difficulty.
                    if (diffErr.response && diffErr.response.status === 404) {
                        response = await axios.get('https://quizapi.io/api/v1/questions', { 
                            params: { apiKey: apiKey, limit: 20, tags: apiTag } 
                        });
                    } else {
                        throw diffErr;
                    }
                }
                
                // If the API returns nothing, or fallback also returned nothing
                if (!response || !response.data || response.data.length === 0) {
                   response = await axios.get('https://quizapi.io/api/v1/questions', { 
                       params: { apiKey: apiKey, limit: 20, tags: apiTag } 
                   });
                }

                if (response.data && Array.isArray(response.data) && response.data.length > 0) {
                    externalQuestions = response.data;
                }
            }
        } catch (apiError) {
            console.error('QuizAPI fetch failed, falling back to local DB:', apiError.response ? apiError.response.data : apiError.message);
        }

        // --- 2. DYNAMIC GENERATION (If external questions found) ---
        if (externalQuestions.length > 3) {
            const quizTitle = `${skillResult[0].name.toUpperCase()} Dynamic Assessment`;
            
            // Create a new temporary Quiz session in the DB
            const [quizRes] = await pool.query(
                'INSERT INTO quizzes (skill_id, title, difficulty) VALUES (?, ?, ?)',
                [targetSkillId, quizTitle, difficulty || 'medium']
            );
            const newQuizId = quizRes.insertId;
            
            // Insert all fetched questions mapped to our DB structure
            const insertPromises = externalQuestions.slice(0, 20).map(q => {
                const qText = q.question.substring(0, 255); // Prevent DB string overflow just in case
                const a = q.answers.answer_a ? q.answers.answer_a.substring(0, 255) : 'Option A';
                const b = q.answers.answer_b ? q.answers.answer_b.substring(0, 255) : 'Option B';
                const c = q.answers.answer_c ? q.answers.answer_c.substring(0, 255) : 'Option C';
                const d = q.answers.answer_d ? q.answers.answer_d.substring(0, 255) : 'Option D';
                
                // Determine Correct Option (A, B, C, or D)
                let correctOpt = 'A';
                if (q.correct_answers) {
                    if (q.correct_answers.answer_a_correct === 'true') correctOpt = 'A';
                    else if (q.correct_answers.answer_b_correct === 'true') correctOpt = 'B';
                    else if (q.correct_answers.answer_c_correct === 'true') correctOpt = 'C';
                    else if (q.correct_answers.answer_d_correct === 'true') correctOpt = 'D';
                }
                
                return pool.query(
                    'INSERT INTO questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [newQuizId, qText, a, b, c, d, correctOpt]
                );
            });
            
            await Promise.all(insertPromises);
            
            // Fetch the freshly inserted questions formatted exactly for our frontend
            const [savedQuestions] = await pool.query(
                'SELECT id, question_text, option_a, option_b, option_c, option_d FROM questions WHERE quiz_id = ?', 
                [newQuizId]
            );
            
            return res.json({
                quiz: {
                    id: newQuizId,
                    title: quizTitle,
                    difficulty: difficulty || 'medium'
                },
                questions: savedQuestions
            });
        } else {
            // --- 3. FALLBACK TO LOCAL DATABASE (If external failed, empty, or had < 4 questions) ---
            let query = 'SELECT * FROM quizzes WHERE skill_id = ?';
            let queryParams = [targetSkillId];

        if (difficulty) {
             query += ' AND difficulty = ?';
             queryParams.push(difficulty);
        }
        
        query += ' ORDER BY id DESC LIMIT 1'; // Picks the newly seeded quizzes

        // Fetch a quiz for the given (or aliased) skill
        let [quizzes] = await pool.query(query, queryParams);
        
        // Safety Fallback: If we couldn't find a quiz of this exact difficulty, fetch ANY difficulty
        if (quizzes.length === 0 && difficulty) {
             const fallbackResult = await pool.query('SELECT * FROM quizzes WHERE skill_id = ? ORDER BY id DESC LIMIT 1', [targetSkillId]);
             quizzes = fallbackResult[0];
        }

        // Just-In-Time Generation for Completely Foreign/Dynamic Skills
        if (!quizzes || quizzes.length === 0) {
            const quizTitle = `${skillName.toUpperCase()} General Assessment`;
            const diffLvl = difficulty || 'medium';
            const [qInsert] = await pool.query('INSERT INTO quizzes (skill_id, title, difficulty) VALUES (?, ?, ?)', [targetSkillId, quizTitle, diffLvl]);
            const jQuizId = qInsert.insertId;

            const uName = skillName.charAt(0).toUpperCase() + skillName.slice(1);
            
            await pool.query('INSERT INTO questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option) VALUES (?, ?, ?, ?, ?, ?, ?)', [jQuizId, `What is the primary purpose of ${uName}?`, 'To style web pages', 'To manage databases', 'To build and engineer robust solutions', 'To format text', 'C']);
            await pool.query('INSERT INTO questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option) VALUES (?, ?, ?, ?, ?, ?, ?)', [jQuizId, `Which of the following is a best practice when working with ${uName}?`, 'Ignoring documentation', 'Writing modular components', 'Hardcoding sensitive API keys', 'Skipping error handling', 'B']);
            await pool.query('INSERT INTO questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option) VALUES (?, ?, ?, ?, ?, ?, ?)', [jQuizId, `How can performance be optimized in a typical ${uName} environment?`, 'By increasing loops', 'Reducing unnecessary operations', 'Duplicating code', 'Removing comments', 'B']);
            await pool.query('INSERT INTO questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option) VALUES (?, ?, ?, ?, ?, ?, ?)', [jQuizId, `What is a common pitfall to avoid in ${uName}?`, 'Writing unit tests', 'Documenting code', 'Using deprecated methods', 'Using version control', 'C']);
            await pool.query('INSERT INTO questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option) VALUES (?, ?, ?, ?, ?, ?, ?)', [jQuizId, `Which methodology works best for integrating ${uName} into a CI/CD pipeline?`, 'Manual deployment only', 'Automated testing and containerization', 'Deploying only on Fridays', 'Skipping code reviews', 'B']);

            // Re-fetch the freshly generated JIT quiz
            const [jitResult] = await pool.query('SELECT * FROM quizzes WHERE id = ?', [jQuizId]);
            quizzes = jitResult;
        }

        const quiz = quizzes[0];

        // Fetch questions for this quiz, limited to max 25 random questions
        const [questions] = await pool.query(
            'SELECT id, question_text, option_a, option_b, option_c, option_d FROM questions WHERE quiz_id = ? ORDER BY RAND() LIMIT 25', 
            [quiz.id]
        );

        res.json({
            quiz: {
                id: quiz.id,
                title: quiz.title,
                difficulty: quiz.difficulty
            },
            questions
        });
    }
    } catch (error) {
        console.error('Quiz Fetch Error:', error);
        res.status(500).json({ message: 'Server error while fetching quiz' });
    }
};

// @desc    Submit quiz answers and calculate score
// @route   POST /api/quizzes/:quizId/submit
// @access  Private
const submitQuizAnswers = async (req, res) => {
    try {
        const { quizId } = req.params;
        const { answers } = req.body; // format: { questionId: 'A', anotherQuestionId: 'C' }
        const userId = req.user.id;

        // Fetch correct answers
        const [questions] = await pool.query('SELECT id, question_text, option_a, option_b, option_c, option_d, correct_option FROM questions WHERE quiz_id = ?', [quizId]);

        if (questions.length === 0) {
            return res.status(404).json({ message: 'Quiz not found or has no questions.' });
        }

        let score = 0;
        const totalQuestions = questions.length;
        const detailedReview = [];

        questions.forEach(q => {
            const userAnswer = answers[q.id];
            const isCorrect = userAnswer && userAnswer.toUpperCase() === q.correct_option.toUpperCase();
            
            if (isCorrect) {
                score++;
            }

            detailedReview.push({
                questionId: q.id,
                questionText: q.question_text,
                options: {
                    A: q.option_a,
                    B: q.option_b,
                    C: q.option_c,
                    D: q.option_d
                },
                userAnswer: userAnswer || 'Not answered',
                correctAnswer: q.correct_option,
                isCorrect
            });
        });

        // Save result
        await pool.query(
            'INSERT INTO user_results (user_id, quiz_id, score, total_questions) VALUES (?, ?, ?, ?)',
            [userId, quizId, score, totalQuestions]
        );

        res.json({
            message: 'Quiz submitted successfully',
            score,
            totalQuestions,
            percentage: Math.round((score / totalQuestions) * 100),
            detailedReview
        });

    } catch (error) {
        console.error('Quiz Submit Error:', error);
        res.status(500).json({ message: 'Server error while submitting quiz' });
    }
};

module.exports = {
    getAllSkills,
    getQuizBySkill,
    submitQuizAnswers
};
