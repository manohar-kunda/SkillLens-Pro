const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const testFinal = async () => {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        const genAI = new GoogleGenerativeAI(apiKey);
        
        console.log("Final Test with gemini-2.0-flash...");
        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.0-flash",
            systemInstruction: "You are a helpful technical mentor."
        });

        const result = await model.generateContent("What is Java?");
        const response = await result.response;
        console.log("Success! Response from Gemini 2.0:", (await response.text()).substring(0, 100) + "...");

    } catch (err) {
        console.error("Final Test Error:", err.message);
    }
};

testFinal();
