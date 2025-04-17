const db = require('../config/db');

class UsageDao {
  static async getUserIdByApiKey(apiKey) {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT user_id FROM api_keys WHERE api_key = ?`,
        [apiKey],
        (err, row) => {
          if (err) return reject(err);
          resolve(row ? row.user_id : null);
        }
      );
    });
  }

  static async getUsageCountLast24h(userId) {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT COUNT(*) as usageCount
         FROM api_usage
         WHERE user_id = ? AND timestamp >= datetime('now', '-1 day')`,
        [userId],
        (err, row) => {
          if (err) return reject(err);
          resolve(row?.usageCount || 0);
        }
      );
    });
  }
}

module.exports = UsageDao;
