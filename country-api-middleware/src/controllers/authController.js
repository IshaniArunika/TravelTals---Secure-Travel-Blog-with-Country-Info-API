const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { validationResult } = require('express-validator');

exports.register = async (req, res) => {
    const { username, email, password } = req.body;

    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // Hash password before storing it
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user in database
        const newUser = await User.create(username, email, hashedPassword);

        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ error: 'Registration failed' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log("Attempting login for:", email);

        // Find user by email
        const user = await User.findByEmail(email);
        if (!user) {
            console.log("User not found:", email);
            return res.status(401).json({ error: "Invalid credentials" });
        }

        console.log("User found in DB:", user);
        console.log("Stored hashed password:", user.password);
        console.log("Entered password:", password);

        // Compare provided password with stored hash
        const isMatch = await bcrypt.compare(password, user.password);

        console.log("Password match result:", isMatch);

        if (!isMatch) {
            console.log("Password mismatch for user:", email);
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Check if JWT_SECRET is defined
        if (!process.env.JWT_SECRET) {
            console.error("Error: JWT_SECRET is not set in environment variables!");
            return res.status(500).json({ error: "Internal Server Error - JWT Secret Missing" });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        console.log("Login successful for:", email);
        res.json({ message: "Login successful", token });

    } catch (error) {
        console.error("Login Error:", error.message);
        res.status(500).json({ error: "Login failed" });
    }
};

