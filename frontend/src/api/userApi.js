import axios from 'axios';

// Helper to read cookie
function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
}

export const fetchUsersWithUsage = async () => {
  try {
    const csrfToken = getCookie('csrf-token');

    if (!csrfToken) {
      throw new Error('Missing CSRF token');
    }

    const response = await axios.get('http://localhost:4000/users/with-usage', {
      headers: {
        'x-csrf-token': csrfToken
      },
      withCredentials: true
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching users with usage:', error.response?.data || error.message);
    throw error;
  }
};
