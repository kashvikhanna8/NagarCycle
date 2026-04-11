const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

/**
 * Hugging Face Analysis (Fallback)
 */
async function analyzeWithHF(imageBuffer) {
    console.log("⚠️ Using Hugging Face Analysis...");
    // Using a more standard classification model
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
            console.error(`HF Error Detail: ${response.status} - ${errText}`);
            throw new Error(`HF API responded with ${response.status}`);
        }

        const result = await response.json();

        // DETR returns objects with [ { score, label, box } ]
        // We'll take the top detected object
        let label = "unknown waste";
        let confidence = 0.5;

        if (Array.isArray(result) && result.length > 0) {
            label = result[0].label || "item";
            confidence = result[0].score || 0.5;
        } else if (result.error) {
            throw new Error(result.error);
        }

        console.log("HF Detected:", label);

        const desc = label.toLowerCase();
        let primary = "Non-Recyclable / Residual Waste";
        let sub = label.charAt(0).toUpperCase() + label.slice(1);
        let sellable = "No";
        let action = "dispose";
        let value = "low";

        // Mapping Logic
        if (desc.includes("bottle") || desc.includes("plastic") || desc.includes("cup") || desc.includes("can")) {
            primary = "Recyclable Waste";
            sellable = "Yes";
            action = "sell";
            value = "medium";
        } else if (desc.includes("keyboard") || desc.includes("mouse") || desc.includes("laptop") || desc.includes("phone") || desc.includes("electronics")) {
            primary = "E-Waste";
            sellable = "Yes";
            action = "sell";
            value = "high";
        } else if (desc.includes("brick") || desc.includes("concrete") || desc.includes("stone")) {
            primary = "Construction & Demolition Waste";
            sub = "Construction Debris";
            sellable = "No";
            action = "special handling";
        } else if (desc.includes("apple") || desc.includes("banana") || desc.includes("orange") || desc.includes("food")) {
            primary = "Organic Waste";
            sub = "Kitchen Waste";
            sellable = "No";
            action = "compost";
        }

        return {
            primaryCategory: primary,
            subCategory: sub,
            isSellingAdvisable: sellable,
            recommendedAction: action,
            estimatedRecoveryValue: value,
            environmentalImpact: "Recovery restricted by fallback analysis accuracy.",
            confidence: confidence,
            quality_score: 5,
            analysis: `Identified as ${label} via Hugging Face Vision. (Fallback active)`
        };

    } catch (error) {
        console.error("HF Fallback Failed:", error.message);
        throw error;
    }
}

/**
 * Logic to analyze waste using Google's Gemini 1.5 Flash Vision
 */
async function analyzeWaste(imageBuffer, mimeType) {
    try {
        console.log("🚀 Attempting Gemini AI...");
        const imagePart = {
            inlineData: {
                data: imageBuffer.toString("base64"),
                mimeType
            }
        };

        const result = await model.generateContent([
            "Return JSON only: {primaryCategory, subCategory, isSellingAdvisable, recommendedAction, estimatedRecoveryValue, environmentalImpact, confidence, quality_score, analysis}",
            imagePart
        ]);
        const response = await result.response;
        let text = response.text();
        text = text.replace(/```json/g, "").replace(/```/g, "").trim();
        return JSON.parse(text);

    } catch (error) {
        console.warn("Gemini Failed:", error.message);

        // Check if HF token exists
        if (process.env.HF_API_TOKEN) {
            try {
                return await analyzeWithHF(imageBuffer);
            } catch (hfError) {
                console.error("All AI Services Failed.");
                // Return a graceful error result for the UI
                return {
                    primaryCategory: "Unknown",
                    subCategory: "Unknown",
                    isSellingAdvisable: "No",
                    recommendedAction: "manual check",
                    estimatedRecoveryValue: "N/A",
                    environmentalImpact: "Error analyzing image.",
                    confidence: 0,
                    quality_score: 1,
                    analysis: "AI Services are currently unavailable. Please enter details manually."
                };
            }
        }
        throw error;
    }
}

/**
 * TRASHTALK — Sassy Chatbot Logic
 */
async function chatWithTrashtalk(userMessage) {
    try {
        const result = await model.generateContent(`Be witty and sassy about waste. User says: ${userMessage}. Return JSON { "reply": "string" }`);
        const response = await result.response;
        let text = response.text();
        text = text.replace(/```json/g, "").replace(/```/g, "").trim();
        const json = JSON.parse(text);
        return json.reply;
    } catch (error) {
        return "I'm experiencing a mental block (API issues). Ask me something else!";
    }
}

module.exports = { analyzeWaste, chatWithTrashtalk };
