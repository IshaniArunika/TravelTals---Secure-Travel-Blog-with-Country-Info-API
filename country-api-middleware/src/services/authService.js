const bcrypt = require('bcryptjs');
const db = require('../config/db');
const { generateToken } = require('../config/jwt');  
const User = require('../models/user');
const { generateApiKey } = require('../config/apiKye'); 



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

            const apiKey = await this.generateOrFetchApiKey(user.id);
            console.log("Api_key :",apiKey)

            const safeUser = {
                id: user.id,
                email: user.email,
                username: user.username
            };
        
            return {
                accessToken,
                csrfToken,
                apiKey, 
                user: safeUser
            };
        } catch (error) {
            console.error("CRASHED in token generation:", error.message);
            return null;
        }
          
    }

    async generateOrFetchApiKey(userId) {
        return new Promise((resolve, reject) => {
            const now = new Date();
            const nowISO = now.toISOString();
            console.log("Checking for existing API key for user:", userId);
            db.get(
                `SELECT api_key FROM api_keys WHERE user_id = ? AND expires_at > ?`,
                [userId, nowISO],
                (err, row) => {
                    if (err) return reject(err);
                    if (row) return resolve(row.api_key); // Return existing

                    const newKey = generateApiKey();
                    const expires = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();

                    db.run(
                        `INSERT INTO api_keys (user_id, api_key, expires_at) VALUES (?, ?, ?)`,
                        [userId, newKey, expires],
                        function (err2) {
                            if (err2) return reject(err2);
                            resolve(newKey);
                        }
                    );
                }
            );
        });
    }
}

module.exports = new AuthService();
