const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

// Define the path to the SQLite database file
const dbPath = path.resolve(__dirname, '..', 'database.sqlite');

// Initialize the database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Database connection failed:', err.message);
  } else {
    console.log('Connected to SQLite database.');

    // Read and execute the SQL schema
    const schemaPath = path.resolve(__dirname, '..', 'sql', 'schema.sql');
    fs.readFile(schemaPath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading schema.sql:', err.message);
      } else {
        db.exec(data, (err) => {
          if (err) {
            console.error('Error executing schema.sql:', err.message);
          } else {
            console.log('Database schema initialized.');
          }
        });
      }
    });
  }
});

module.exports = db;