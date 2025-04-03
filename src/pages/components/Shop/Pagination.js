import { useState } from "react";
import { useRouter } from "next/router";

const Pagination = ({ products }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const router = useRouter();

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    router.push(`?page=${page}`);
    setCurrentPage(page);
  };

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-10 p-4">
      <button
        onClick={() => handlePageChange(setCurrentPage((prev) => prev - 1))}
        disabled={currentPage === 1}
        className={`px-3 py-1 rounded-lg ${
          currentPage === 1
            ? "bg-gray-500 hover:bg-gray-600"
            : "bg-navyBlue hover:bg-blue-600"
        }  disabled:opacity-50`}
      >
        Prev
      </button>

      {renderPageNumbers().map((page, index) =>
        page === "..." ? (
          <span key={index} className="px-3 py-1 text-gray-500">
            ...
          </span>
        ) : (
          <button
            key={index}
            onClick={() => handlePageChange(page)}
            className={`px-3 py-1 rounded-lg ${
              page === currentPage
                ? "bg-blue-500 text-white"
                : "bg-gray-500 hover:bg-gray-600"
            }`}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className={`px-3 py-1 rounded-lg ${
          currentPage >= totalPages
            ? "bg-gray-500 hover:bg-gray-600 "
            : "bg-blue-400 hover:bg-blue-500"
        } disabled:opacity-50`}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
