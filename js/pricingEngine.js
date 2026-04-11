
/**
 * WASTE PRICING ENGINE (Rule-Based + AI Insights)
 * -----------------------------------------------
 * This system calculates fair, transparent prices based on:
 * 1. Base Market Rate (Static Database)
 * 2. Condition (Usability Score)
 * 3. Segregation (Clean vs Mixed)
 * 4. Local Demand (Location-based)
 */

// 1. Waste Value Database (Static Layer)
// Prices are in INR per Kg
const WASTE_PRICES = {
    "plastic": { base: 12, label: "Plastic" },
    "metal": { base: 35, label: "Metal (Iron/Steel)" },
    "paper": { base: 8, label: "Paper/Cardboard" },
    "glass": { base: 3, label: "Glass" },
    "e-waste": { base: 60, label: "E-Waste" },
    "organic": { base: 1, label: "Organic/Compost" },
    "construction": { base: 0.5, label: "Debris/Construction" },
    "trash": { base: 0, label: "Trash/Unusable" },
    "other": { base: 0, label: "Other" }
};

// ... (multipliers remain same)

function calculateFairPrice(wasteType, quantity, segregation, qualityScore, location) {
    // Handle Trash / Low Quality explicitly
    if (wasteType === 'trash' || (qualityScore && qualityScore <= 1)) {
        return {
            wasteType: "Trash / Unusable",
            baseRate: 0,
            factors: { condition: 0, qualityScore: qualityScore || 1, segregation: 0, demand: 0 },
            unitPrice: 0,
            totalValue: 0,
            currency: "₹",
            isTrash: true,
            message: "Item appears to be unusable or non-recyclable. Recommended for proper disposal."
        };
    }

    const typeData = WASTE_PRICES[wasteType] || WASTE_PRICES['other'];
    const baseRate = typeData.base;

    // Quality Multiplier Algorithm
    let condMult = 0.7 + ((qualityScore || 5) - 1) * (0.8 / 9);
    condMult = Math.round(condMult * 100) / 100;

    const segMult = SEGREGATION_MULTIPLIERS[segregation] || 1.0;
    const demandMult = getDemandMultiplier(location, wasteType);

    // Formula: Base Rate * Quantity * Condition * Segregation * Demand
    let unitPrice = baseRate * condMult * segMult * demandMult;
    unitPrice = Math.round(unitPrice * 100) / 100;
    const totalValue = Math.round(unitPrice * quantity);

    return {
        wasteType: typeData.label,
        baseRate: baseRate,
        factors: {
            condition: condMult,
            qualityScore: qualityScore || 5,
            segregation: segMult,
            demand: demandMult
        },
        unitPrice: unitPrice,
        totalValue: totalValue,
        currency: "₹",
        isTrash: false
    };
}

// 2. Multipliers (Logic Layer)

const CONDITION_MULTIPLIERS = {
    1: 0.8,  // Low (Scrap)
    2: 1.0,  // Medium (Repairable)
    3: 1.5   // High (Like New/Reusable)
};

const SEGREGATION_MULTIPLIERS = {
    "mixed": 0.8,      // Mixed/Contaminated
    "segregated": 1.1  // Clean/Sorted
};

// Mock Demand Data (Market Layer)
// In a real app, this would query the backend for active recycler requests in the pincode.
// Returns a multiplier between 0.9 (Oversupply) and 1.3 (High Demand)
function getDemandMultiplier(location, wasteType) {
    // Simulating high demand for Metal and E-Waste in urban areas
    if (wasteType === 'metal' || wasteType === 'e-waste') return 1.25;
    if (wasteType === 'plastic') return 1.1;
    return 1.0; // Standard demand
}

/**
 * Calculates the fair market price.
 * @param {string} wasteType - Key from WASTE_PRICES
 * @param {number} quantity - Weight in Kg
 * @param {string} segregation - 'mixed' or 'segregated'
 * @param {number} usabilityScore - 1, 2, or 3
 * @param {string} location - User's location string
 * @returns {Object} Pricing breakdown
 */
