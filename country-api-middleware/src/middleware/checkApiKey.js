const db = require('../config/db');

module.exports = function (req, res, next) {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey) {
        return res.status(401).json({ error: 'API key is required' });
    }

    const now = new Date().toISOString();

    // 1. Look up API key in DB
    db.get(`
        SELECT user_id, expires_at 
        FROM api_keys 
        WHERE api_key = ? 
          AND expires_at > ?`,
        [apiKey, now],
        (err, row) => {
            if (err) {
                console.error("DB error:", err.message);
                return res.status(500).json({ error: 'Server error while checking API key' });
            }

            if (!row) {
                return res.status(403).json({ error: 'Invalid or expired API key' });
            }

            // 2. Attach user info to request for downstream access
            req.user = { userId: row.user_id };

            // 3. Log usage in api_usage table
            const endpoint = req.originalUrl;
            db.run(`
                INSERT INTO api_usage (user_id, api_key, endpoint, timestamp) 
                VALUES (?, ?, ?, datetime('now'))`,
                [row.user_id, apiKey, endpoint],
                (usageErr) => {
                    if (usageErr) {
                        console.error("Usage log error:", usageErr.message);
                        // Don't block user even if logging fails
                    }

                    // 4. Let the request continue
                    next();
                }
            );
        }
    );
};
