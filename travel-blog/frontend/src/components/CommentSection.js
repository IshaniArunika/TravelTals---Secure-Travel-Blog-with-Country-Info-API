import React, { useEffect, useState, useCallback } from 'react';
import { addComment, getCommentsByPostId } from '../services/commentService';
import '../styles/commentSection.css';
import { formatDistanceToNow } from 'date-fns';

const CommentSection = ({ postId, user, setCommentCount }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchComments = useCallback(async () => {
    try {
      const data = await getCommentsByPostId(postId);
      setComments(data);
      if (setCommentCount) setCommentCount(data.length);
    } catch (err) {
      console.error('Failed to fetch comments:', err);
    } finally {
      setLoading(false);
    }
  }, [postId, setCommentCount]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const payload = {
        post_id: postId,
        user_id: user.id,
        content: newComment
      };
      await addComment(payload);
      setNewComment('');
      await fetchComments();
    } catch (err) {
      alert('Failed to post comment');
    }
  };

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  return (
    <div className="comment-section">
      <h4>Comments</h4>

      {loading ? (
        <p>Loading...</p>
      ) : comments.length === 0 ? (
        <p className="no-comments">No comments yet.</p>
      ) : (
        <ul className="comment-list">
          {comments.map((c) => (
            <div key={c.id} className="comment-box">
              <div className="comment-meta">
                <strong>{c.username}</strong> ·{' '}
                <span className="comment-time">
                  {formatDistanceToNow(new Date(c.created_at), { addSuffix: true })}
                </span>
              </div>
              <div className="comment-text">{c.content}</div>
            </div>
          ))}
        </ul>
      )}

      {user && (
        <form onSubmit={handleSubmit} className="comment-form">
          <textarea
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={2}
          />
          <button type="submit">Post</button>
        </form>
      )}
    </div>
  );
};

export default CommentSection;
