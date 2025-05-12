import React, { useEffect, useState } from 'react';
import '../styles/home.css';
import Post from './Post';
import bgImage from '../assets/background.png';
import { IoIosAddCircle, IoMdHome } from 'react-icons/io';
import { FaUserFriends } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { getAllPosts, searchPosts } from '../services/postService';
import { fetchLikeCounts } from '../services/likeService';
import { isFollowingUser } from '../services/followService';
import CountrySelect from './CountrySelect';

const Home = ({ allCountries }) => {
  const [allPosts, setAllPosts] = useState([]);
  const [displayPosts, setDisplayPosts] = useState([]);
  const [tempCountry, setTempCountry] = useState('');
  const [tempUser, setTempUser] = useState('');
  const [view, setView] = useState('all');
  const [sortType, setSortType] = useState('popular');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const data = await getAllPosts();
        const enriched = await Promise.all(
          data.map(async post => {
            const { likes = 0 } = await fetchLikeCounts(post.id);
            return { ...post, likes };
          })
        );
        setAllPosts(enriched);
        setDisplayPosts(applySort(enriched, sortType));
      } catch (err) {
        console.error('Failed to load posts:', err);
      }
    };
    fetchInitial();
  }, []);

  const applySort = (posts, sortType) => {
    const sorted = [...posts];
    if (sortType === 'popular') {
      sorted.sort((a, b) => b.likes - a.likes || new Date(b.created_at) - new Date(a.created_at));
    } else {
      sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
    return sorted;
  };

  const handleAllPosts = () => {
    setView('all');
    setTempCountry('');
    setTempUser('');
    setDisplayPosts(applySort(allPosts, sortType));
    setCurrentPage(1);
  };

  const handleFollowingFeed = async () => {
    if (!currentUser) return;
    const followedPosts = [];
    for (let post of allPosts) {
      if (post.user_id === currentUser.id) continue;
      const followed = await isFollowingUser(post.user_id);
      if (followed) followedPosts.push(post);
    }
    setView('following');
    setTempCountry('');
    setTempUser('');
    setDisplayPosts(applySort(followedPosts, sortType));
    setCurrentPage(1);
  };

  const handleFilter = async () => {
    try {
      const response = await searchPosts({ username: tempUser, country: tempCountry });
      const result = Array.isArray(response) ? response : response.posts;
      const enriched = await Promise.all(
        result.map(async (post) => {
          const { likes = 0 } = await fetchLikeCounts(post.id);
          return { ...post, likes };
        })
      );
      setDisplayPosts(applySort(enriched, sortType));
      setCurrentPage(1);
    } catch (err) {
      console.error('Failed to filter posts:', err);
    }
  };

  const handleClear = () => {
    setTempCountry('');
    setTempUser('');
    setDisplayPosts(applySort(allPosts, sortType));
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    const newSort = e.target.value;
    setSortType(newSort);
    setDisplayPosts(applySort(displayPosts, newSort));
  };

  const start = (currentPage - 1) * postsPerPage;
  const currentItems = displayPosts.slice(start, start + postsPerPage);
  const totalPages = Math.ceil(displayPosts.length / postsPerPage);

  return (
    <div className="home">
      <section className="hero" style={{ backgroundImage: `url(${bgImage})` }}>
        <div className="hero-content">
          <h1>Welcome to TravelTales</h1>
          <p>Discover. Share. Inspire.</p>
        </div>
      </section>

      <div className="filter-section">
        <div className="view-toggle-bar">
          <button className={`view-btn ${view === 'all' ? 'active' : ''}`} onClick={handleAllPosts}>
            <IoMdHome /> All Posts
          </button>
          <button className={`view-btn ${view === 'following' ? 'active' : ''}`} onClick={handleFollowingFeed}>
            <FaUserFriends /> Following Feed
          </button>
          <select className="sort-dropdown" value={sortType} onChange={handleSortChange}>
            <option value="popular">Most Liked</option>
            <option value="newest">Newest</option>
          </select>
        </div>

        <section className="filter-bar">
          <CountrySelect
            value={tempCountry}
            onChange={setTempCountry}
            countryList={allCountries.map(c => c.name)}
          />
          <input
            type="text"
            placeholder="Filter by username"
            value={tempUser}
            onChange={(e) => setTempUser(e.target.value)}
          />
          <button className="filter-btn" onClick={handleFilter}>Filter</button>
          <button className="filter-btn" onClick={handleClear}>Clear</button>
        </section>
      </div>

      <section className="posts-section">
        {currentItems.map(post => (
          <Post key={post.id} post={post} allCountries={allCountries} />
        ))}

        {totalPages > 1 && (
          <div className="pagination">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
            <span>Page {currentPage} of {totalPages}</span>
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
          </div>
        )}
      </section>

      <div className="add-icon" onClick={() => navigate('/add-post')}>
        <IoIosAddCircle size={40} />
      </div>
    </div>
  );
};

export default Home;
