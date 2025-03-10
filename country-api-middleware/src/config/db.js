const sqlite3 = require('sqlite3').verbose();
const path = require('path');

 
const db = new sqlite3.Database(path.join(__dirname, '../../database.sqlite'), (err) => {
    if (err) {
        console.error('Database connection failed:', err.message);
    } else {
        console.log('Connected to SQLite database.');
    }
});

// Create Users Table if not exists
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    `);
});


module.exports = db;