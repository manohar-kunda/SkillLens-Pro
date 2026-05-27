/**
 * -----------------------------------------------------------------------------
 * File: quizController.js
 * Component: Backend MVC Controller
 * Purpose: Manages career skill assessment quizzes, QuizAPI.io integrations, 
 *          dynamic/just-in-time quiz templates generator, and score evaluations.
 *
 * Responsibilities:
 * - Fetch a unified directory of all active skill tracks.
 * - Retrieve or dynamically construct comprehensive multi-choice quizzes for any skill.
 * - Handle API requests to external QuizAPI.io and process failures gracefully.
 * - Implement skill name normalization and alias redirections (e.g. Postgres -> SQL).
 * - Evaluate user quiz submissions and persist scores in the relational store.
 *
 * Database Tables Utilized:
 * - `skills` (Retrieves name, id, and maps dynamic elements)
 * - `quizzes` (Saves standard and JIT quiz structures)
 * - `questions` (Stores the individual multiple choice questions)
 * - `user_results` (Records scores and attempt metadata)
 *
 * Author: Manohar Kunda
 * -----------------------------------------------------------------------------
 */

const pool = require('../config/db');
const axios = require('axios');

/**
 * Retrieves a sorted list of all registered career skills from the database.
 * Used by the frontend to populate autocomplete inputs and catalog cards.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object returning the skills list.
 * @returns {Promise<void>}
 */
const getAllSkills = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM skills ORDER BY name ASC');
        res.json(rows);
    } catch (error) {
        console.error('Get All Skills Error:', error);
        res.status(500).json({ message: 'Server error while fetching available skills' });
    }
};

/**
 * Retrieves or dynamic-generates a structured assessment quiz for a targeted skill.
 * Implements a robust three-tier fallback mechanism:
 * 1. Attempts to pull live questions from QuizAPI.io matching mapped skill tags.
 * 2. Falls back to pre-seeded static local database quizzes for the skill (with alias resolution).
 * 3. As a final resort, dynamically constructs a Just-In-Time (JIT) 5-question general assessment.
 *
 * @param {Object} req - Express request object containing params (skillId) and queries (difficulty, name).
 * @param {Object} res - Express response object returning the quiz metadata and questions.
 * @returns {Promise<void>}
 */
