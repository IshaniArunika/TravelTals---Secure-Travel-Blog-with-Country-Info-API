import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllPosts } from '../services/postService';
import { getFollowers, getFollowing } from '../services/followService';
import '../styles/profilePage.css';
import Post from './Post';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser) {
      navigate('/'); // redirect to homepage if not logged in
      return;
    }

    setUser(storedUser);

    // fetch user's posts
    getAllPosts()
      .then(data => {
        const filtered = data.filter(post => post.user_id === storedUser.id);
        setUserPosts(filtered);
      })
      .catch(err => console.error('Failed to fetch posts:', err));

    // fetch follower/following count
    getFollowers(storedUser.id)
      .then(data => setFollowers(data.length))
      .catch(err => console.error('Failed to fetch followers:', err));

    getFollowing(storedUser.id)
      .then(data => setFollowing(data.length))
      .catch(err => console.error('Failed to fetch following:', err));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  if (!user) return null;

  return (
    <div className="profile-container">
      <div className="profile-banner">
        <div className="banner-overlay"></div>
      </div>

      <div className="profile-header">
        <div className="profile-avatar">
          <div className="avatar-placeholder">
            {user.username?.charAt(0).toUpperCase() || 'U'}
          </div>
        </div>

        <div className="user-info">
          <h2>{user.username}</h2>
          <p className="user-email">{user.email}</p>
        </div>

        <div className="profile-actions">
          <button className="logout-button" onClick={handleLogout}>Logout</button>
          <button className="add-post-button" onClick={() => navigate('/add-post')}>Add Post</button>
        </div>
      </div>

      <div className="profile-stats">
        <div className="stat">
          <span className="stat-number">{userPosts.length}</span>
          <span className="stat-label">Posts</span>
        </div>
        <div className="stat">
          <span className="stat-number">{followers}</span>
          <span className="stat-label">Followers</span>
        </div>
        <div className="stat">
          <span className="stat-number">{following}</span>
          <span className="stat-label">Following</span>
        </div>
      </div>

      <div className="posts-section">
        <h3 className="section-title">Your Posts</h3>
        <div className="posts-container">
          {userPosts.length > 0 ? (
            userPosts.map(post => (
              <Post key={post.id} post={post} showActions={true} />
            ))
          ) : (
            <p style={{ color: '#777', textAlign: 'center' }}>
              You haven’t posted anything yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
