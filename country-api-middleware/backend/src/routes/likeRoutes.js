const express = require('express');
const router = express.Router();
const likeService = require('../services/likeService');
const { authenticateJWT } = require('../middleware/auth');
const { csrfProtection } = require('../middleware/csrf');

// Public route — anyone can get like/dislike count
router.get('/:postId', async (req, res) => {
  const postId = parseInt(req.params.postId, 10);
  try {
    const counts = await likeService.fetchLikeCounts(postId);
    res.status(200).json(counts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve like counts.' });
  }
});

// Protected route — only logged in users can like/dislike
router.use(authenticateJWT);
router.use(csrfProtection);

router.post('/:postId', async (req, res) => {
  const userId = req.user.id;
  const postId = parseInt(req.params.postId, 10);
  const type = req.body.type;

  try {
    await likeService.likePost(userId, postId, type);
    res.status(200).json({ message: `Post ${type}d successfully.` });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
