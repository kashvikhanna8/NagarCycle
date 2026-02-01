const express = require('express');
const router = express.Router();
const multer = require('multer');
const { analyzeWaste } = require('../services/aiService');

// Memory storage to process image directly
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/analyze', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image provided' });
        }

        const result = await analyzeWaste(req.file.buffer, req.file.mimetype);
        res.json({ success: true, data: result });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
