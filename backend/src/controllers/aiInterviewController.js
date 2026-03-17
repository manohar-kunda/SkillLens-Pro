const axios = require('axios');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://127.0.0.1:8011';

/**
 * Fetches open-ended technical questions from the AI Service.
 */
exports.getAIInterviewQuestions = async (req, res) => {
    try {
        const { role, difficulty } = req.body;
        
        const response = await axios.post(`${AI_SERVICE_URL}/api/ai-interview/questions`, {
            role: role || 'Software Engineer',
            difficulty: difficulty || 'medium'
        });
        
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error fetching AI interview questions:', error.message);
        res.status(500).json({ 
            status: 'error', 
            message: 'Failed to fetch interview questions',
            error: error.message 
        });
    }
};

/**
 * Evaluates a voice interview answer using the AI Service.
 */
exports.evaluateAIInterviewAnswer = async (req, res) => {
    try {
        const { question, answer } = req.body;
        
        if (!question || !answer) {
            return res.status(400).json({ status: 'error', message: 'Question and answer are required' });
        }
        
        const response = await axios.post(`${AI_SERVICE_URL}/api/ai-interview/evaluate`, {
            question,
            answer
        });
        
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error evaluating AI interview answer:', error.message);
        res.status(500).json({ 
            status: 'error', 
            message: 'Failed to evaluate interview answer',
            error: error.message 
        });
    }
};
