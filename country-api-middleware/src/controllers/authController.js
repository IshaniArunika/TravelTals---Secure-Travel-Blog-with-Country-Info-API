const authService = require('../services/authService');
const { validationResult } = require('express-validator');
    

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
        console.error("Login error:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      console.log("Attempting login for:", email);
      const authResult = await authService.authenticate(email, password);
  
      if (!authResult) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
  
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
      
       
      const responese = res.json({
          message: "Login successful",
          token: authResult.accessToken,
          csrfToken: authResult.csrfToken,
          apiKey: authResult.apiKey,
          user: {
            id: authResult.user.id,
            email: authResult.user.email,
            username: authResult.user.username
          }
        });
    
        return responese;
      
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: error.message  });
    }
  };
  


 

