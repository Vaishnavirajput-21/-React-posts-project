import { useContext } from 'react';
import { PostContext } from '../context/PostContext';

const Pagination = () => {
  const { currentPage, setCurrentPage, totalPages } = useContext(PostContext);
  
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="pagination">
      <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>{"<"}</button>
      {[...Array(totalPages)].slice(0, 10).map((_, i) => {
        const page = i + 1;
        return (
          <button
            key={page}
            className={currentPage === page ? "active" : ""}
            onClick={() => goToPage(page)}
          >
            {page}
          </button>
        );
      })}
      <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>{">"}</button>
    </div>
  );
};
export default Pagination;