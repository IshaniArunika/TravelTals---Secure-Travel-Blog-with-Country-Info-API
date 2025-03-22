const bcrypt = require('bcryptjs');
const { generateToken } = require('../config/jwt');
const User = require('../models/user');

class AuthService {
    // Register a new user
    async register(username, email, password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        return User.create(username, email, hashedPassword); // Save user to DB
    }

    // Authenticate user & generate token
    async authenticate(email, password) {
        // console.log("authontication :",email);
        // console.log("authontication :",password);
        const user = await User.findByEmail(email);
        console.log(user)
        if (!user) {
            console.log("Password does not match");
            return null;
        }
        console.log("Password matched");
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return null;

        try {
            const { accessToken, csrfToken } = generateToken(user);  // Fix here: Changed 'accessJWTToken' to 'accessToken'

            console.log("Generated Access Token:", accessToken);
            console.log("Generated CSRF Token:", csrfToken);

            return { accessToken, csrfToken, user };
        } catch (error) {
            console.error("Error generating tokens:", error.message);
            return null;
        }
    }
}

module.exports = new AuthService();
