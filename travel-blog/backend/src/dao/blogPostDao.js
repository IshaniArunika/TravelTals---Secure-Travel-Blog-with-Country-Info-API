const db = require('../config/db');

const blogPostDao = {
  createPost: (post) => {
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

    return new Promise((resolve, reject) => {
      db.run(sql, params, function (err) {
        if (err) return reject(err);
        resolve(this.lastID);
      });
    });
  },

  getPostById: (id) => {
    const sql = `SELECT * FROM blog_posts WHERE id = ?`;

    return new Promise((resolve, reject) => {
      db.get(sql, [id], (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });
  },

  getAllPosts: () => {
    const sql = `
      SELECT blog_posts.*, users.username
      FROM blog_posts
      JOIN users ON blog_posts.user_id = users.id
      ORDER BY created_at DESC
    `;

    return new Promise((resolve, reject) => {
      db.all(sql, [], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  },

  updatePost: (id, postData) => {
    return new Promise((resolve, reject) => {
      db.get(`SELECT * FROM blog_posts WHERE id = ?`, [id], (err, existingPost) => {
        if (err) return reject(err);
        if (!existingPost) return resolve(0);

        const updatedPost = { ...existingPost, ...postData };

        const sql = `
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
          id
        ];

        db.run(sql, params, function (err) {
          if (err) return reject(err);
          resolve(this.changes);
        });
      });
    });
  },

  deletePost: async (id) => {
    try {
      await new Promise((resolve, reject) => {
        db.run(`DELETE FROM post_likes WHERE post_id = ?`, [id], function (err) {
          if (err) return reject(err);
          resolve();
        });
      });

      return await new Promise((resolve, reject) => {
        db.run(`DELETE FROM blog_posts WHERE id = ?`, [id], function (err) {
          if (err) return reject(err);
          resolve(this.changes);
        });
      });
    } catch (err) {
      throw err;
    }
  },

  searchPosts: (filters, page, limit) => {
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
    params.push(limit, (page - 1) * limit);

    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }
};

module.exports = blogPostDao;
