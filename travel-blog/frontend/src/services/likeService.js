import axios from 'axios';

// Helper to read cookies
function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
}

//   Get like/dislike counts and userReaction
export const fetchLikeCounts = async (postId) => {
  const res = await axios.get(`http://localhost:5000/like/${postId}`, {
    withCredentials: true, // to send JWT cookie
  });
  return res.data; // { likes, dislikes, userReaction }
};

//  Toggle like/dislike
export const likePost = async (postId, type) => {
  const csrfToken = getCookie('csrf-token');
  if (!csrfToken) throw new Error('Missing CSRF token');

  const res = await axios.post(
    `http://localhost:5000/like/${postId}`,
    { type },
    {
      headers: {
        'x-csrf-token': csrfToken,
      },
      withCredentials: true,
    }
  );
  return res.data;
};
