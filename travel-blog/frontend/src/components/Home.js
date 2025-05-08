import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllPosts } from '../services/postService';
import Post from './Post';
import bgImage from '../assets/background.png';
import { IoIosAddCircle } from 'react-icons/io';
import '../styles/home.css';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [filterCountry, setFilterCountry] = useState('');
  const [filterUser, setFilterUser] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getAllPosts()
      .then(data => setPosts(data))
      .catch(err => console.error('Error loading posts:', err));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowFilter(window.scrollY > window.innerHeight * 0.7);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredPosts = posts.filter(post => {
    const matchesCountry = post.country.toLowerCase().includes(filterCountry.toLowerCase());
    const matchesUser = post.username.toLowerCase().includes(filterUser.toLowerCase());
    return matchesCountry && matchesUser;
  });

  return (
    <div className="home">
      <section className="hero" style={{ backgroundImage: `url(${bgImage})` }}>
        <div className="hero-content">
          <h1>Welcome to TravelJoy</h1>
          <p>Discover. Share. Inspire.</p>
        </div>
      </section>

      {showFilter && (
        <section className="filter-bar">
          <input
            type="text"
            placeholder="Filter by country"
            value={filterCountry}
            onChange={(e) => setFilterCountry(e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by username"
            value={filterUser}
            onChange={(e) => setFilterUser(e.target.value)}
          />
          <button className="filter-btn">Filter</button>
        </section>
      )}

      <section className="posts-section">
        {filteredPosts.map(post => (
          <Post key={post.id} post={post} />
        ))}
      </section>

      <div className="add-post-button-wrapper">
        <button className="filter-btn" onClick={() => navigate('/add-post')}>Add Post</button>
      </div>

      <div className="add-icon" onClick={() => navigate('/add-post')}>
        <IoIosAddCircle size={40} />
      </div>
    </div>
  );
};

export default Home;
