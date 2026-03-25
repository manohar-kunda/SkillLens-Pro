const axios = require("axios");
const axiosWithRetry = require('../utils/axiosWithRetry');
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://127.0.0.1:8011';

// SkillLens AI system prompt
const SYSTEM_PROMPT = `You are SkillLens AI Mentor, a professional career development assistant specializing in technology careers.
You help users with:
- Career roadmap planning and skill gap analysis
- Technical interview preparation and mock interviews
- Learning path recommendations for roles like Frontend Developer, Backend Developer, Data Scientist, DevOps Engineer, etc.
- Resume improvement suggestions
- Explaining programming concepts clearly

Keep responses concise, professional, and actionable. Focus on career and technology topics.
If asked something completely unrelated to careers or technology, politely redirect to career topics.`;

/**
 * Call Groq API directly from Node.js — PRIMARY path for chat.
 * Uses llama3-70b-8192 for fast, intelligent responses.
 */
const callGroqDirect = async (message, history = []) => {
    const Groq = require('groq-sdk');
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    // Convert history to Groq's OpenAI-compatible format
    const formattedHistory = (history || []).map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content || msg.text || ''
    })).filter(h => h.content);

    const chatCompletion = await groq.chat.completions.create({
        messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...formattedHistory,
            { role: 'user', content: message }
        ],
        model: 'llama3-70b-8192',
        temperature: 0.6,
        max_tokens: 1024,
    });

    return chatCompletion.choices[0].message.content;
};

exports.chatWithAI = async (req, res) => {
    const { message, history } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message is required.' });
    }

    // --- TIER 1: Direct Groq API call (fastest & most reliable) ---
    if (process.env.GROQ_API_KEY) {
        try {
            const reply = await callGroqDirect(message, history);
            return res.json({ reply });
        } catch (groqErr) {
            console.warn('[AI Chat] Direct Groq call failed, falling back to Python service:', groqErr.message);
        }
    }

    // --- TIER 2: Python AI Microservice ---
    try {
        const aiResponse = await axiosWithRetry(() => axios.post(`${AI_SERVICE_URL}/api/chat`, {
            message,
            history
        }, { timeout: 20000 }), 1, 2000);
        return res.json({ reply: aiResponse.data.reply });
    } catch (pythonErr) {
        console.error('[AI Chat] Python service also failed:', pythonErr.message);
    }

    // --- TIER 3: Static professional fallback ---
    const staticReplies = [
        'SkillLens AI is temporarily under high load. In the meantime: focus on mastering one core technology stack deeply before expanding. For career advice, try searching specific roles in the Career Discovery section!',
        'Our AI mentor is briefly unavailable. Tip: Consistency beats intensity — 30 minutes of focused practice daily outperforms 4-hour weekend sessions. Explore your Dashboard for curated roadmaps!',
        'The AI service is momentarily busy. Career tip: Build 2-3 strong portfolio projects rather than 10 incomplete ones. Check your Skill Gap section to see what to learn next!',
    ];
    const fallback = staticReplies[Math.floor(Math.random() * staticReplies.length)];
    return res.json({ reply: fallback });
};
