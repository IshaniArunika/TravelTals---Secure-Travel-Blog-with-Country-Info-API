import axios from 'axios';

export const fetchCountryDetails = async (countryName) => {
  try {
    const response = await axios.post('http://localhost:4000/auth/register', {
      country: countryName,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching country details:', error);
    throw error;
  }
};
