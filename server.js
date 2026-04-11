const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // Serve static files from current directory

const verifyToken = require('./middleware/authMiddleware');
const aiRoutes = require('./routes/aiRoutes');

// Routes
app.use('/api/ai', aiRoutes);

// Basic Route (optional for API testing, but static files take precedence if index.html exists)
// app.get('/', (req, res) => {
//     res.send('API is running...');
// });

// Test Protected Route
app.get('/api/test-auth', verifyToken, (req, res) => {
    res.json({ message: 'Authenticated successfully!', user: req.user });
});

// Start Server
// AI Chat Route
app.post('/api/ai/chat', async (req, res) => {
    try {
        const { message } = req.body;
        const { chatWithTrashtalk } = require('./services/aiService');
        const reply = await chatWithTrashtalk(message);
        res.json({ reply });
    } catch (err) {
        res.status(500).json({ error: "Trashtalk offline" });
    }
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
