const express = require('express');
const { authenticateJWT } = require('../middleware/auth');
const { csrfProtection } = require('../middleware/csrf');
const UserService = require('../services/userService');

const router = express.Router();

// Apply middleware
router.use(authenticateJWT);
router.use(csrfProtection);

// // GET /user/profile
// router.get('/profile', async (req, res) => {
//     try {
//         const user = await UserService.getUserById(req.user.userId);
//         if (!user) return res.status(404).json({ error: 'User not found' });
//         res.json(user);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// // PUT /user/plan
// router.put('/plan', async (req, res) => {
//     const { plan } = req.body;

//     try {
//         const result = await UserService.updateUserPlan(req.user.userId, plan);
//         res.json({ message: `Plan updated to '${result.plan}'` });
//     } catch (err) {
//         res.status(400).json({ error: err.message });
//     }
// });

//Get all users with role 'user'
router.get('/role/user', async (req, res) => {
    try {
        const users = await UserService.getUsersByRole('user');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.get('/with-usage', async (req, res) => {
    try {
      const usersWithUsage = await UserService.getUsersWithUsageByRole('user');
      res.json(usersWithUsage);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});
  
 
module.exports = router;
