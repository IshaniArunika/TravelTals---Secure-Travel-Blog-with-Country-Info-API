import axios from 'axios';

// export const fetchCountries = async (countryName) => {
//   try {
//     const response = await axios.post('http://localhost:4000/api/countries', {
//       country: countryName,
//     });
//     return response.data;
//   } catch (error) {
//     console.log('Error fetching country details:', error);
//     throw error;
//   }
// };


export const fetchCountryDetails = async (countryName) => {
  try {
    // Get the API key from localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    const apiKey = user?.api_key;

    if (!apiKey) {
      throw new Error('API key not found in user data');
    }

    // Send request with API key in headers
    const response = await axios.get(
      `http://localhost:4000/api/country?name=${encodeURIComponent(countryName)}`,
      {
        headers: {
          'x-api-key': apiKey,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.log('Error fetching country details:', error.response?.data || error.message);
    throw error;
  }
};


export const fetchApiUsage = async () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const apiKey = user?.api_key;

    if (!apiKey) {
      throw new Error('API key not found in user data');
    }
     
    const response = await axios.get('http://localhost:4000/api/usage', {
      headers: {
        'x-api-key': apiKey,
      },
    });

    console.log("get usage data ",response.data)
    return response.data; 
  } catch (error) {
    console.log('Error fetching API usage:', error.response?.data || error.message);
    throw error;
  }
};

