const express = require('express');
const router = express.Router();
const checkApiKey = require('../middleware/checkApiKey');
const apiService = require('../services/apiService');
const usageService = require('../services/usageService');

// GET /api/country?name=...
router.get('/country', checkApiKey, async (req, res) => {
  const name = req.query.name;

  if (!name) {
    return res.status(400).json({ error: 'Country name is required' });
  }

  try {
    const country = await apiService.getCountryByName(name);

    // Get current usage info for the logged-in user
    const usage = await usageService.getUsageSummary(req.user.userId);

    //  Respond with both country and usage in one call
    res.json({ country, usage });
  } catch (err) {
    console.error('Error in /api/country:', err.message);
    res.status(500).json({ error: 'Failed to fetch country details or usage' });
  }
});

module.exports = router;
