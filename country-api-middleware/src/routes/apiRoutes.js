const express = require('express');
const {getCountries} = require('../controllers/apiController');

const router = express.Router();

router.get('/countries',getCountries)

module.exports = router;