/**
 * Calculates the fair market price.
 * @param {string} wasteType - Key from WASTE_PRICES
 * @param {number} quantity - Weight in Kg
 * @param {string} segregation - 'mixed' or 'segregated'
 * @param {string} location - User's location string
 * @returns {Object} Pricing breakdown
 */
/**
 * Calculates the fair market price.
 * @param {string} wasteType - Key from WASTE_PRICES
 * @param {number} quantity - Weight in Kg
 * @param {string} segregation - 'mixed' or 'segregated'
 * @param {number} qualityScore - AI assessed score (1-10), default 5
 * @param {string} location - User's location string
 * @returns {Object} Pricing breakdown
 */
function calculateFairPrice(wasteType, quantity, segregation, qualityScore, location) {
    const typeData = WASTE_PRICES[wasteType] || WASTE_PRICES['other'];
    const baseRate = typeData.base;

    // Quality Multiplier Algorithm
    // Score 1-10 maps to Multiplier 0.7x - 1.5x
    // Formula: 0.7 + (Score - 1) * (0.8 / 9)
    // 1 -> 0.7
    // 5 -> 1.05
    // 10 -> 1.5
    let condMult = 0.7 + ((qualityScore || 5) - 1) * (0.8 / 9);
    condMult = Math.round(condMult * 100) / 100; // Round to 2 decimals

    const segMult = SEGREGATION_MULTIPLIERS[segregation] || 1.0;
    const demandMult = getDemandMultiplier(location, wasteType);

    // Formula: Base Rate * Quantity * Condition * Segregation * Demand
    let unitPrice = baseRate * condMult * segMult * demandMult;
    unitPrice = Math.round(unitPrice * 100) / 100;
    const totalValue = Math.round(unitPrice * quantity);

    return {
        wasteType: typeData.label,
        baseRate: baseRate,
        factors: {
            condition: condMult,
            qualityScore: qualityScore || 5,
            segregation: segMult,
            demand: demandMult
        },
        unitPrice: unitPrice,
        totalValue: totalValue,
        currency: "₹"
    };
}

/**
 * AI PERCEPTION LAYER (Mock)
 * Simulates analyzing an image to find Waste Type and Condition.
 * Replace this with OpenAI Vision API call.
 */
async function analyzeWasteImage(imageFile) {
    console.log("Analyzing image with AI...");

    try {
        const formData = new FormData();
        formData.append('image', imageFile);

        const response = await fetch('/api/ai/analyze', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errText = await response.json().then(j => j.error).catch(() => response.statusText);
            throw new Error(errText || `Server returned ${response.status}`);
        }

        const data = await response.json();
        const result = data.data;

        // Map Backend result to Frontend format for the advanced 3-step system
        return {
            detectedType: result.primaryCategory,
            primaryCategory: result.primaryCategory || 'Other',
            subCategory: result.subCategory || 'Waste',
            isSellingAdvisable: result.isSellingAdvisable || 'No',
            recommendedAction: result.recommendedAction || 'manual check',
            estimatedRecoveryValue: result.estimatedRecoveryValue || 'low',
            environmentalImpact: result.environmentalImpact || 'Contact local collector.',
            confidence: result.confidence || 0,
            qualityScore: result.quality_score || 5,
            analysis: result.analysis || 'Analysis failed. Please try again.'
        };

    } catch (error) {
        console.error("AI Error:", error);
        return {
            detectedType: 'other',
            primaryCategory: 'Other',
            subCategory: 'Waste',
            isSellingAdvisable: 'No',
            recommendedAction: 'manual check',
            estimatedRecoveryValue: 'low',
            environmentalImpact: 'AI Analysis currently unavailable.',
            confidence: 0,
            qualityScore: 5,
            analysis: `AI Analysis Failed: ${error.message}. Please restart the server or check your API key.`
        };
    }

}

// Export for usage
window.PricingEngine = {
    calculateFairPrice,
    analyzeWasteImage,
    prices: WASTE_PRICES
};
