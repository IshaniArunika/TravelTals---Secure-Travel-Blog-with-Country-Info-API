const express = require('express');
const { authenticateJWT } = require('../middleware/auth');
const { csrfProtection } = require('../middleware/csrf');
const router = express.Router();

// Apply JWT and CSRF protection middleware
router.use(authenticateJWT);
router.use(csrfProtection);

// Example protected route
router.put('/profile', (req, res) => {
    res.json({ message: "Profile updated successfully" });
});

module.exports = router;
