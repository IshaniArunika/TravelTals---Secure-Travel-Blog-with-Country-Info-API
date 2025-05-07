const likeDao = require('../dao/likeDao');

const likePost = async (userId, postId, likeType) => {
  if (!['like', 'dislike'].includes(likeType)) {
    throw new Error('Invalid like type.');
  }
  await likeDao.addOrUpdateLike(userId, postId, likeType);
};

const fetchLikeCounts = async (postId) => {
  return await likeDao.getLikeCounts(postId);
};

module.exports = {
  likePost,
  fetchLikeCounts
};
