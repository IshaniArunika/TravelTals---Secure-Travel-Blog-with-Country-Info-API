const blogPostDao = require('../dao/blogPostDao');

const blogPostService = {
  createPost: async (postData) => {
    return await blogPostDao.createPost(postData);
  },

  getPostById: async (id) => {
    return await blogPostDao.getPostById(id);
  },

  getAllPosts: async () => {
    return await blogPostDao.getAllPosts();
  },

  updatePost: async (id, postData) => {
    return await blogPostDao.updatePost(id, postData);
  },

  deletePost: async (id) => {
    return await blogPostDao.deletePost(id);
  },

  searchPosts: async (filters, page, limit) => {
    return await blogPostDao.searchPosts(filters, page, limit);
  }
};

module.exports = blogPostService;
