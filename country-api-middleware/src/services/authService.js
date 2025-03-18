const bcrypt = require('bcryptjs');
const { generateToken } = require('../config/jwt');
const User = require('../models/user');

class AuthService {
    // ✅ Register a new user
    async register(username, email, password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        return User.create(username, email, hashedPassword); // Save user to DB
    }

    // ✅ Authenticate user & generate token
    async authenticate(email, password) {
        const user = await User.findByEmail(email);
        if (!user) return null;

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return null;

        const token = generateToken(user); // Generate JWT token
        return { token, user };
    }
}

module.exports = new AuthService();
