import React, { useState } from 'react';
import '../styles/post.css';

const Post = ({ post }) => {
  const [likes, setLikes] = useState(post.likes);
  const [dislikes, setDislikes] = useState(post.dislikes);

  return (
    <div className="post">
      <div className="post-header">
        <span className="flag">{post.flag}</span>
        <span className="country">{post.country}</span>
        <span className="username">{post.username}</span>
      </div>
      <img className="post-image" src={post.image} alt={post.title} />
      <div className="post-body">
        <h3>{post.title}</h3>
        <p className="date">{post.date}</p>
        <p>{post.content}</p>
        <div className="reactions">
          <button onClick={() => setLikes(likes + 1)}>👍 {likes}</button>
          <button onClick={() => setDislikes(dislikes + 1)}>👎 {dislikes}</button>
        </div>
      </div>
    </div>
  );
};

export default Post;