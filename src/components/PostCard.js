import { useContext } from 'react';
import { PostContext } from '../context/PostContext';

const PostCard = ({ post }) => {
  const { removePost } = useContext(PostContext);
  return (
    <div className="post-card">
      <button className="close-btn" onClick={() => removePost(post.id)}>×</button>
      <img src={post.image} alt={post.title} className="card-img" />
      <div className="card-body">
        <h4 className="card-title">{post.title.substring(0, 45)}...</h4>
        <p className="card-desc">{post.body.substring(0, 80)}...</p>
        <span className="card-date">{post.date}</span>
      </div>
    </div>
  );
};
export default PostCard;