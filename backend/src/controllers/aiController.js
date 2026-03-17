const axios = require("axios");
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://127.0.0.1:8011';

exports.chatWithAI = async (req, res) => {
    try {
        const { message, history } = req.body;

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ error: "Gemini API Key is not configured in the backend." });
        }

        const aiResponse = await axios.post(`${AI_SERVICE_URL}/api/chat`, {
            message,
            history
        });

        res.json({ reply: aiResponse.data.reply });
    } catch (err) {
        console.error("AI Error:", err);
        
        // Propagate status code if available (e.g. 429 from Gemini)
        const statusCode = err.status || (err.response && err.response.status) || 500;
        const errorMessage = err.message || "Failed to get AI response. Please check your API key or try again later.";
        
        res.status(statusCode).json({ error: errorMessage });
    }
};
