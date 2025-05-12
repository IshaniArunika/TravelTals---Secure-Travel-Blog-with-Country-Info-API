import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  createPost,
  getPostById,
  updatePost
} from '../services/postService';
import CountrySelect from './CountrySelect'; // same as Home.js
import '../styles/addPost.css';

const AddPost = ({ allCountries }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [country, setCountry] = useState('');
  const [date, setDate] = useState('');
  const [image, setImage] = useState(null);
  const [existingImage, setExistingImage] = useState('');
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      getPostById(id)
        .then(data => {
          setTitle(data.title);
          setContent(data.content);
          setCountry(data.country);
          setDate(data.date_of_visit);
          setExistingImage(data.image_url);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error loading post:', err);
          alert('Failed to load post data.');
          navigate('/');
        });
    }
  }, [id, isEdit, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content || !country || !date) {
      alert('Please fill all required fields.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('country', country);
    formData.append('date_of_visit', date);
    if (image) {
      formData.append('image', image);
    }

    try {
      if (isEdit) {
        await updatePost(id, formData);
        alert('Post updated!');
      } else {
        await createPost(formData);
        alert('Post created!');
      }
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Failed to submit post.');
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px' }}>Loading post...</div>;
  }

  return (
    <div className="add-post-container">
      <form className="add-post-card" onSubmit={handleSubmit}>
        <h2>{isEdit ? 'Edit Post' : 'Add New Post'}</h2>
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

        {/* ✅ Use CountrySelect like in Home.js */}
        <CountrySelect
          value={country}
          onChange={setCountry}
          countryList={allCountries.map(c => c.name)}
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

        {isEdit && existingImage && (
          <img
            src={`http://localhost:5000${existingImage}`}
            alt="Current Post"
            className="preview-img"
          />
        )}

        <button type="submit">{isEdit ? 'Update' : 'Post'}</button>
      </form>

      <div className="back-btn-wrapper">
        <button className="back-btn" onClick={() => navigate('/')}>← Back to Home</button>
      </div>
    </div>
  );
};

export default AddPost;
