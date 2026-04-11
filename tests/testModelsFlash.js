const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testModel(modelName) {
    try {
        console.log(`Testing ${modelName}...`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Say hello");
        console.log(`✅ ${modelName} works: ${result.response.text()}`);
        return true;
    } catch (e) {
        console.log(`❌ ${modelName} failed: ${e.message}`);
        return false;
    }
}

async function runTests() {
    const models = ["gemini-1.5-flash-latest", "gemini-2.0-flash-lite", "gemini-2.0-flash", "gemini-pro"];
    for (const m of models) {
        await testModel(m);
    }
}

runTests();
