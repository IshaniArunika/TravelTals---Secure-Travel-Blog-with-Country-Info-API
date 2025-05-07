const db = require('../config/db');

const addOrUpdateLike = async (userId, postId, likeType) => {
  const sql = `
    INSERT INTO likes (user_id, post_id, type)
    VALUES (?, ?, ?)
    ON CONFLICT(user_id, post_id)
    DO UPDATE SET type = excluded.type;
  `;
  return await new Promise((resolve, reject) => {
    db.run(sql, [userId, postId, likeType], function (err) {
      if (err) return reject(err);
      resolve(this.changes);
    });
  });
};

const getLikeCounts = async (postId) => {
  const sql = `
    SELECT 
      SUM(CASE WHEN type = 'like' THEN 1 ELSE 0 END) AS likes,
      SUM(CASE WHEN type = 'dislike' THEN 1 ELSE 0 END) AS dislikes
    FROM likes
    WHERE post_id = ?
  `;
  return await new Promise((resolve, reject) => {
    db.get(sql, [postId], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
};

module.exports = {
  addOrUpdateLike,
  getLikeCounts
};
