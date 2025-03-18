const { verifyToken } = require('../config/jwt');

const authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Extract token from header

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized - No Token Provided' });
    }

    const decoded = verifyToken(token); // Verify JWT token
    if (!decoded) {
        return res.status(403).json({ error: 'Invalid or Expired Token' });
    }

    req.user = decoded; // Attach user data to request object
    next();
};

module.exports = { authenticateJWT };
