const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
    try {
        console.log("Listing models...");
        // In newer SDK, listing models is handled differently or sometimes not directly.
        // But we can try to find the list.
        // Actually, let's just guess common ones.
        const models = ["gemini-1.5-flash-latest", "gemini-1.5-pro", "gemini-pro", "gemini-1.0-pro"];
        for (const m of models) {
            try {
                const model = genAI.getGenerativeModel({ model: m });
                const res = await model.generateContent("test");
                console.log(`✅ ${m} works!`);
            } catch (e) {
                console.log(`❌ ${m} fails: ${e.message}`);
            }
        }
    } catch (e) {
        console.error("Error listing:", e.message);
    }
}

listModels();
