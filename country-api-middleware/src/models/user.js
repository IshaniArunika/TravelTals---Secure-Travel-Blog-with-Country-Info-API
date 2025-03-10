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
            db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, row) => {
                if (err) reject(err);
                resolve(row);
            });
        });
    }
}

module.exports = User;
