import React from "react"
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

interface PaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
  onItemsPerPageChange: (itemsPerPage: number) => void
}

export const TablePagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}) => {
  return (
    <div className="flex items-center justify-between mt-4 py-3">
      <div className="text-sm flex items-center gap-2 text-gray-500">
        <span className="hidden md:flex">Showing</span>{" "}
        <select
          className="bg-transparent outline-none border border-[#E9E7FD] rounded px-2.5 py-0.5"
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>{" "}
        <span>of {totalItems}</span>
      </div>

      <div className="flex gap-2">
        <button
          className="text-xs lg:text-sm px-1 py-1 rounded shadow-sm shadow-[#A5A3AE4D] bg-[#F1F2F6] text-[#8B909A] cursor-pointer disabled:opacity-50"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <IoIosArrowBack />
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            className={`rounded min-w-[32px] text-xs lg:text-sm px-3 py-1 shadow-sm shadow-[#A5A3AE4D] cursor-pointer ${
              currentPage === page ? "bg-[#175CD3] text-white" : "bg-[#F1F2F6] text-[#8B909A]"
            }`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}

        <button
          className="text-xs lg:text-sm px-1 py-1 rounded shadow-sm shadow-[#A5A3AE4D] bg-[#F1F2F6] text-[#8B909A] cursor-pointer disabled:opacity-50"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <IoIosArrowForward />
        </button>
      </div>
    </div>
  )
}