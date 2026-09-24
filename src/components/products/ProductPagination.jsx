"use client";

import Select from "../common/Select";
import Button from "../common/Button";
import { ALLOWED_LIMITS } from "../../lib/queryParams";

export default function ProductPagination({ page, limit, total, onPageChange, onLimitChange }) {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(total, page * limit);

  const pageNumbers = getPageWindow(page, totalPages);

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-100 px-4 py-3 sm:flex-row">
      <div className="flex items-center gap-3 text-sm text-gray-600">
        <span>
          Showing {start}–{end} of {total}
        </span>
        <Select
          id="page-size"
          aria-label="Page size"
          value={limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
          className="w-auto"
        >
          {ALLOWED_LIMITS.map((n) => (
            <option key={n} value={n}>
              {n} / page
            </option>
          ))}
        </Select>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="secondary"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
        >
          Previous
        </Button>
        {pageNumbers.map((n, i) =>
          n === "..." ? (
            <span key={`ellipsis-${i}`} className="px-2 text-gray-400">
              …
            </span>
          ) : (
            <button
              key={n}
              onClick={() => onPageChange(n)}
              aria-current={n === page ? "page" : undefined}
              className={`min-w-[2.25rem] rounded-lg px-2 py-2 text-sm font-medium ${
                n === page ? "bg-brand-600 text-white" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {n}
            </button>
          )
        )}
        <Button
          variant="secondary"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Next page"
        >
          Next
        </Button>
      </div>
    </div>
  );
}

function getPageWindow(page, totalPages, span = 1) {
  const pages = [];
  const start = Math.max(1, page - span);
  const end = Math.min(totalPages, page + span);

  if (start > 1) {
    pages.push(1);
    if (start > 2) pages.push("...");
  }
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < totalPages) {
    if (end < totalPages - 1) pages.push("...");
    pages.push(totalPages);
  }
  return pages;
}
