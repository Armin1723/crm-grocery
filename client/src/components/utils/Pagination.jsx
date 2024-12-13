import React from "react";

const Pagination = ({ page= 1, setPage=()=>{}, totalPages = 10 }) => {
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(Math.ceil(newPage));
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const siblingCount = 1;
    const leftSiblingIndex = Math.max(page - siblingCount, 1);
    const rightSiblingIndex = Math.min(page + siblingCount, totalPages);

    if (leftSiblingIndex > 1) {
      pageNumbers.push(1);
      if (leftSiblingIndex > 2) {
        pageNumbers.push("...");
      }
    }

    for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
      pageNumbers.push(i);
    }

    if (rightSiblingIndex < totalPages) {
      if (rightSiblingIndex < totalPages - 1) {
        pageNumbers.push("...");
      }
      pageNumbers.push(totalPages);
    }

    return pageNumbers.map((pageNumber, index) =>
      pageNumber === "..." ? (
        <span key={index} className="px-2">
          ...
        </span>
      ) : (
        <button
          key={index}
          onClick={() => handlePageChange(pageNumber)}
          className={`px-3 py-1 mx-1 rounded ${
            Math.ceil(pageNumber) === page
              ? "bg-[var(--bg-primary)] text-[var(--text-primary)]"
              : " hover:bg-accent/20"
          }`}
        >
          {Math.ceil(pageNumber)}
        </button>
      )
    );
  };

  return (
    <div className="flex items-center space-x-2 justify-center">
      <button
        onClick={() => handlePageChange(page - 1)}
        disabled={page === 1}
        className="px-3 py-1 rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        &lt;
      </button>
      {renderPageNumbers()}
      <button
        onClick={() => handlePageChange(page + 1)}
        disabled={page === totalPages}
        className="px-3 py-1 rounded disabled:opacity-50 disabled-cursor-not-allowed"
      >
        &gt;
      </button>
    </div>
  );
};

export default Pagination;