const axios = require('axios');

const getCountryData = async () => {
    try {
        const response = await axios.get('https://restcountries.com/v3.1/all');

        
        const countryData = response.data.map(country => ({
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

        return countryData;
    } catch (error) {
        console.error("Error fetching country data:", error.message);
        throw new Error('Error fetching country data');
    }
};

const getCountryByName = async (name) => {
    try {
        const response = await axios.get(`https://restcountries.com/v3.1/name/${encodeURIComponent(name)}`);
        const country = response.data[0]; // First match

        return {
            name: country.name?.common || "N/A",
            capital: country.capital?.[0] || "N/A",
            currency: country.currencies 
                ? Object.values(country.currencies)[0]?.name || "N/A" 
                : "N/A",
            languages: country.languages 
                ? Object.values(country.languages) 
                : ["N/A"],
            flag: country.flags?.png || "N/A"
        };
    } catch (error) {
        console.error("Error fetching country by name:", error.message);
        throw new Error('Error fetching country by name');
    }
};

module.exports = { getCountryData, getCountryByName }; 
 
