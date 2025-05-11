import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/post.css';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { AiFillLike, AiFillDislike } from 'react-icons/ai';
import { LiaCommentSolid } from 'react-icons/lia';
import { fetchLikeCounts, likePost } from '../services/likeService';
import { deletePost } from '../services/postService';
import { followUser, unfollowUser } from '../services/followService';
import { getCommentCountByPostId } from '../services/commentService';
import CommentSection from './CommentSection';

const Post = ({ post, allCountries = [], showActions = false, isFollowing, onFollowToggle }) => {
  const navigate = useNavigate();
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [userReaction, setUserReaction] = useState(null);
  const [commentCount, setCommentCount] = useState(0);
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const [expanded, setExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const countryDetails = allCountries.find(
    (c) => c.name?.toLowerCase().trim() === post.country?.toLowerCase().trim()
  );

  useEffect(() => {
    fetchLikeCounts(post.id)
      .then(({ likes, dislikes, userReaction }) => {
        setLikes(likes);
        setDislikes(dislikes);
        setUserReaction(userReaction);
      })
      .catch(err => console.error('Failed to fetch like counts:', err));

    getCommentCountByPostId(post.id)
      .then(({ count }) => setCommentCount(count))
      .catch(err => console.error('Failed to get comment count:', err));
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
        <p className="date">
          Visited on: {post.date_of_visit
            ? new Date(post.date_of_visit).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
            : 'Not available'}
        </p>
        <p className="date">
          Posted on: {post.created_at
            ? new Date(post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
            : 'Not available'}
        </p>

        <p className={`post-content ${expanded ? 'expanded' : ''}`}>
          {post.content}
        </p>
        {post.content.length > 300 && (
          <button className="see-more-btn" onClick={() => setExpanded(!expanded)}>
            {expanded ? 'See less' : 'See more'}
          </button>
        )}

        {countryDetails && (
          <div className="country-details-box">
            <p><strong>Capital:</strong> {countryDetails.capital}</p>
            <p><strong>Currency:</strong> {countryDetails.currency}</p>
            <p><strong>Languages:</strong> {countryDetails.languages?.join(', ')}</p>
          </div>
        )}

        <div className="reactions">
          <button className={`reaction-btn ${userReaction === 'like' ? 'active-like' : ''}`} onClick={() => handleReaction('like')}>
            <AiFillLike size={22} color={userReaction === 'like' ? '#007bff' : '#888'} /> {likes}
          </button>
          <button className={`reaction-btn ${userReaction === 'dislike' ? 'active-dislike' : ''}`} onClick={() => handleReaction('dislike')}>
            <AiFillDislike size={22} color={userReaction === 'dislike' ? '#dc3545' : '#888'} /> {dislikes}
          </button>
          <button className="reaction-btn" onClick={() => setShowComments(!showComments)}>
            <LiaCommentSolid size={22} /> {commentCount}
          </button>
        </div>

        {showComments && (
          <CommentSection postId={post.id} user={currentUser} setCommentCount={setCommentCount} />
        )}
      </div>
    </div>
  );
};

export default Post;
