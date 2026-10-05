import { useState, useEffect, createContext, useContext } from 'react';
import './App.css';

// --- Context ---
const PostContext = createContext();

const PostProvider = ({ children }) => {
  const [allPosts, setAllPosts] = useState([]);
  const [removedIds, setRemovedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const POSTS_PER_PAGE = 6;

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch('https://jsonplaceholder.typicode.com/posts');
      const data = await res.json();
      const enrichedData = data.map(post => ({
        ...post,
        image: `https://picsum.photos/seed/${post.id}/300/180`,
        date: `Mon, 21 Dec 2020 14:57 GMT`
      }));
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
    <PostContext.Provider value={{ loading, paginatedPosts, currentPage, setCurrentPage, totalPages, removePost }}>
      {children}
    </PostContext.Provider>
  );
};

// --- Components inside same file ---
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

const Pagination = () => {
  const { currentPage, setCurrentPage, totalPages } = useContext(PostContext);
  const goToPage = (page) => { if (page >= 1 && page <= totalPages) setCurrentPage(page); };
  return (
    <div className="pagination">
      <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>{"<"}</button>
      {[...Array(Math.min(totalPages, 10))].map((_, i) => (
        <button key={i+1} className={currentPage === i+1 ? "active" : ""} onClick={() => goToPage(i+1)}>{i+1}</button>
      ))}
      <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>{">"}</button>
    </div>
  );
};

const PostList = () => {
  const { loading, paginatedPosts } = useContext(PostContext);
  if (loading) return <div className="loader-container"><h2>Loading...</h2><div className="spinner"></div></div>;
  return (
    <>
      <div className="grid-container">
        {paginatedPosts.map(post => <PostCard key={post.id} post={post} />)}
      </div>
      <Pagination />
    </>
  );
};

// --- Main App ---
function App() {
  return (
    <PostProvider>
      <div className="App">
        <h1 className="app-title">Wireframe:</h1>
        <PostList />
      </div>
    </PostProvider>
  );
}
export default App;