"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center pt-4">
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border border-border bg-bg-surface text-text-sub hover:bg-bg-sub disabled:opacity-50 disabled:hover:bg-bg-surface transition-colors cursor-pointer disabled:cursor-default shrink-0"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="flex items-center gap-1 overflow-x-auto max-w-[calc(100vw-160px)] md:max-w-none scrollbar-hide">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={cn(
                "min-w-9 h-9 px-2 rounded-lg text-sm font-medium transition-colors shrink-0 cursor-pointer",
                currentPage === page
                  ? "bg-brand text-white"
                  : "text-text-sub hover:bg-bg-sub"
              )}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg border border-border bg-bg-surface text-text-sub hover:bg-bg-sub disabled:opacity-50 disabled:hover:bg-bg-surface transition-colors cursor-pointer disabled:cursor-default shrink-0"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
