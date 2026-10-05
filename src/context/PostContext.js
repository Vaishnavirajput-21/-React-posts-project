import { createContext, useState, useEffect } from 'react';

export const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const [allPosts, setAllPosts] = useState([]);
  const [removedIds, setRemovedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const POSTS_PER_PAGE = 6;

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch('https://jsonplaceholder.typicode.com/posts');
      const data = await res.json();
      
      // Adding dummy image and date to match wireframe
      const enrichedData = data.map(post => ({
        ...post,
        image: `https://picsum.photos/seed/${post.id}/300/180`,
        date: `Mon, 21 Dec 2020 14:57 GMT`
      }));

      // 5 sec loading as per requirement
      setTimeout(() => {
        setAllPosts(enrichedData);
        setLoading(false);
      }, 5000);
    };
    fetchPosts();
  }, []);

  const activePosts = allPosts.filter(p => !removedIds.has(p.id));

  const removePost = (id) => {
    const newRemoved = new Set(removedIds);
    newRemoved.add(id);
    setRemovedIds(newRemoved);
  };

  const totalPages = Math.ceil(activePosts.length / POSTS_PER_PAGE);
  const paginatedPosts = activePosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  return (
    <PostContext.Provider value={{
      loading,
      paginatedPosts,
      activePosts,
      currentPage,
      setCurrentPage,
      totalPages,
      removePost,
      POSTS_PER_PAGE
    }}>
      {children}
    </PostContext.Provider>
  );
};