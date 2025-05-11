const db = require('../config/db');

const blogPostDao = {
  createPost: (post) => {
  const sql = `
    INSERT INTO blog_posts (user_id, title, content, country, date_of_visit, image_url, created_at)
    VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
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
      // First delete any likes associated with the post
      await new Promise((resolve, reject) => {
        db.run(`DELETE FROM likes WHERE post_id = ?`, [id], function (err) {
          if (err) return reject(err);
          resolve();
        });
      });
  
      // Then delete the post itself
      return await new Promise((resolve, reject) => {
        db.run(`DELETE FROM blog_posts WHERE id = ?`, [id], function (err) {
          if (err) return reject(err);
          resolve(this.changes);
        });
      });
    } catch (err) {
      throw err;
    }
  }
  ,

  searchPosts: (filters, page, limit, sortBy = 'created_at') => {
  let sql = `
    SELECT blog_posts.*, users.username
    FROM blog_posts
    JOIN users ON blog_posts.user_id = users.id
    WHERE 1=1
  `;
  const params = [];

  if (filters.username) {
    sql += ` AND LOWER(users.username) LIKE ?`;
    params.push(`%${filters.username.toLowerCase()}%`);
  }

  if (filters.country) {
    sql += ` AND LOWER(blog_posts.country) LIKE ?`;
    params.push(`%${filters.country.toLowerCase()}%`);
  }

  let orderClause = 'ORDER BY blog_posts.created_at DESC'; // Default
  if (sortBy === 'likes') {
    orderClause = `
      ORDER BY (
        SELECT COUNT(*) FROM likes 
        WHERE likes.post_id = blog_posts.id AND type = 'like'
      ) DESC
    `;
  } else if (sortBy === 'comments') {
    orderClause = `
      ORDER BY (
        SELECT COUNT(*) FROM comments 
        WHERE comments.post_id = blog_posts.id
      ) DESC
    `;
  }

  const countSql = `SELECT COUNT(*) as total FROM (${sql})`;
  const dataSql = `${sql} ${orderClause} LIMIT ? OFFSET ?`;
  const dataParams = [...params, limit, (page - 1) * limit];

  return new Promise((resolve, reject) => {
    db.get(countSql, params, (err, countResult) => {
      if (err) return reject(err);
      const total = countResult.total;
      const totalPages = Math.ceil(total / limit);

      db.all(dataSql, dataParams, (err, rows) => {
        if (err) return reject(err);
        resolve({ posts: rows, totalPages });
      });
    });
  });
}
 
};

module.exports = blogPostDao;
