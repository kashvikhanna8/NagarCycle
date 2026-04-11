const fs = require('fs');
const path = require('path');
const { analyzeWaste } = require('../services/aiService');

async function test() {
    try {
        const filePath = path.join(__dirname, '../broken_bricks.png');
        if (!fs.existsSync(filePath)) {
            console.error("Test file missing:", filePath);
            return;
        }
        const buffer = fs.readFileSync(filePath);
        console.log("Starting analysis test...");
        const result = await analyzeWaste(buffer, 'image/png');
        console.log("✅ RESULT:", JSON.stringify(result, null, 2));
    } catch (e) {
        console.error("❌ TEST FAILED:", e.message);
    }
}

test();
