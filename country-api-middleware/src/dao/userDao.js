const db = require('../config/db');

class UserDao {
    static async findByEmail(email) {
        return new Promise((resolve, reject) => {
            db.get(`SELECT id, email, username, role, plan, password FROM users WHERE email = ?`, [email], (err, row) => {
                if (err) return reject(err);
                resolve(row);
            });
        });
    }
    
    static async create(username, email, hashedPassword) {
        return new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO users (username, email, password, role, plan) VALUES (?, ?, ?, ?, ?)`,
                [username, email, hashedPassword, 'user', 'free'],
                function (err) {
                    if (err) return reject(err);
                    resolve({
                        id: this.lastID,
                        username,
                        email,
                        plan: 'free',
                        role: 'user'
                    });
                }
            );
        });
    }
    

    static async getById(id) {
        return new Promise((resolve, reject) => {
            db.get(`SELECT id, username, email, role, plan FROM users WHERE id = ?`, [id], (err, row) => {
                if (err) return reject(err);
                resolve(row);
            });
        });
    }

    static async listAll() {
        return new Promise((resolve, reject) => {
            db.all(`SELECT id, username, email, role, plan FROM users`, [], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    }

    static async updatePlan(userId, newPlan) {
        return new Promise((resolve, reject) => {
            db.run(`UPDATE users SET plan = ? WHERE id = ?`, [newPlan, userId], function (err) {
                if (err) return reject(err);
                resolve(true);
            });
        });
    }
}

module.exports = UserDao;
