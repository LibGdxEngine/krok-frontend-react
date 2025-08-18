import { useState } from "react";
import { useRouter } from "next/router";

const Pagination = ({ products }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;
  const totalPages = Math.ceil((products?.length ?? 0) / itemsPerPage); // Use nullish coalescing
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
      {/* ... rest of your component ... */}
    </div>
  );
};

export default Pagination;