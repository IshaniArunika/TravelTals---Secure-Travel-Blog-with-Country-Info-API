import axios from 'axios';

const BASE_URL = `${process.env.REACT_APP_API_BASE_URL}/comments`;

// Helper to read cookies
function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
}

 
export const addComment = async ({ post_id, user_id, content }) => {
  const csrfToken = getCookie('csrf-token');
  if (!csrfToken) throw new Error('Missing CSRF token');

  const res = await axios.post(
    `${BASE_URL}`,
    { post_id, user_id, content },
    {
      headers: {
        'x-csrf-token': csrfToken
      },
      withCredentials: true // include JWT in cookie
    }
  );
  return res.data;
};

 
export const getCommentsByPostId = async (postId) => {
  const res = await axios.get(`${BASE_URL}/post/${postId}`, {
    withCredentials: true // include JWT in cookie
  });
  return res.data;
};


export const getCommentCountByPostId = async (postId) => {
  const res = await axios.get(`${BASE_URL}/count/${postId}`, {
    withCredentials: true
  });
  return res.data; // expects { count: number }
};