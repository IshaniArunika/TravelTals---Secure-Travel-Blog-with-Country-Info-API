const express = require('express');
const router = express.Router();
const followService = require('../services/followService');
const { authenticateJWT } = require('../middleware/auth');
const { csrfProtection } = require('../middleware/csrf');

router.use(authenticateJWT);
router.use(csrfProtection);

router.post('/:id', async (req, res) => {
  const followerId = req.user.id;
  const followingId = parseInt(req.params.id, 10);

  try {
    const result = await followService.followUser(followerId, followingId);
    res.status(200).json({ message: result });
  } catch (error) {
    res.status(409).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  const followerId = req.user.id;
  const followingId = parseInt(req.params.id, 10);

  try {
    await followService.unfollowUser(followerId, followingId);
    res.status(200).json({ message: 'Unfollow successful.' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/followers/:id', async (req, res) => {
  try {
    const followers = await followService.getFollowers(parseInt(req.params.id, 10));
    res.status(200).json({ followers });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/following/:id', async (req, res) => {
  try {
    const following = await followService.getFollowing(parseInt(req.params.id, 10));
    res.status(200).json({ following });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
