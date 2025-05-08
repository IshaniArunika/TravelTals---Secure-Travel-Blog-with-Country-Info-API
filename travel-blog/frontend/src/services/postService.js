import axios from 'axios';

const BASE_URL = 'http://localhost:5000/blog';

// Helper to get CSRF token from cookie
function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
}

//  Get all posts
export const getAllPosts = async () => {
  const res = await axios.get(BASE_URL);
  return res.data;
};

//  Search posts
export const searchPosts = async ({ username, country, page = 1, limit = 10 }) => {
  const res = await axios.get(`${BASE_URL}/search`, {
    params: { username, country, page, limit }
  });
  return res.data;
};

//  Get post by ID
export const getPostById = async (id) => {
  const res = await axios.get(`${BASE_URL}/${id}`);
  return res.data;
};
//  Create a post (multipart/form-data)
export const createPost = async (formData) => {
    const csrfToken = getCookie('csrf-token');
    if (!csrfToken) throw new Error('Missing CSRF token');
  
    const res = await axios.post('http://localhost:5000/blog', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'x-csrf-token': csrfToken,
      },
      withCredentials: true,
    });
    return res.data;
  };

// 5 Update a post
export const updatePost = async (postId, formData) => {
    const csrfToken = getCookie('csrf-token');
    if (!csrfToken) throw new Error('Missing CSRF token');
  
    const res = await axios.put(`http://localhost:5000/blog/${postId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'x-csrf-token': csrfToken
      },
      withCredentials: true
    });
    return res.data;
  };

//  Delete a post
export const deletePost = async (postId) => {
  const csrfToken = getCookie('csrf-token');
  if (!csrfToken) throw new Error('Missing CSRF token');

  const res = await axios.delete(`${BASE_URL}/${postId}`, {
    headers: {
      'x-csrf-token': csrfToken
    },
    withCredentials: true
  });
  return res.data;
};
