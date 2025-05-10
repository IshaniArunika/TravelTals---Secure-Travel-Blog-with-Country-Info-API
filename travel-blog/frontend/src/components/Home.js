import React, { useEffect, useState } from 'react';
import '../styles/home.css';
import Post from './Post';
import bgImage from '../assets/background.png';
import { IoIosAddCircle } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { getAllPosts, searchPosts } from '../services/postService';
import { isFollowingUser } from '../services/followService';
import { fetchLikeCounts } from '../services/likeService';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [followedUsers, setFollowedUsers] = useState({});
  const [filterCountry, setFilterCountry] = useState('');
  const [filterUser, setFilterUser] = useState('');
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const handleScroll = () => {
      setShowFilter(window.scrollY > window.innerHeight * 0.7);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const loadAllPosts = async () => {
    const data = await getAllPosts();
    return await enrichPosts(data);
  };

  const enrichPosts = async (data) => {
    const postsWithLikes = await Promise.all(
      data.map(async (post) => {
        const { likes = 0 } = await fetchLikeCounts(post.id);
        return { ...post, likes };
      })
    );
    return postsWithLikes.sort((a, b) => b.likes - a.likes);
  };

  const loadFollowStatus = async (data) => {
    if (!currentUser) return {};
    const userMap = {};
    const uniqueUserIds = [...new Set(data.map(p => p.user_id))].filter(id => id !== currentUser.id);
    for (const uid of uniqueUserIds) {
      const isFollowed = await isFollowingUser(uid);
      userMap[uid] = isFollowed;
    }
    return userMap;
  };

  const handleFilter = async () => {
    try {
      const filtered = await searchPosts({
        username: filterUser,
        country: filterCountry
      });
      const enriched = await enrichPosts(filtered);
      setPosts(enriched);
      const map = await loadFollowStatus(enriched);
      setFollowedUsers(map);
      setFiltersApplied(true);
    } catch (err) {
      console.error('Failed to filter posts:', err);
    }
  };

  const handleClear = async () => {
    setFilterCountry('');
    setFilterUser('');
    setFiltersApplied(false);
    const all = await loadAllPosts();
    setPosts(all);
    const map = await loadFollowStatus(all);
    setFollowedUsers(map);
  };

  useEffect(() => {
    (async () => {
      const all = await loadAllPosts();
      setPosts(all);
      const map = await loadFollowStatus(all);
      setFollowedUsers(map);
    })();
  }, []);

  const handleFollowToggle = (userId, status) => {
    setFollowedUsers(prev => ({ ...prev, [userId]: status }));
  };

  return (
    <div className="home">
      <section className="hero" style={{ backgroundImage: `url(${bgImage})` }}>
        <div className="hero-content">
          <h1>Welcome to TravelTales</h1>
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
          {!filtersApplied && (
            <button className="filter-btn" onClick={handleFilter}>Filter</button>
          )}
          {filtersApplied && (
            <button className="filter-btn" onClick={handleClear}>Clear Filters</button>
          )}
        </section>
      )}

      <section className="posts-section">
        {posts.map(post => (
          <Post
            key={post.id}
            post={post}
            isFollowing={!!followedUsers[post.user_id]}
            onFollowToggle={handleFollowToggle}
          />
        ))}
      </section>

       

      <div className="add-icon" onClick={() => navigate('/add-post')}>
        <IoIosAddCircle size={40} />
      </div>
    </div>
  );
};

export default Home;
