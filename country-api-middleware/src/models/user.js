const db = require('../config/db');

class User {
    static async create(username, email, hashedPassword) {
        return new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`,
                [username, email, hashedPassword],
                function (err) {
                    if (err) reject(err);
                    resolve({ id: this.lastID, username, email });
                }
            );
        });
    }

    static async findByEmail(email) {
        return new Promise((resolve, reject) => {
            console.log("Searching for email:", email);  // Log the email to check if it's correct
    
            db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, row) => {
                if (err) {
                    console.error("Database Query Error:", err.message);
                    return reject(err);
                }
                if (!row) {
                    console.log("No user found with email:", email);
                } else {
                    console.log("User found:", row);  // Log user data if found
                }
                resolve(row);
            });
        });
    }
    
}

module.exports = User;
