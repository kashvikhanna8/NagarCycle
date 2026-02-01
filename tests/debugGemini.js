const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function debugGemini() {
    try {
        console.log("Testing gemini-1.5-flash-001...");
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-001" });
        const result = await model.generateContent("Hello!");
        console.log("Response:", result.response.text());
        console.log("✅ SUCCESS with gemini-1.5-flash-001");
    } catch (e) {
        console.error("❌ FAILED with gemini-1.5-flash-001:", e.message);

        try {
            console.log("Testing gemini-1.5-flash...");
            const model2 = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const result2 = await model2.generateContent("Hello!");
            console.log("Response:", result2.response.text());
            console.log("✅ SUCCESS with gemini-1.5-flash");
        } catch (e2) {
            console.error("❌ FAILED with gemini-1.5-flash:", e2.message);
        }
    }
}

debugGemini();
