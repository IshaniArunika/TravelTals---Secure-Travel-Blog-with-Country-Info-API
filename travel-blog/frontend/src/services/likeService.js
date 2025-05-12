import axios from 'axios';

// Helper to read cookies
function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
}

const BASE_URL = `${process.env.REACT_APP_API_BASE_URL}/like`;

// Get like/dislike counts and userReaction
export const fetchLikeCounts = async (postId) => {
  const res = await axios.get(`${BASE_URL}/${postId}`, {
    withCredentials: true, // to send JWT cookie
  });
  return res.data; // { likes, dislikes, userReaction }
};

// Like or dislike a post
export const likePost = async (postId, type) => {
  const csrfToken = getCookie('csrf-token');
  if (!csrfToken) throw new Error('Missing CSRF token');

  const res = await axios.post(
    `${BASE_URL}/${postId}`,
    { type },
    {
      headers: { 'x-csrf-token': csrfToken },
      withCredentials: true
    }
  );
  return res.data;
};
