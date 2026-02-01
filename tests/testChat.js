async function testChat() {
    try {
        const response = await fetch('http://localhost:5000/api/ai/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: "Hello Trashtalk!" })
        });
        const data = await response.json();
        console.log("Trashtalk Box Result:", data);
        if (data.reply) console.log("✅ Chat Endpoint is LIVE and Sassy.");
    } catch (err) {
        console.error("❌ Failed to connect to Trashtalk:", err.message);
    }
}
testChat();
