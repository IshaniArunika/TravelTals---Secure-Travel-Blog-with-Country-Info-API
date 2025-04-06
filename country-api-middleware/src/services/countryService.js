// const axios = require('axios');

// const getCountryData = async () => {
//     try {
//         const response = await axios.get('https://restcountries.com/v3.1/all');

        
//         const countryData = response.data.map(country => ({
//             name: country.name?.common || "N/A",
//             capital: country.capital?.[0] || "N/A",
//             currency: country.currencies 
//                 ? Object.values(country.currencies)[0]?.name || "N/A" 
//                 : "N/A",
//             languages: country.languages 
//                 ? Object.values(country.languages) 
//                 : ["N/A"],
//             flag: country.flags?.png || "N/A"
//         }));

//         return countryData;
//     } catch (error) {
//         console.error("Error fetching country data:", error.message);
//         throw new Error('Error fetching country data');
//     }
// };

 
// module.exports = { getCountryData };
const https = require('https');

const getCountryData = () => {
  return new Promise((resolve, reject) => {
    https.get('https://restcountries.com/v3.1/all', res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const countries = JSON.parse(data).map(country => ({
            name: country.name?.common || "N/A",
            capital: country.capital?.[0] || "N/A",
            currencies: Object.values(country.currencies || {}).map(c => c.name).join(', ') || "N/A",
            languages: Object.values(country.languages || {}).join(', ') || "N/A",
            flag: country.flags?.svg || country.flags?.png || "N/A"
          }));
          resolve(countries);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', err => {
      console.error("❌ HTTPS error:", err.message);
      reject(err);
    });
  });
};

module.exports = { getCountryData };