const getQuizBySkill = async (req, res) => {
    try {
        const { skillId } = req.params;
        const { difficulty, name: querySkillName } = req.query;

        // Skill Aliasing Map and normalization target
        let targetSkillId = skillId;
        let skillName = querySkillName || 'Unknown';
        
        // Check if the skill was extracted dynamically from a resume and lacks a standard numeric ID
        let isDynamic = typeof skillId === 'string' && skillId.startsWith('dyn-skill-');

        if (isDynamic) {
            if (!querySkillName) {
                return res.status(400).json({ message: 'Dynamic skills require a valid name parameter for fallback conversion.' });
            }
            // Normalization: check if this dynamic skill already exists in our master index
            const [existRes] = await pool.query('SELECT id FROM skills WHERE name = ?', [skillName.toLowerCase()]);
            if (existRes.length > 0) {
                targetSkillId = existRes[0].id; // Resolve to native integer primary key
            } else {
                // If it is completely new, safely insert it so standard relations persist
                const [insertSkill] = await pool.query('INSERT INTO skills (name) VALUES (?)', [skillName.toLowerCase()]);
                targetSkillId = insertSkill.insertId;
            }
        } else {
            const [skillResult] = await pool.query('SELECT name FROM skills WHERE id = ?', [skillId]);
            if (skillResult.length > 0) {
                skillName = skillResult[0].name.toLowerCase();
            }
        }
        
        // Resolve technology stack synonyms and aliases to prevent database cold-spots
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

        // --- TIER 1: LIVE QUIZAPI.IO INTEGRATION ---
        let externalQuestions = [];
        try {
            const apiKey = process.env.QUIZ_API_KEY;
            
            // Only execute request if a valid API token is configured in environment variables
            if (apiKey && apiKey !== 'your_api_key_here') {
                // Map complex skills to QuizAPI's high-level tag library to maximize retrieval hit rate
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
                    // Intercept 404s (QuizAPI returns a 404 if no questions strictly match the requested difficulty tag)
                    // We catch and retry without a hard difficulty parameter to maintain service resiliency
                    if (diffErr.response && diffErr.response.status === 404) {
                        response = await axios.get('https://quizapi.io/api/v1/questions', { 
                            params: { apiKey: apiKey, limit: 20, tags: apiTag } 
                        });
                    } else {
                        throw diffErr;
                    }
                }
                
                // Secondary check for empty response
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

        // --- TIER 2: DYNAMIC DB PERSISTENCE (For QuizAPI results) ---
        if (externalQuestions.length > 3) {
            const quizTitle = `${skillName.toUpperCase()} Dynamic Assessment`;
            
            // Create a new, temporary quiz template instance in MySQL
            const [quizRes] = await pool.query(
                'INSERT INTO quizzes (skill_id, title, difficulty) VALUES (?, ?, ?)',
                [targetSkillId, quizTitle, difficulty || 'medium']
            );
            const newQuizId = quizRes.insertId;
            
            // Batch-map external API structures to the localized DB schema
            const insertPromises = externalQuestions.slice(0, 20).map(q => {
                const qText = q.question.substring(0, 255); // Safeguard against database column overflow
                const a = q.answers.answer_a ? q.answers.answer_a.substring(0, 255) : 'Option A';
                const b = q.answers.answer_b ? q.answers.answer_b.substring(0, 255) : 'Option B';
                const c = q.answers.answer_c ? q.answers.answer_c.substring(0, 255) : 'Option C';
                const d = q.answers.answer_d ? q.answers.answer_d.substring(0, 255) : 'Option D';
                
                // Parse correctly designated solution option
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
            
            // Fetch structured questions to return to the caller
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
            // --- TIER 3: PRE-SEEDED LOCAL TEMPLATES FALLBACK ---
            let query = 'SELECT * FROM quizzes WHERE skill_id = ?';
            let queryParams = [targetSkillId];

            if (difficulty) {
                 query += ' AND difficulty = ?';
                 queryParams.push(difficulty);
            }
            
            query += ' ORDER BY id DESC LIMIT 1'; // Prioritize the most recently added assessments

            let [quizzes] = await pool.query(query, queryParams);
            
            // Fallback: If no match found for difficulty, retrieve ANY available quiz template for the skill
            if (quizzes.length === 0 && difficulty) {
                 const fallbackResult = await pool.query('SELECT * FROM quizzes WHERE skill_id = ? ORDER BY id DESC LIMIT 1', [targetSkillId]);
                 quizzes = fallbackResult[0];
            }

            // --- TIER 4: JUST-IN-TIME (JIT) MOCK GENERATOR (Absolute Fallback) ---
            if (!quizzes || quizzes.length === 0) {
                const quizTitle = `${skillName.toUpperCase()} General Assessment`;
                const diffLvl = difficulty || 'medium';
                const [qInsert] = await pool.query('INSERT INTO quizzes (skill_id, title, difficulty) VALUES (?, ?, ?)', [targetSkillId, quizTitle, diffLvl]);
                const jQuizId = qInsert.insertId;

                const uName = skillName.charAt(0).toUpperCase() + skillName.slice(1);
                
                // Write standard questions dynamically to maintain service availability 
                await pool.query('INSERT INTO questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option) VALUES (?, ?, ?, ?, ?, ?, ?)', [jQuizId, `What is the primary purpose of ${uName}?`, 'To style web pages', 'To manage databases', 'To build and engineer robust solutions', 'To format text', 'C']);
                await pool.query('INSERT INTO questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option) VALUES (?, ?, ?, ?, ?, ?, ?)', [jQuizId, `Which of the following is a best practice when working with ${uName}?`, 'Ignoring documentation', 'Writing modular components', 'Hardcoding sensitive API keys', 'Skipping error handling', 'B']);
                await pool.query('INSERT INTO questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option) VALUES (?, ?, ?, ?, ?, ?, ?)', [jQuizId, `How can performance be optimized in a typical ${uName} environment?`, 'By increasing loops', 'Reducing unnecessary operations', 'Duplicating code', 'Removing comments', 'B']);
                await pool.query('INSERT INTO questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option) VALUES (?, ?, ?, ?, ?, ?, ?)', [jQuizId, `What is a common pitfall to avoid in ${uName}?`, 'Writing unit tests', 'Documenting code', 'Using deprecated methods', 'Using version control', 'C']);
                await pool.query('INSERT INTO questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option) VALUES (?, ?, ?, ?, ?, ?, ?)', [jQuizId, `Which methodology works best for integrating ${uName} into a CI/CD pipeline?`, 'Manual deployment only', 'Automated testing and containerization', 'Deploying only on Fridays', 'Skipping code reviews', 'B']);

                const [jitResult] = await pool.query('SELECT * FROM quizzes WHERE id = ?', [jQuizId]);
                quizzes = jitResult;
            }

            const quiz = quizzes[0];

            // Select up to 25 random questions mapped to the template
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

/**
 * Validates submitted multiple-choice quiz answers, computes percentage scores, 
 * formats a detailed review breakdown, and persists results to the database.
 *
 * @param {Object} req - Express request containing quizId params and req.body.answers map.
 * @param {Object} res - Express response object returning the score and performance review.
 * @returns {Promise<void>}
 */
const submitQuizAnswers = async (req, res) => {
    try {
        const { quizId } = req.params;
        const { answers } = req.body; // Payload signature: { [questionId]: 'A' | 'B' | 'C' | 'D' }
        const userId = req.user.id;

        // Fetch valid solutions for the quiz from MySQL
        const [questions] = await pool.query('SELECT id, question_text, option_a, option_b, option_c, option_d, correct_option FROM questions WHERE quiz_id = ?', [quizId]);

        if (questions.length === 0) {
            return res.status(404).json({ message: 'Quiz not found or has no questions.' });
        }

        let score = 0;
        const totalQuestions = questions.length;
        const detailedReview = [];

        // Validate choice submissions and accumulate positive scores
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

        // Persist attempt statistics
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
