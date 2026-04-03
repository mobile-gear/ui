import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  isNextDisabled?: boolean;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  isNextDisabled,
  onPageChange,
}) => {
  const getPageNumbers = () => {
    const pages = [];
    const showPages = 5;
    const halfShow = Math.floor(showPages / 2);
    let start = Math.max(1, currentPage - halfShow);
    const end = Math.min(totalPages, start + showPages - 1);
    if (end - start + 1 < showPages) start = Math.max(1, end - showPages + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  if (totalPages <= 1) return null;

  const baseBtn = "px-3 py-1.5 rounded-lg font-body text-sm transition-colors";
  const activeBtn = `${baseBtn} bg-[#FF4500] text-white`;
  const normalBtn = `${baseBtn} bg-[#1E1E2C] border border-[#252535] text-[#9B9BAD] hover:border-[#FF4500]/40 hover:text-[#F0EEFF]`;
  const disabledBtn = `${baseBtn} bg-[#13131C] border border-[#252535] text-[#3A3A4A] cursor-not-allowed`;

  return (
    <div
      data-test="pagination"
      className="flex justify-center items-center gap-1.5 mt-10"
    >
      <button
        data-test="pagination-first"
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className={currentPage === 1 ? disabledBtn : normalBtn}
      >
        First
      </button>
      <button
        data-test="pagination-prev"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={currentPage === 1 ? disabledBtn : normalBtn}
      >
        Prev
      </button>

      {getPageNumbers().map((page) => (
        <button
          key={page}
          data-test="pagination-page"
          onClick={() => onPageChange(page)}
          className={currentPage === page ? activeBtn : normalBtn}
        >
          {page}
        </button>
      ))}

      <button
        data-test="pagination-next"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || Boolean(isNextDisabled)}
        className={
          currentPage === totalPages || Boolean(isNextDisabled)
            ? disabledBtn
            : normalBtn
        }
      >
        Next
      </button>
      <button
        data-test="pagination-last"
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages || Boolean(isNextDisabled)}
        className={
          currentPage === totalPages || Boolean(isNextDisabled)
            ? disabledBtn
            : normalBtn
        }
      >
        Last
      </button>
    </div>
  );
};

export default Pagination;
