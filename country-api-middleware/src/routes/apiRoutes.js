const express = require('express');
const { getCountries, getCountry } = require('../controllers/apiController');
const checkApiKey = require('../middleware/checkApiKey');

const router = express.Router();

router.get('/countries', getCountries);
router.get('/country', getCountry); 

module.exports = router;
