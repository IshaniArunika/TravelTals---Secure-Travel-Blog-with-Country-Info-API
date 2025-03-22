const authService = require('../services/authService');
const { validationResult } = require('express-validator');
const { generateCsrfToken } = require('../config/csrf');  // ✅ Import this function

exports.register = async (req, res) => {
    const { username, email, password } = req.body;

    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        //  Use authService for user registration
        const newUser = await authService.register(username, email, password);
        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ error: 'Registration failed' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log("Attempting login for:", email);

        // Authenticate user
        const authResult = await authService.authenticate(email, password);
       
         // Generate CSRF token
        const csrfToken = generateCsrfToken();
       
        if (!authResult) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const { token, user } = authResult;
        
        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 3600000 // 1 hour
        });

        res.cookie('csrf-token', csrfToken, {
            httpOnly: false, // Client-side accessible
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict'
        });

        //  Return JWT in response instead of setting a cookie
        res.json({ 
            message: "Login successful", 
            token, // Send token in response
            user: { id: user.id, email: user.email }
        });

    } catch (error) {
        res.status(500).json({ error: "Login failed" });
    }
};

 

