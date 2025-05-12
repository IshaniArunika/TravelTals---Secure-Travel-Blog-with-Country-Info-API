import axios from 'axios';

const BASE_URL = 'http://localhost:49100/api';
const LOGIN_URL = 'http://localhost:49100/auth/login';

let csrfToken = null;
let apiKey = null;
let jwtToken = null;

// Log in and store API key, CSRF, and JWT manually
export const loginToMiddleware = async () => {
  try {
    const res = await axios.post(LOGIN_URL, {
      email: 'TravelTalse@traveltalse.com',
      password: 'travel123'
    });

    csrfToken = res.data.csrfToken;
    apiKey = res.data.apiKey;
    jwtToken = res.data.token;

    console.log('TravelTales logged in to Country API middleware');
  } catch (err) {
    console.error('Middleware login failed:', err.message);
  }
};

const getAuthHeaders = () => {
  if (!csrfToken || !apiKey || !jwtToken) {
    throw new Error('Country API not authenticated yet.');
  }

  return {
    'x-api-key': apiKey,
    'x-csrf-token': csrfToken,
    'Authorization': `Bearer ${jwtToken}`
  };
};

// Get all countries
export const getAllCountries = async () => {
  const headers = getAuthHeaders();
  const response = await axios.get(`${BASE_URL}/countries`, {
    headers,
    withCredentials: true
  });
  return response.data;
};

// Fetch a single country by name
export const getCountryByName = async (name) => {
  const headers = getAuthHeaders();
  const response = await axios.get(`${BASE_URL}/country`, {
    params: { name },
    headers,
    withCredentials: true
  });
  return response.data;
};