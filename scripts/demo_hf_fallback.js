const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function demoHFLogic() {
    console.log("🔍 Testing Hugging Face Fallback (Real Image)...");

    // Use a REAL image from the dataset
    const imagePath = path.join(__dirname, '../dataset/dataset-resized/plastic/plastic1.jpg');

    if (!fs.existsSync(imagePath)) {
        console.error("❌ Test image not found at:", imagePath);
        return;
    }

    const imageBuffer = fs.readFileSync(imagePath);
    console.log(`📸 Loaded test image: ${imagePath} (${imageBuffer.length} bytes)`);

    // MODEL: google/vit-base-patch16-224 (Classification)
    // This is a robust standard model that should work on the inference API.
    const MODEL_ID = "google/vit-base-patch16-224";

    // Per error message: Use router.huggingface.co
    const API_URL = `https://router.huggingface.co/hf-inference/models/${MODEL_ID}`;

    try {
        console.log(`📡 Sending POST request to ${API_URL}...`);

        const response = await fetch(API_URL, {
            headers: {
                Authorization: `Bearer ${process.env.HF_API_TOKEN}`,
                "Content-Type": "application/octet-stream" // Critical for binary upload
            },
            method: "POST",
            body: imageBuffer,
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`API Error: ${response.status} ${response.statusText} - ${errText}`);
        }

        const result = await response.json();
        console.log("\n✅ Response Received!");
        console.log("---------------------");
        console.log(JSON.stringify(result, null, 2));
        console.log("---------------------");

        // Output interpretation
        const topLabel = result[0]?.label || "unknown";
        console.log(` Classification: ${topLabel}`);

    } catch (error) {
        console.error("❌ Failed:", error.message);
    }
}

demoHFLogic();
