require('dotenv').config();

async function testV1() {
    const key = process.env.GEMINI_API_KEY;
    const model = "gemini-1.5-flash";
    const url = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${key}`;

    try {
        console.log("Testing Raw Fetch to v1 (NOT v1beta)...");
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: "Hello" }] }]
            })
        });

        const data = await response.json();
        console.log("Response:", JSON.stringify(data, null, 2));
    } catch (e) {
        console.error("Fetch Error:", e.message);
    }
}

testV1();
