import { useContext } from 'react';
import { PostContext } from '../context/PostContext';
import PostCard from './PostCard';
import Pagination from './Pagination';
import Loader from './Loader';

const PostList = () => {
  const { loading, paginatedPosts } = useContext(PostContext);
  if (loading) return <Loader />;
  
  return (
    <>
      <div className="grid-container">
        {paginatedPosts.map(post => <PostCard key={post.id} post={post} />)}
      </div>
      <Pagination />
    </>
  );
};
export default PostList;