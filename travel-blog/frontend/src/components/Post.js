import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/post.css';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { AiFillLike, AiFillDislike } from 'react-icons/ai';
import { fetchLikeCounts, likePost } from '../services/likeService';
import { deletePost } from '../services/postService';
import { followUser, unfollowUser } from '../services/followService';

const Post = ({ post, showActions = false, isFollowing, onFollowToggle }) => {
  const navigate = useNavigate();
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [userReaction, setUserReaction] = useState(null);
  const currentUser = JSON.parse(localStorage.getItem('user'));

  // ✅ Read country data from global scope (already fetched)
  const allCountries = window.allCountries || [];
  const countryDetails = allCountries.find(
    (c) => c.name?.toLowerCase() === post.country?.toLowerCase()
  );

  useEffect(() => {
    fetchLikeCounts(post.id)
      .then(({ likes, dislikes, userReaction }) => {
        setLikes(likes);
        setDislikes(dislikes);
        setUserReaction(userReaction);
      })
      .catch(err => console.error('Failed to fetch like counts:', err));
  }, [post.id]);

  const handleReaction = async (type) => {
    try {
      await likePost(post.id, type);
      const { likes, dislikes, userReaction } = await fetchLikeCounts(post.id);
      setLikes(likes);
      setDislikes(dislikes);
      setUserReaction(userReaction);
    } catch (err) {
      alert('You must be logged in to react.');
    }
  };

  const handleFollowClick = async () => {
    try {
      if (isFollowing) {
        await unfollowUser(post.user_id);
        onFollowToggle(post.user_id, false);
      } else {
        await followUser(post.user_id);
        onFollowToggle(post.user_id, true);
      }
    } catch (err) {
      console.error('Follow action failed', err);
    }
  };

  return (
    <div className="post">
      {showActions && (
        <div className="post-controls">
          <button className="icon-btn edit" title="Edit" onClick={() => navigate(`/edit-post/${post.id}`)}>
            <FaEdit />
          </button>
          <button className="icon-btn delete" title="Delete" onClick={async () => {
            if (window.confirm("Delete this post?")) {
              await deletePost(post.id);
              window.location.reload();
            }
          }}>
            <FaTrashAlt />
          </button>
        </div>
      )}

      <div className="post-header">
        <div className="country-section">
          {countryDetails?.flag && (
            <img src={countryDetails.flag} alt="flag" className="country-flag" />
          )}
          <span className="country">{post.country}</span>
        </div>
        <span className="username">{post.username}</span>
        {currentUser && currentUser.id !== post.user_id && (
          <button className={`follow-btn ${isFollowing ? 'unfollow' : ''}`} onClick={handleFollowClick}>
            {isFollowing ? 'Unfollow' : 'Follow'}
          </button>
        )}
      </div>

      <img
        className="post-image"
        src={post.image_url ? `http://localhost:5000${post.image_url}` : post.image}
        alt={post.title}
      />

      <div className="post-body">
        <h3>{post.title}</h3>
        <p className="date">{post.date}</p>
        <p>{post.content}</p>

        {countryDetails && (
          <div className="country-details-box">
            <p><strong>Capital:</strong> {countryDetails.capital}</p>
            <p><strong>Currency:</strong> {countryDetails.currency}</p>
            <p><strong>Languages:</strong> {countryDetails.languages?.join(', ')}</p>
          </div>
        )}

        <div className="reactions">
          <button
            className={`reaction-btn ${userReaction === 'like' ? 'active-like' : ''}`}
            onClick={() => handleReaction('like')}
          >
            <AiFillLike size={22} /> {likes}
          </button>
          <button
            className={`reaction-btn ${userReaction === 'dislike' ? 'active-dislike' : ''}`}
            onClick={() => handleReaction('dislike')}
          >
            <AiFillDislike size={22} /> {dislikes}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Post;
