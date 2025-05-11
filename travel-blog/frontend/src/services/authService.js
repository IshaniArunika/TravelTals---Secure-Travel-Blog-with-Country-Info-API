import axios from 'axios';

const BASE_URL = 'http://localhost:5000/auth';

export const registerUser = async ({ username, email, password }) => {
  const response = await axios.post(`${BASE_URL}/register`, {
    username,
    email,
    password,
  });
  return response.data;
};

export const loginUser = async ({ email, password }) => {
  const response = await axios.post(`${BASE_URL}/login`, {
    email,
    password,
  }, {
    withCredentials: true
  });
  return response.data;
};
