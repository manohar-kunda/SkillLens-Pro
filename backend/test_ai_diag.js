const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const testAI = async () => {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        // Specifically for Node, we might need a different import or approach for listing models
        // But for now, let's try gemini-1.5-flash-latest which is more common now
        
        const genAI = new GoogleGenerativeAI(apiKey);
        
        console.log("Testing with gemini-1.5-flash-latest...");
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
        const result = await model.generateContent("Hi");
        console.log("Success with gemini-1.5-flash-latest:", (await result.response).text());

    } catch (err) {
        console.error("Test Error:", err.message);
    }
};

testAI();
