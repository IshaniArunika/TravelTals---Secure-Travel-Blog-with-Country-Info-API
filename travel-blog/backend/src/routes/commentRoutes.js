const express = require('express');
const router = express.Router();
const commentService = require('../services/commentService');
const { authenticateJWT } = require('../middleware/auth');
const { csrfProtection } = require('../middleware/csrf');

// Get comments for a specific post (public)
router.get('/post/:postId', async (req, res) => {
  const postId = req.params.postId;

  try {
    const comments = await commentService.getCommentsByPostId(postId);
    res.status(200).json(comments);
  } catch (err) {
    console.error('Failed to get comments:', err.message);
    res.status(500).json({ error: 'Failed to retrieve comments' });
  }
});

// GET /comments/count/:postId
router.get('/count/:postId', async (req, res) => {
  try {
    const count = await commentService.getCommentCountByPostId(req.params.postId);
    res.status(200).json({ count });
  } catch (err) {
    console.error("Count fetch failed:", err);
    res.status(500).json({ error: 'Failed to fetch comment count' });
  }
});


// Auth middleware for write operations
router.use(authenticateJWT);
router.use(csrfProtection);

// Create a comment
router.post('/', async (req, res) => {
  const { post_id, user_id, content } = req.body;

  if (!content || typeof content !== 'string' || content.trim() === '') {
    return res.status(400).json({ error: 'Comment text is required' });
  }

  try {
    const commentId = await commentService.createComment({ post_id, user_id, content });
    res.status(201).json({ message: 'Comment added', commentId });
  } catch (err) {
    console.error('Add comment failed:', err.message);
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

// Delete comment
router.delete('/:commentId', async (req, res) => {
  const commentId = req.params.commentId;
  const userId = req.user?.id;

  try {
    const deleted = await commentService.deleteComment(commentId, userId);
    if (deleted === 0) return res.status(403).json({ error: 'Unauthorized or comment not found' });
    res.status(200).json({ message: 'Comment deleted' });
  } catch (err) {
    console.error('Error deleting comment:', err);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});

module.exports = router;
