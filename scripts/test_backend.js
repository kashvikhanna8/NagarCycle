const fs = require('fs');
const path = require('path');

// We can't easily use fetch/FormData in Node without installing 'node-fetch' or similar if on old Node.
// But we have 'axios' or we can use built-in http. 
// Actually, let's use the 'aiService' DIRECTLY to test logic without HTTP layer first?
// No, we want to test the ROUTE.

// Let's us 'aiService' directly first to verify OpenAI Key.
const { analyzeWaste } = require('../services/aiService');

async function testDirectService() {
    console.log("--- Testing AI Service Directly ---");
    try {
        // Create a dummy buffer (1x1 pixel png)
        const buffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');

        console.log("Calling analyzeWaste...");
        const result = await analyzeWaste(buffer, 'image/png');
        console.log("✅ Service Success:", result);
    } catch (error) {
        console.error("❌ Service Failed:", error.message);
    }
}

testDirectService();
