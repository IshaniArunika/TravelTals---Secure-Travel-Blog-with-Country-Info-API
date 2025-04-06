const bcrypt = require('bcryptjs');
const { generateToken } = require('../config/jwt');  
const User = require('../models/user');

class AuthService {
    async register(username, email, password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        return User.create(username, email, hashedPassword);
    }

    async authenticate(email, password) {
        const user = await User.findByEmail(email);
        if (!user) {
            console.log("User not found");
            return null;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("Password mismatch");
            return null;
        }

        try {
            console.log(" About to generate tokens for user:", user.email);
            
            const result = generateToken(user); // DO NOT destructure immediately
            console.log("Token result:", result);
        
            const { accessToken, csrfToken } = result;
        
            const safeUser = {
                id: user.id,
                email: user.email,
                username: user.username
            };
        
            return {
                accessToken,
                csrfToken,
                user: safeUser
            };
        } catch (error) {
            console.error("CRASHED in token generation:", error.message);
            return null;
        }
          
    }
}

module.exports = new AuthService();
