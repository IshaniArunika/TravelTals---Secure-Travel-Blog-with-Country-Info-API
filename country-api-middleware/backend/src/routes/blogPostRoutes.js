const express = require('express');
const router = express.Router();
const blogPostService = require('../services/blogPostService');
const upload = require('../middleware/upload');
const { authenticateJWT } = require('../middleware/auth');
const { csrfProtection } = require('../middleware/csrf');

router.get('/search', (req, res) => {
  const { country, username, page = 1, limit = 10 } = req.query;

  blogPostService.searchPosts(
    { country, username },
    parseInt(page),
    parseInt(limit),
    (err, posts) => {
      if (err) return res.status(500).json({ error: 'Failed to search posts' });
      res.status(200).json(posts);
    }
  );
});

router.get('/', (req, res) => {
  blogPostService.getAllPosts((err, posts) => {
    if (err) return res.status(500).json({ error: 'Failed to retrieve posts' });
    res.status(200).json(posts);
  });
});

router.get('/:id', (req, res) => {
  blogPostService.getPostById(req.params.id, (err, post) => {
    if (err) return res.status(500).json({ error: 'Failed to retrieve post' });
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.status(200).json(post);
  });
});

router.use(authenticateJWT);
router.use(csrfProtection);

router.post('/', upload.single('image'), (req, res) => {
  const postData = req.body;
  if (!req.user || !req.user.id) return res.status(401).json({ error: 'User not authenticated' });
  postData.user_id = req.user.id;
  if (req.file) postData.image_url = `/uploads/${req.file.filename}`;

  blogPostService.createPost(postData, (err, postId) => {
    if (err) return res.status(500).json({ error: 'Failed to create post' });
    res.status(201).json({ message: 'Post created', postId });
  });
});

router.put('/:id', upload.single('image'), (req, res) => {
  const postId = req.params.id;
  const postData = req.body;

  blogPostService.getPostById(postId, (err, existingPost) => {
    if (err || !existingPost) return res.status(404).json({ error: 'Post not found' });
    if (existingPost.user_id !== req.user.id) return res.status(403).json({ error: 'Unauthorized' });

    if (req.file) postData.image_url = `/uploads/${req.file.filename}`;

    blogPostService.updatePost(postId, postData, (err, changes) => {
      if (err) return res.status(500).json({ error: 'Failed to update post' });
      res.status(200).json({ message: 'Post updated' });
    });
  });
});

router.delete('/:id', (req, res) => {
  const postId = req.params.id;

  blogPostService.getPostById(postId, (err, existingPost) => {
    if (err || !existingPost) return res.status(404).json({ error: 'Post not found' });
    if (existingPost.user_id !== req.user.id) return res.status(403).json({ error: 'Unauthorized' });

    blogPostService.deletePost(postId, (err, changes) => {
      if (err) return res.status(500).json({ error: 'Failed to delete post' });
      res.status(200).json({ message: 'Post deleted' });
    });
  });
});

module.exports = router;
