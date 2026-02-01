const admin = require('../config/firebaseAdmin');

const verifyToken = async (req, res, next) => {
    // Get token from header: "Authorization: Bearer <token>"
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided, authorization denied' });
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken; // Attach user info to request
        next();
    } catch (error) {
        console.error("Auth Error:", error);
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};

module.exports = verifyToken;
