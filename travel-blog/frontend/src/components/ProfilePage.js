import React, { useEffect, useState } from 'react';
import { getAllPosts } from '../services/postService';
import '../styles/profilePage.css';
import Post from './Post';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const followers = 24;   // placeholder
  const following = 16;   // placeholder

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);

      getAllPosts()
        .then(data => {
          const filtered = data.filter(post => post.user_id === storedUser.id);
          setUserPosts(filtered);
        })
        .catch(err => console.error('Failed to fetch posts:', err));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  if (!user) return <div className="profile-container">Loading profile...</div>;

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

        <button className="logout-button" onClick={handleLogout}>Logout</button>
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
            <p style={{ color: '#777', textAlign: 'center' }}>You haven’t posted anything yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
