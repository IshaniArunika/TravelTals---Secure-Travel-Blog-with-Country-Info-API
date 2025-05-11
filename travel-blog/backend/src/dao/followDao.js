const db = require('../config/db');

const followUser = (followerId, followingId) => {
  const sql = `INSERT OR IGNORE INTO follows (follower_id, following_id) VALUES (?, ?)`;
  return new Promise((resolve, reject) => {
    db.run(sql, [followerId, followingId], function (err) {
      if (err) return reject(err);
      resolve(this.changes); // 0 if already followed, 1 if inserted
    });
  });
};

const unfollowUser = (followerId, followingId) => {
  const sql = `DELETE FROM follows WHERE follower_id = ? AND following_id = ?`;
  return new Promise((resolve, reject) => {
    db.run(sql, [followerId, followingId], function (err) {
      if (err) return reject(err);
      resolve(this.changes);
    });
  });
};

const getFollowers = (userId) => {
  const sql = `
    SELECT u.id, u.username
    FROM follows f
    JOIN users u ON f.follower_id = u.id
    WHERE f.following_id = ?
  `;
  return new Promise((resolve, reject) => {
    db.all(sql, [userId], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

const getFollowing = (userId) => {
  const sql = `
    SELECT u.id, u.username
    FROM follows f
    JOIN users u ON f.following_id = u.id
    WHERE f.follower_id = ?
  `;
  return new Promise((resolve, reject) => {
    db.all(sql, [userId], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

module.exports = {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing
};
