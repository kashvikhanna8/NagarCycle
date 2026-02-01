const OpenAI = require("openai");
require('dotenv').config();

// Initialize Qubrid AI (OpenAI Compatible)
// Note: Base URL derived from Qubrid standard. Adjust if listed differently in dashboard.
const qubridClient = new OpenAI({
    apiKey: process.env.QUBRID_API_KEY,
    baseURL: "https://api.qubrid.com/v1"
});

const fs = require('fs');
const path = require('path');

// --- Qubrid Qwen3-VL Analysis ---
async function analyzeWithQubrid(imageBuffer, mimeType) {
    console.log("🚀 Sending image to Qubrid AI (Qwen3-VL 8B)...");

    const base64Image = imageBuffer.toString('base64');
    const dataUrl = `data:${mimeType};base64,${base64Image}`;

    const prompt = `
        You are a highly accurate AI Waste Classifier.
        Analyze the image and categorize the item strictly based on these 3 steps:

        STEP 1: Primary Category (Choose One)
        - Organic Waste
        - Recyclable Waste
        - E-Waste
        - Construction & Demolition Waste
        - Hazardous / Special Waste
        - Non-Recyclable / Residual Waste

        STEP 2: Material-Level Sub-Classification
        - Strictly follow the material types (e.g., PET bottles, Food leftovers, Circuit boards, Bricks, Medical waste, etc.)

        STEP 3: Return JSON Format (ONLY JSON, NO MARKDOWN)
        {
            "primaryCategory": "string",
            "subCategory": "string",
            "isSellingAdvisable": "Yes / No",
            "recommendedAction": "sell / recycle / compost / reuse / special handling / dispose",
            "estimatedRecoveryValue": "low / medium / high",
            "environmentalImpact": "string explaining impact",
            "confidence": 0.0-1.0 (number),
            "quality_score": 1-10 (number, 1=broken/dirty, 10=pristine),
            "analysis": "Short witty explanation of why it was classified this way"
        }

        RULES:
        - Prefer reuse > recycle > disposal.
        - Hazardous waste is NOT allowed for selling.
        - Organic waste is for compost/bio-gas.
        - Return ONLY raw JSON. Do not wrap in \`\`\`json or \`\`\`.
    `;

    try {
        const response = await qubridClient.chat.completions.create({
            model: "qwen3-vl-8b-instruct", // User Specified Model ID
            messages: [
                {
                    role: "user",
                    content: [
                        { type: "text", text: prompt },
                        {
                            type: "image_url",
                            image_url: {
                                url: dataUrl
                            }
                        }
                    ]
                }
            ],
            max_tokens: 1024,
            temperature: 0.1 // Low temp for strict JSON
        });

        let content = response.choices[0].message.content;

        // Clean markdown if present
        content = content.replace(/```json/g, '').replace(/```/g, '').trim();

        return JSON.parse(content);

    } catch (error) {
        console.error("Qubrid Qwen3-VL Error:", error.message);
        throw error; // Trigger fallback if needed
    }
}

// --- Hugging Face Fallback (Preserved) ---
async function analyzeWithHF(imageBuffer) {
    console.log("⚠️ Triggering Hugging Face Fallback...");
    const MODEL_ID = "google/vit-base-patch16-224";
    const API_URL = `https://router.huggingface.co/hf-inference/models/${MODEL_ID}`;

    try {
        const response = await fetch(API_URL, {
            headers: {
                Authorization: `Bearer ${process.env.HF_API_TOKEN}`,
                "Content-Type": "application/octet-stream"
            },
            method: "POST",
            body: imageBuffer,
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`HF API Error: ${response.status} ${errText}`);
        }

        const result = await response.json();
        const topResult = result[0];
        const description = topResult?.label || "unknown";
        const confidence = topResult?.score || 0;

        console.log("HF Classification:", description, confidence);

        const desc = description.toLowerCase();
        let primary = "Non-Recyclable / Residual Waste";
        let sub = "Miscellaneous";
        let sellable = "No";
        let action = "Dispose";
        let value = "low";

        // Simple mapping
        if (desc.includes("food") || desc.includes("fruit") || desc.includes("vegetable") || desc.includes("bread")) {
            primary = "Organic Waste";
            sub = "Kitchen Waste";
            sellable = "No";
            action = "Compost";
        } else if (desc.includes("bottle") || desc.includes("plastic") || desc.includes("can") || desc.includes("metal")) {
            primary = "Recyclable Waste";
            sub = desc.includes("bottle") ? "Plastic" : "Metal";
            sellable = "Yes";
            action = "Sell to recycler";
            value = "center";
        }

        return {
            primaryCategory: primary,
            subCategory: sub,
            isSellingAdvisable: sellable,
            recommendedAction: action,
            estimatedRecoveryValue: value,
            environmentalImpact: "Resource recovery fallback",
            confidence: confidence,
            quality_score: 5,
            analysis: `Identified material: ${description} (Fallback Mode)`
        };

    } catch (error) {
        console.error("HF Fallback Failed:", error);
        throw new Error("All AI Services Failed.");
    }
}


async function analyzeWaste(imageBuffer, mimeType) {
    try {
        // [MODIFIED] Use Qubrid First
        return await analyzeWithQubrid(imageBuffer, mimeType);
    } catch (error) {
        console.warn("Qubrid Analysis Failed. Attempting Fallback...", error.message);
        try {
            // Optional: fallback to Gemini if configured, or HF
            if (process.env.HF_API_TOKEN) {
                return await analyzeWithHF(imageBuffer);
            }
        } catch (e) {
            throw new Error("All AI services failed.");
        }
        throw error;
    }
}

// --- TRASHTALK Sassy Chat Logic (Updated to use Qubrid) ---
async function chatWithTrashtalk(userMessage) {
    try {
        const chatPrompt = `
            You are 'TRASHTALK', a futuristic, witty, and slightly sassy AI waste wingman.
            User: "${userMessage}"
            Reply with a JSON object { "reply": "string" }.
            Keep it short, punchy, and eco-themed.
        `;

        const response = await qubridClient.chat.completions.create({
            model: "qwen3-vl-8b-instruct", // Or a cheaper text model if available
            messages: [{ role: "user", content: chatPrompt }],
            response_format: { type: "json_object" }
        });

        const json = JSON.parse(response.choices[0].message.content);
        return json.reply || "Systems unstable. Try again.";
    } catch (error) {
        console.error("Trashtalk Chat Error:", error);
        return "I'm having a connection glitch. Ask again later!";
    }
}

module.exports = { analyzeWaste, chatWithTrashtalk };
