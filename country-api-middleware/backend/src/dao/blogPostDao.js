const db = require('../config/db');

module.exports = {
  createPost: (post, callback) => {
    const sql = `
      INSERT INTO blog_posts (user_id, title, content, country, date_of_visit, image_url)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const params = [
      post.user_id,
      post.title,
      post.content,
      post.country,
      post.date_of_visit,
      post.image_url
    ];
    db.run(sql, params, function (err) {
      callback(err, this?.lastID);
    });
  },

  getPostById: (id, callback) => {
    const sql = `SELECT * FROM blog_posts WHERE id = ?`;
    db.get(sql, [id], callback);
  },

  getAllPosts: (callback) => {
    const sql = `
      SELECT blog_posts.*, users.username
      FROM blog_posts
      JOIN users ON blog_posts.user_id = users.id
      ORDER BY created_at DESC
    `;
    db.all(sql, [], callback);
  },

  updatePost: (id, postData, callback) => {
    // First, fetch the existing post
    const getSql = `SELECT * FROM blog_posts WHERE id = ?`;
    db.get(getSql, [id], (err, existingPost) => {
      if (err) return callback(err);
      if (!existingPost) return callback(null, 0); // No post found
  
      // Merge existing data with new data
      const updatedPost = {
        ...existingPost,
        ...postData, // only fields passed will override existing values
      };
      console.log('Updating post with values:', updatedPost);

      const updateSql = `
        UPDATE blog_posts SET 
          title = ?, 
          content = ?, 
          country = ?, 
          date_of_visit = ?, 
          image_url = ?, 
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;
  
      const params = [
        updatedPost.title,
        updatedPost.content,
        updatedPost.country,
        updatedPost.date_of_visit,
        updatedPost.image_url,
        id,
      ];
  
      db.run(updateSql, params, function (err) {
        callback(err, this?.changes);
      });
    });
  }
  ,

  deletePost: (id, callback) => {
    const sql = `DELETE FROM blog_posts WHERE id = ?`;
    db.run(sql, [id], function (err) {
      if (typeof callback === 'function') {
        callback(err, this?.changes);
      }
    });
  },

  searchPosts: (filters, page, limit, callback) => {
    let sql = `
      SELECT blog_posts.*, users.username
      FROM blog_posts
      JOIN users ON blog_posts.user_id = users.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.country) {
      sql += ` AND LOWER(blog_posts.country) LIKE LOWER(?)`;
      params.push(`%${filters.country}%`);
    }

    if (filters.username) {
      sql += ` AND LOWER(users.username) LIKE LOWER(?)`;
      params.push(`%${filters.username}%`);
    }

    sql += ` ORDER BY blog_posts.created_at DESC LIMIT ? OFFSET ?`;
    params.push(limit);
    params.push((page - 1) * limit);

    db.all(sql, params, callback);
}
  
};
