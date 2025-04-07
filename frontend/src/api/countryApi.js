import axios from 'axios';

export const fetchCountries = async (countryName) => {
  try {
    const response = await axios.post('http://localhost:4000/api/countries', {
      country: countryName,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching country details:', error);
    throw error;
  }
};


export const fetchCountryDetails = async (countryName) => {
  try {
    const response = await axios.get(`http://localhost:4000/api/country?name=${encodeURIComponent(countryName)}`);
    return response.data.country; 
  } catch (error) {
    console.error('Error fetching country details:', error);
    throw error;
  }
};