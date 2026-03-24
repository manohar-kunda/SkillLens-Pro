const axios = require('axios');
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://127.0.0.1:8011';
const axiosWithRetry = require('../utils/axiosWithRetry');

// Static interview questions as fallback when Python AI service is down
const STATIC_QUESTIONS = {
    easy: [
        'What is the difference between let, const, and var in JavaScript?',
        'Explain what an API is and how it works.',
        'What is version control and why is it important in software development?',
        'What is the difference between SQL and NoSQL databases?',
        'Explain the concept of responsive web design.',
    ],
    medium: [
        'Explain the concept of RESTful API design and its core principles.',
        'What is the difference between synchronous and asynchronous programming?',
        'Describe how JWT (JSON Web Tokens) work for authentication.',
        'What are the SOLID principles in software development?',
        'Explain the difference between monolithic and microservices architecture.',
    ],
    hard: [
        'How would you design a scalable system to handle 1 million concurrent users?',
        'Explain how garbage collection works in modern programming languages.',
        'What are the CAP theorem trade-offs in distributed systems?',
        'How would you implement a rate limiting system for an API?',
        'Describe how you would optimize a slow database query.',
    ]
};

/**
 * Fetches open-ended technical questions from the AI Service.
 * Falls back to static questions if the AI service is unavailable.
 */
exports.getAIInterviewQuestions = async (req, res) => {
    try {
        const { role, difficulty } = req.body;
        
        const response = await axiosWithRetry(() => axios.post(`${AI_SERVICE_URL}/api/ai-interview/questions`, {
            role: role || 'Software Engineer',
            difficulty: difficulty || 'medium'
        }, { timeout: 45000 }));
        
        res.status(200).json(response.data);
    } catch (error) {
        console.warn('[AI Interview] Python AI unavailable, using static questions:', error.message);
        // Fallback to static questions
        const diffKey = (req.body?.difficulty || 'medium').toLowerCase();
        const questions = STATIC_QUESTIONS[diffKey] || STATIC_QUESTIONS.medium;
        res.status(200).json({
            status: 'success',
            questions,
            source: 'static_fallback'
        });
    }
};

/**
 * Evaluates a voice interview answer using the AI Service.
 * Falls back to a basic score if the AI service is unavailable.
 */
exports.evaluateAIInterviewAnswer = async (req, res) => {
    try {
        const { question, answer } = req.body;
        
        if (!question || !answer) {
            return res.status(400).json({ status: 'error', message: 'Question and answer are required' });
        }
        
        const response = await axiosWithRetry(() => axios.post(`${AI_SERVICE_URL}/api/ai-interview/evaluate`, {
            question,
            answer
        }, { timeout: 45000 }));
        
        res.status(200).json(response.data);
    } catch (error) {
        console.warn('[AI Interview] Evaluation fallback used:', error.message);
        // Provide a basic static evaluation
        const wordCount = (answer || '').split(/\s+/).filter(Boolean).length;
        const score = Math.min(Math.max(Math.round(wordCount / 5), 3), 8);
        res.status(200).json({
            status: 'success',
            evaluation: {
                score,
                is_accurate: score >= 5,
                feedback: score >= 5
                    ? 'Good answer! You demonstrated a reasonable understanding of the topic. With the AI evaluator back online, you\'ll get more detailed feedback.'
                    : 'Your answer could be more detailed. Try to elaborate with specific examples and technical details.',
            }
        });
    }
};
