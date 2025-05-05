const express = require('express');
const router = express.Router();
const blogPostService = require('../services/blogPostService');
const upload = require('../middleware/upload');
const { authenticateJWT } = require('../middleware/auth');
const { csrfProtection } = require('../middleware/csrf');

// Public route: search blog posts by country or username
router.get('/search', (req, res) => {
  const { country, username, page = 1, limit = 10 } = req.query;

  blogPostService.searchPosts(
    { country, username },
    parseInt(page),
    parseInt(limit),
    (err, posts) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to search posts' });
      }
      res.status(200).json(posts);
    }
  );
});

// Public route: get all posts
router.get('/', (req, res) => {
  blogPostService.getAllPosts((err, posts) => {
    if (err) {
      res.status(500).json({ error: 'Failed to retrieve posts' });
    } else {
      res.status(200).json(posts);
    }
  });
});

// Public route: get a specific post by ID
router.get('/:id', (req, res) => {
  const postId = req.params.id;
  blogPostService.getPostById(postId, (err, post) => {
    if (err) {
      res.status(500).json({ error: 'Failed to retrieve post' });
    } else if (!post) {
      res.status(404).json({ error: 'Post not found' });
    } else {
      res.status(200).json(post);
    }
  });
});

// Protected routes below
router.use(authenticateJWT);
router.use(csrfProtection);

// Create a new blog post
router.post('/', upload.single('image'), (req, res) => {
  const postData = req.body;

  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  postData.user_id = req.user.id;

  if (req.file) {
    postData.image_url = `/uploads/${req.file.filename}`;
  }

  blogPostService.createPost(postData, (err, postId) => {
    if (err) {
      res.status(500).json({ error: 'Failed to create post' });
    } else {
      res.status(201).json({ message: 'Post created', postId });
    }
  });
});

// Update a blog post (only if user owns the post)
router.put('/:id', upload.single('image'), (req, res) => {
  const postId = req.params.id;
  const postData = req.body;

  blogPostService.getPostById(postId, (err, existingPost) => {
    if (err || !existingPost) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (existingPost.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized to update this post' });
    }

    if (req.file) {
      postData.image_url = `/uploads/${req.file.filename}`;
    }

    blogPostService.updatePost(postId, postData, (err, changes) => {
      if (err) {
        res.status(500).json({ error: 'Failed to update post' });
      } else {
        res.status(200).json({ message: 'Post updated' });
      }
    });
  });
});

// Delete a blog post (only if user owns the post)
router.delete('/:id', (req, res) => {
  const postId = req.params.id;

  blogPostService.getPostById(postId, (err, existingPost) => {
    if (err || !existingPost) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (existingPost.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized to delete this post' });
    }

    blogPostService.deletePost(postId, (err, changes) => {
      if (err) {
        res.status(500).json({ error: 'Failed to delete post' });
      } else {
        res.status(200).json({ message: 'Post deleted' });
      }
    });
  });
});

module.exports = router;
