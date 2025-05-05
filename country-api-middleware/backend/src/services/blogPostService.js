const blogPostDao = require('../dao/blogPostDao');

module.exports = {
  createPost: (postData, callback) => {
    blogPostDao.createPost(postData, callback);
  },

  getPostById: (id, callback) => {
    blogPostDao.getPostById(id, callback);
  },

  getAllPosts: (callback) => {
    blogPostDao.getAllPosts(callback);
  },

  updatePost: (id, postData, callback) => {
    blogPostDao.updatePost(id, postData, callback);
  },

  deletePost: (id, userId, callback) => {
    blogPostDao.deletePost(id, userId, callback);
  },

  searchPosts: (filters, page, limit, callback) => {
    blogPostDao.searchPosts(filters, page, limit, callback);
  }
};
