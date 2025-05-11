const db = require('../config/db');

// Create a new comment
const createComment = ({ post_id, user_id, content }) => {
 const sql = `
  INSERT INTO comments (post_id, user_id, content, created_at)
  VALUES (?, ?, ?, datetime('now', 'localtime'))
`;

  const params = [post_id, user_id, content];

  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) {
        console.error("DB insert error:", err.message); // <- log the error
        return reject(err);
      }
      resolve(this.lastID);
    });
  });
};




// Get all comments for a specific post
const getCommentsByPostId = (postId) => {
  const sql = `
    SELECT comments.*, users.username 
    FROM comments
    JOIN users ON comments.user_id = users.id
    WHERE post_id = ?
    ORDER BY created_at DESC
  `;

  return new Promise((resolve, reject) => {
    db.all(sql, [postId], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

 
const getCommentCountByPostId = (postId) => {
  const sql = `SELECT COUNT(*) AS count FROM comments WHERE post_id = ?`;
  return new Promise((resolve, reject) => {
    db.get(sql, [postId], (err, row) => {
      if (err) return reject(err);
      resolve(row.count);
    });
  });
};


// Delete a comment by ID
const deleteComment = (commentId, userId) => {
  const sql = `DELETE FROM comments WHERE id = ? AND user_id = ?`;
  return new Promise((resolve, reject) => {
    db.run(sql, [commentId, userId], function (err) {
      if (err) return reject(err);
      resolve(this.changes); // returns 1 if deleted
    });
  });
};

module.exports = {
  createComment,
  getCommentsByPostId,
  deleteComment,
  getCommentCountByPostId
};

