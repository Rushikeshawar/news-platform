 
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import '../../styles/components/Pagination.css';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  showInfo = false,
  totalItems = 0 
}) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const showPages = 5; // Number of page buttons to show
    
    let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
    let endPage = Math.min(totalPages, startPage + showPages - 1);
    
    // Adjust start page if we're near the end
    if (endPage === totalPages) {
      startPage = Math.max(1, endPage - showPages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="pagination">
      {showInfo && (
        <div className="pagination-info">
          <span>
            Page {currentPage} of {totalPages}
            {totalItems > 0 && ` (${totalItems} total items)`}
          </span>
        </div>
      )}
      
      <div className="pagination-controls">
        {/* Previous Button */}
        <button
          className="pagination-btn prev"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
          Previous
        </button>

        {/* First page if not visible */}
        {pageNumbers[0] > 1 && (
          <>
            <button
              className="pagination-btn page"
              onClick={() => onPageChange(1)}
            >
              1
            </button>
            {pageNumbers[0] > 2 && <span className="pagination-ellipsis">...</span>}
          </>
        )}

        {/* Page Numbers */}
        {pageNumbers.map(page => (
          <button
            key={page}
            className={`pagination-btn page ${currentPage === page ? 'active' : ''}`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}

        {/* Last page if not visible */}
        {pageNumbers[pageNumbers.length - 1] < totalPages && (
          <>
            {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
              <span className="pagination-ellipsis">...</span>
            )}
            <button
              className="pagination-btn page"
              onClick={() => onPageChange(totalPages)}
            >
              {totalPages}
            </button>
          </>
        )}

        {/* Next Button */}
        <button
          className="pagination-btn next"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Next page"
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;