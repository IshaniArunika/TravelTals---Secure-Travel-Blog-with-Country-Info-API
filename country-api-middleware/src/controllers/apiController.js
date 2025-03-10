const {getCountryData} = require('../services/countryService');

exports.getCountries = async (req , res)=>{
    try{
        const countries = await getCountryData();
        res.json({countries});
    }catch (error) {
        console.error("Controller Error:", error.message);
        res.status(500).json({ error: 'Failed to fetch country names' });
    }
}