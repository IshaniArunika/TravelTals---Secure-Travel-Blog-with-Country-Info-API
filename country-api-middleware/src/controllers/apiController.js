const { getCountryData } = require('../services/countryService');
const path = require('path');
const fs = require('fs');

exports.getCountries = async (req, res) => {
    try {
        const countries = await getCountryData();
        res.json({ countries });
    } catch (error) {
        console.error("API Error:", error.message);

        
        try {
            const filePath = path.join(__dirname, '..', '..', 'countriesV3.1.json'); 
            const jsonData = fs.readFileSync(filePath, 'utf-8');
            const rawCountries = JSON.parse(jsonData);

            //  Transform data to match structure expected by frontend
            const countries = rawCountries.map(country => ({
                name: country.name?.common || "N/A",
                capital: country.capital?.[0] || "N/A",
                currency: country.currencies
                    ? Object.values(country.currencies)[0]?.name || "N/A"
                    : "N/A",
                languages: country.languages
                    ? Object.values(country.languages)
                    : ["N/A"],
                flag: country.flags?.png || "N/A"
            }));

            res.json({ countries });
        } catch (fileError) {
            console.error("Local JSON Error:", fileError.message);
            res.status(500).json({ error: 'Failed to fetch countries from both API and local file' });
        }
    }
};


exports.getCountry = async (req, res) => {
    const name = req.query.name;
    if (!name) {
        return res.status(400).json({ error: 'Country name is required' });
    }

    try {
        // 1. Try API via service
        const country = await getCountryByName(name);
        return res.json({ country });

    } catch (apiError) {
        console.warn("Falling back to local JSON:", apiError.message);

        try {
            // 2. Load from local file
            const filePath = path.join(__dirname, '..', '..', 'countriesV3.1.json');
            const jsonData = fs.readFileSync(filePath, 'utf-8');
            const allCountries = JSON.parse(jsonData);

            const match = allCountries.find(c =>
                c.name?.common?.toLowerCase() === name.toLowerCase()
            );

            if (!match) {
                return res.status(404).json({ error: 'Country not found in local data' });
            }

            const fallbackData = {
                name: match.name?.common || "N/A",
                capital: match.capital?.[0] || "N/A",
                currency: match.currencies
                    ? Object.values(match.currencies)[0]?.name || "N/A"
                    : "N/A",
                languages: match.languages
                    ? Object.values(match.languages)
                    : ["N/A"],
                flag: match.flags?.png || "N/A"
            };

            return res.json({ country: fallbackData });

        } catch (fileError) {
            console.error("Local file error:", fileError.message);
            return res.status(500).json({ error: 'Unable to get country data from API or file' });
        }
    }
};