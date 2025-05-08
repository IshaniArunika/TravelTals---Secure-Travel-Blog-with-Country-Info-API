import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/post.css';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { AiFillLike, AiFillDislike } from 'react-icons/ai';
import { fetchLikeCounts, likePost } from '../services/likeService';
import { deletePost } from '../services/postService';

const Post = ({ post, showActions = false }) => {
  const navigate = useNavigate();
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [userReaction, setUserReaction] = useState(null); // 'like' | 'dislike' | null

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
    if (!['like', 'dislike'].includes(type)) return;

    const isSame = userReaction === type;
    const newReaction = isSame ? null : type;

    try {
      await likePost(post.id, type);

      const { likes, dislikes, userReaction } = await fetchLikeCounts(post.id);
      setLikes(likes);
      setDislikes(dislikes);
      setUserReaction(userReaction);
    } catch (err) {
      alert('You must be logged in to react.');
      console.error(err);
    }
  };

  return (
    <div className="post">
      {showActions && (
        <div className="post-controls">
          <button className="icon-btn edit" title="Edit" onClick={() => navigate(`/edit-post/${post.id}`)}>
            <FaEdit />
          </button>
          <button
            className="icon-btn delete"
            title="Delete"
            onClick={async () => {
              const confirmDelete = window.confirm("Are you sure you want to delete this post?");
              if (!confirmDelete) return;

              try {
                await deletePost(post.id);
                alert("Post deleted.");
                window.location.reload(); // You can also call a parent state update
              } catch (err) {
                console.error(err);
                alert("Failed to delete post.");
              }
            }}
          >
            <FaTrashAlt />
          </button>

        </div>
      )}

      <div className="post-header">
        <span className="flag">{post.flag}</span>
        <span className="country">{post.country}</span>
        <span className="username">{post.username}</span>
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

        <div className="reactions">
          <button
            className={`reaction-btn ${userReaction === 'like' ? 'active-like' : ''}`}
            onClick={() => handleReaction('like')}
            title="Like"
          >
            <AiFillLike size={22} /> {likes}
          </button>

          <button
            className={`reaction-btn ${userReaction === 'dislike' ? 'active-dislike' : ''}`}
            onClick={() => handleReaction('dislike')}
            title="Dislike"
          >
            <AiFillDislike size={22} /> {dislikes}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Post;
