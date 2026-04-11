const fs = require('fs');
const path = require('path');
const { analyzeWaste } = require('../services/aiService');

async function testWithFile() {
    const filePath = path.join(__dirname, '../broken_bricks.png');
    if (!fs.existsSync(filePath)) {
        console.error("File not found:", filePath);
        return;
    }

    const buffer = fs.readFileSync(filePath);
    console.log("Analyzing broken_bricks.png...");

    try {
        const result = await analyzeWaste(buffer, 'image/png');
        console.log("✅ Result:", JSON.stringify(result, null, 2));
    } catch (err) {
        console.error("❌ Failed:", err.message);
    }
}

testWithFile();
