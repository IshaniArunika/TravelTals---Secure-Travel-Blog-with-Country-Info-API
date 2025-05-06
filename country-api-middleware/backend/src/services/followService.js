const followDao = require('../dao/followDao');

const followUser = async (followerId, followingId) => {
  if (followerId === followingId) {
    throw new Error("You cannot follow yourself.");
  }

  const changes = await followDao.followUser(followerId, followingId);

  if (changes === 0) {
    throw new Error("Already followed.");
  }

  return 'Follow successful.';
};

const unfollowUser = async (followerId, followingId) => {
  await followDao.unfollowUser(followerId, followingId);
};

const getFollowers = async (userId) => {
  return await followDao.getFollowers(userId);
};

const getFollowing = async (userId) => {
  return await followDao.getFollowing(userId);
};

module.exports = {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing
};
