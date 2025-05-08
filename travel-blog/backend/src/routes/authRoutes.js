const express = require('express');
const { body, validationResult } = require('express-validator');
const AuthService = require('../services/authService');
const UserService = require('../services/userService');

const router = express.Router();

// REGISTER
router.post('/register', [
    body('username').notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  
    try {
      const { username, email, password, role, plan } = req.body;
      const newUser = await UserService.createUser(username, email, password, role, plan);
  
      // Authenticate the newly registered user
      const authResult = await AuthService.authenticate(email, password);
      if (!authResult) return res.status(401).json({ error: "Authentication failed after registration" });
  
      // Set cookies for JWT and CSRF token
      res.cookie('jwt', authResult.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: 3600000 // 1 hour
      });
  
      res.cookie('csrf-token', authResult.csrfToken, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict'
      });
  
      res.status(201).json({
        message: 'User registered and logged in successfully',
        token: authResult.accessToken,
        csrfToken: authResult.csrfToken,
        apiKey: authResult.apiKey,
        user: authResult.user
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

// LOGIN
router.post('/login', [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const { email, password } = req.body;
        const authResult = await AuthService.authenticate(email, password);
        if (!authResult) return res.status(401).json({ error: "Invalid credentials" });

        res.cookie('jwt', authResult.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 3600000
        });

        res.cookie('csrf-token', authResult.csrfToken, {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict'
        });

        res.json({
            message: "Login successful",
            token: authResult.accessToken,
            csrfToken: authResult.csrfToken,
            apiKey: authResult.apiKey,
            user: authResult.user,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
