import axios from 'axios';

// Get cookie value by name
function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
}

export const fetchCountryDetails = async (countryName) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const apiKey = user?.api_key;
    const csrfToken = getCookie('csrf-token'); // from cookie

    if (!apiKey || !csrfToken) {
      throw new Error('Missing API key or CSRF token in cookies/localStorage');
    }

    const response = await axios.get(
      `http://localhost:4000/api/country?name=${encodeURIComponent(countryName)}`,
      {
        headers: {
          'x-api-key': apiKey,
          'x-csrf-token': csrfToken
        },
        withCredentials: true // Required for sending JWT cookie
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching country details:', error.response?.data || error.message);
    throw error;
  }
};

export const fetchApiUsage = async () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const apiKey = user?.api_key;
    const csrfToken = getCookie('csrf-token'); //  from cookie

    if (!apiKey || !csrfToken) {
      throw new Error('Missing API key or CSRF token in cookies/localStorage');
    }

    const response = await axios.get('http://localhost:4000/api/usage', {
      headers: {
        'x-api-key': apiKey,
        'x-csrf-token': csrfToken
      },
      withCredentials: true //Required for sending JWT cookie
    });

    console.log("get usage data ", response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching API usage:', error.response?.data || error.message);
    throw error;
  }
};
