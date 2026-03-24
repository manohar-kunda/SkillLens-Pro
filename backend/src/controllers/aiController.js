const axios = require("axios");
const axiosWithRetry = require('../utils/axiosWithRetry');
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://127.0.0.1:8011';

// SkillLens AI system prompt for direct Gemini fallback
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
 * Call Gemini API directly from Node.js as a fallback.
 * Used when the Python AI microservice is unavailable (e.g., Render cold-start 502).
 */
const callGeminiDirect = async (message, history = []) => {
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
        model: 'gemini-2.0-flash',
        systemInstruction: SYSTEM_PROMPT,
    });

    // Convert history to Gemini's format
    const formattedHistory = (history || []).map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content || msg.text || '' }]
    })).filter(h => h.parts[0].text);

    const chat = model.startChat({ history: formattedHistory });
    const result = await chat.sendMessage(message);
    return result.response.text();
};

exports.chatWithAI = async (req, res) => {
    const { message, history } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message is required.' });
    }

    // --- TIER 1: Try Python AI Microservice ---
    try {
        const aiResponse = await axiosWithRetry(() => axios.post(`${AI_SERVICE_URL}/api/chat`, {
            message,
            history
        }, { timeout: 30000 }), 2, 3000); // 2 retries, 3s delay (faster for chat)

        return res.json({ reply: aiResponse.data.reply });
    } catch (pythonErr) {
        console.warn('[AI Chat] Python service unavailable, falling back to direct Gemini call:', pythonErr.message);
    }

    // --- TIER 2: Call Gemini API directly from Node.js ---
    try {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error('GEMINI_API_KEY not configured in backend.');
        }
        const reply = await callGeminiDirect(message, history);
        return res.json({ reply });
    } catch (geminiErr) {
        console.error('[AI Chat] Direct Gemini call also failed:', geminiErr.message);
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
