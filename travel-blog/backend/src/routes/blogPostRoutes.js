const express = require('express');
const router = express.Router();
const blogPostService = require('../services/blogPostService');
const upload = require('../middleware/upload');
const { authenticateJWT } = require('../middleware/auth');
const { csrfProtection } = require('../middleware/csrf');

// Public: Search posts
router.get('/search', async (req, res) => {
  const { country, username, page = 1, limit = 10 } = req.query;
  try {
    const posts = await blogPostService.searchPosts(
      { country, username },
      parseInt(page),
      parseInt(limit)
    );
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to search posts' });
  }
});

// Public: Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await blogPostService.getAllPosts();
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve posts' });
  }
});

// Public: Get post by ID
router.get('/:id', async (req, res) => {
  try {
    const post = await blogPostService.getPostById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve post' });
  }
});

// Auth middleware (JWT + CSRF)
router.use(authenticateJWT);
router.use(csrfProtection);

// Create post
router.post('/', upload.single('image'), async (req, res) => {
  const postData = req.body;
  if (!req.user || !req.user.id)
    return res.status(401).json({ error: 'User not authenticated' });

  postData.user_id = req.user.id;
  if (req.file) postData.image_url = `/uploads/${req.file.filename}`;

  try {
    const postId = await blogPostService.createPost(postData);
    res.status(201).json({ message: 'Post created', postId });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// Update post
router.put('/:id', upload.single('image'), async (req, res) => {
  const postId = req.params.id;
  const postData = req.body;

  try {
    const existingPost = await blogPostService.getPostById(postId);
    if (!existingPost) return res.status(404).json({ error: 'Post not found' });

    if (parseInt(existingPost.user_id) !== parseInt(req.user.id))
      return res.status(403).json({ error: 'Unauthorized' });

    if (req.file) postData.image_url = `/uploads/${req.file.filename}`;

    const changes = await blogPostService.updatePost(postId, postData);
    res.status(200).json({ message: 'Post updated', changes });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update post' });
  }
});

// Delete post
router.delete('/:id', async (req, res) => {
  const postId = req.params.id;

  try {
    const existingPost = await blogPostService.getPostById(postId);
    if (!existingPost) return res.status(404).json({ error: 'Post not found' });

    if (parseInt(existingPost.user_id) !== parseInt(req.user.id))
      return res.status(403).json({ error: 'Unauthorized' });

    const deleted = await blogPostService.deletePost(postId);
    if (deleted === 0)
      return res.status(404).json({ error: 'No post deleted' });

    res.status(200).json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

module.exports = router;
