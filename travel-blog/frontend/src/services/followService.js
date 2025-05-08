import axios from 'axios';

// Get CSRF token from cookies
function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
}

const BASE_URL = 'http://localhost:5000/follow';

// Follow a user
export const followUser = async (userId) => {
  const csrfToken = getCookie('csrf-token');
  if (!csrfToken) throw new Error('Missing CSRF token');

  const res = await axios.post(`${BASE_URL}/${userId}`, {}, {
    headers: {
      'x-csrf-token': csrfToken
    },
    withCredentials: true
  });

  return res.data;
};

// Unfollow a user
export const unfollowUser = async (userId) => {
  const csrfToken = getCookie('csrf-token');
  if (!csrfToken) throw new Error('Missing CSRF token');

  const res = await axios.delete(`${BASE_URL}/${userId}`, {
    headers: {
      'x-csrf-token': csrfToken
    },
    withCredentials: true
  });

  return res.data;
};

// Check if current user is following target user
export const isFollowingUser = async (targetUserId) => {
    const csrfToken = getCookie('csrf-token');
    if (!csrfToken) throw new Error('Missing CSRF token');
  
    const currentUser = JSON.parse(localStorage.getItem('user'));
    if (!currentUser) throw new Error('User not logged in');
  
    const res = await axios.get(`http://localhost:5000/follow/following/${currentUser.id}`, {
      headers: {
        'x-csrf-token': csrfToken
      },
      withCredentials: true
    });
  
    return res.data.following.some(user => user.id === targetUserId);
  };
  
  export const getFollowers = async (userId) => {
    const csrfToken = getCookie('csrf-token');
    if (!csrfToken) throw new Error('Missing CSRF token');
  
    const res = await axios.get(`${BASE_URL}/followers/${userId}`, {
      headers: { 'x-csrf-token': csrfToken },
      withCredentials: true
    });
  
    return res.data.followers;
  };
  
  // GET all users that current user is following
  export const getFollowing = async (userId) => {
    const csrfToken = getCookie('csrf-token');
    if (!csrfToken) throw new Error('Missing CSRF token');
  
    const res = await axios.get(`${BASE_URL}/following/${userId}`, {
      headers: { 'x-csrf-token': csrfToken },
      withCredentials: true
    });
  
    return res.data.following;
  }
