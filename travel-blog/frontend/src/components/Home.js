import React, { useEffect, useState ,useCallback  } from 'react';
import '../styles/home.css';
import Post from './Post';
import bgImage from '../assets/background.png';
import { IoIosAddCircle, IoMdHome } from 'react-icons/io';
import { FaUserFriends } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { searchPosts } from '../services/postService';
import { isFollowingUser } from '../services/followService';
import { fetchLikeCounts } from '../services/likeService';
import CountrySelect from './CountrySelect';

const Home = ({ allCountries }) => {
  const [posts, setPosts] = useState([]);
  const [followedUsers, setFollowedUsers] = useState({});
  const [filterCountry, setFilterCountry] = useState('');
  const [filterUser, setFilterUser] = useState('');
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [totalPages, setTotalPages] = useState(1);
  const [view, setView] = useState('all');
  const [sortType, setSortType] = useState('popular'); // 'popular' | 'newest'
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('user'));


const fetchPosts = useCallback(async () => {
  const enrichPosts = async (data) => {
    const postsWithLikes = await Promise.all(
      data.map(async (post) => {
        const { likes = 0 } = await fetchLikeCounts(post.id);
        return { ...post, likes };
      })
    );

    let sorted = [...postsWithLikes];
    if (sortType === 'popular') {
      sorted.sort((a, b) => b.likes - a.likes || new Date(b.created_at) - new Date(a.created_at));
    } else if (sortType === 'newest') {
      sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    return sorted;
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

  try {
    const query = {
      username: filterUser,
      country: filterCountry,
      page,
      limit
    };
    const response = await searchPosts(query);
    let result = Array.isArray(response) ? response : response.posts;

    if (view === 'following' && currentUser) {
      const followingIds = Object.entries(await loadFollowStatus(result))
        .filter(([_, status]) => status)
        .map(([id]) => parseInt(id));
      result = result.filter(post => followingIds.includes(post.user_id));
    }

    const enriched = await enrichPosts(result);
    setPosts(enriched);
    setTotalPages(response.totalPages || 1);
    const map = await loadFollowStatus(enriched);
    setFollowedUsers(map);
  } catch (err) {
    console.error('Failed to fetch posts:', err);
  }
}, [filterUser, filterCountry, page, limit, view, sortType, currentUser]);



  const handleFilter = async () => {
    setPage(1);
    setFiltersApplied(true);
    await fetchPosts();
  };

  const handleClear = async () => {
    setFilterCountry('');
    setFilterUser('');
    setPage(1);
    setFiltersApplied(false);
    setView('all');
    window.location.href = '/';
  };

  const showAllPosts = () => {
    setView('all');
    setPage(1);
  };

  const showFollowingFeed = () => {
    setView('following');
    setPage(1);
  };

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

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

      <div className="filter-section" id="filter-section">
        <div className="view-toggle-bar">
          <button className={`view-btn ${view === 'all' ? 'active' : ''}`} onClick={showAllPosts}>
            <IoMdHome /> All Posts
          </button>
          <button className={`view-btn ${view === 'following' ? 'active' : ''}`} onClick={showFollowingFeed}>
            <FaUserFriends /> Following Feed
          </button>
          <select
            className="sort-dropdown"
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
          >
            <option value="popular">Most Liked</option>
            <option value="newest">Newest</option>
          </select>
        </div>
        <section className="filter-bar">
          <CountrySelect
            value={filterCountry}
            onChange={setFilterCountry}
            countryList={allCountries.map(c => c.name)}
          />
          <input
            type="text"
            placeholder="Filter by username"
            value={filterUser}
            onChange={(e) => setFilterUser(e.target.value)}
          />
          {!filtersApplied ? (
            <button className="filter-btn" onClick={handleFilter}>Filter</button>
          ) : (
            <button className="filter-btn" onClick={handleClear}>Clear Filters</button>
          )}
        </section>
      </div>

      <section className="posts-section">
        {posts.map(post => (
          <Post
            key={post.id}
            post={post}
            isFollowing={!!followedUsers[post.user_id]}
            onFollowToggle={handleFollowToggle}
            allCountries={allCountries}
          />
        ))}

        {totalPages > 1 && (
          <div className="pagination">
            <button disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>
            <span>Page {page} of {totalPages}</span>
            <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
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
