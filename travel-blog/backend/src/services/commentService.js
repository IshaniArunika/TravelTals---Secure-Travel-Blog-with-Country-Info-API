const commentDao = require('../dao/commentDao');

const commentService = {
  createComment: async ({ post_id, user_id, content }) => {
    return await commentDao.createComment({ post_id, user_id, content });
  },

  getCommentsByPostId: async (postId) => {
    return await commentDao.getCommentsByPostId(postId);
  },

  deleteComment: async (commentId, userId) => {
    return await commentDao.deleteComment(commentId, userId);
  },

  getCommentCountByPostId: async (postId) => {
    return await commentDao.getCommentCountByPostId(postId);
  }
};

module.exports = commentService;
