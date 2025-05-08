import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/home.css';
import Post from './Post';
import bgImage from '../assets/background.png';
import { IoIosAddCircle } from 'react-icons/io';

const allPosts = [
  {
    id: 1,
    title: 'Journey through Kyoto',
    country: 'Japan',
    flag: '🇯🇵',
    username: 'traveler_joe',
    date: '2025-05-04',
    image: bgImage,
    content: 'Kyoto’s temples were magical!',
    likes: 18,
    dislikes: 2
  },
  {
    id: 2,
    title: 'Eiffel Adventure',
    country: 'France',
    flag: '🇫🇷',
    username: 'claireParis',
    date: '2025-05-02',
    image: bgImage,
    content: 'Paris is a city of dreams!',
    likes: 25,
    dislikes: 1
  }
];

const Home = () => {
  const [filterCountry, setFilterCountry] = useState('');
  const [filterUser, setFilterUser] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setShowFilter(window.scrollY > window.innerHeight * 0.7);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredPosts = allPosts.filter(post => {
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

      {/* Add Post Button (desktop) */}
      <div className="add-post-button-wrapper">
        <button className="filter-btn" onClick={() => navigate('/add-post')}>Add Post</button>
      </div>

      {/* Floating Add Icon (mobile/fixed) */}
      <div className="add-icon" onClick={() => navigate('/add-post')}>
        <IoIosAddCircle size={40} />
      </div>
    </div>
  );
};

export default Home;
