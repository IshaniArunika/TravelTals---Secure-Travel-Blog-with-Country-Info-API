import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/addPost.css';

const AddPost = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [country, setCountry] = useState('');
  const [date, setDate] = useState('');
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content || !country || !date || !image) {
      alert('Please fill all fields.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('country', country);
    formData.append('date', date);
    formData.append('image', image);

    try {
      await axios.post('http://localhost:5000/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });
      alert('Post added successfully!');
      navigate('/');
    } catch (error) {
      console.error(error);
      alert('Failed to add post.');
    }
  };

  return (
    <div className="add-post-container">
      <form className="add-post-card" onSubmit={handleSubmit}>
        <h2>Add New Post</h2>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <input
          type="text"
          placeholder="Country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <button type="submit">Post</button>
      </form>

      {/* Centered Back Button */}
      <div className="back-btn-wrapper">
        <button className="back-btn" onClick={() => navigate('/')}>← Back to Home</button>
      </div>
    </div>
  );
};

export default AddPost;
