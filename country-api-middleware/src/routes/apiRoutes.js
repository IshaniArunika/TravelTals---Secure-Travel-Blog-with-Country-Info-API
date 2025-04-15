const express = require('express');
const apiService = require('../services/apiService');
const checkApiKey = require('../middleware/checkApiKey');

const router = express.Router();

// Apply API key middleware to all routes
router.use(checkApiKey);

// GET /api/countries
router.get('/countries', async (req, res) => {
    try {
        const countries = await apiService.getAllCountries();
        res.json({ countries });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/country?name=...
router.get('/country', async (req, res) => {
    const name = req.query.name;
    if (!name) return res.status(400).json({ error: 'Country name is required' });

    try {
        const country = await apiService.getCountryByName(name);
        res.json({ country });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
