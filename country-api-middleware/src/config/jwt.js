const jwt = require('jsonwebtoken');
const { generateCSRFToken } = require('./csrf');  // Import fixed
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '24h';

// Check if the JWT_SECRET is correctly loaded
if (!JWT_SECRET) {
    console.error("Error: JWT_SECRET is not defined in environment variables!");
    process.exit(1);
}

const generateToken = (user) => {
    try {
        console.log("Generating JWT for user:", user.email);

        const accessToken = jwt.sign(
            { 
                id: user.id,
                email: user.email
            },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        const csrfToken = generateCSRFToken();  // Generate CSRF token

        console.log("Successfully generated tokens.");
        return { accessToken, csrfToken };
    } catch (error) {
        console.error("Error generating tokens:", error.message);
        return null;
    }
};

const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        console.error("Token verification failed:", error.message);
        return null;
    }
};

module.exports = { generateToken, verifyToken };
