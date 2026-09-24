import { formatDate } from "../../lib/utils";
import EmptyState from "../common/EmptyState";

export default function ProductReviews({ reviews = [] }) {
  if (!reviews.length) {
    return <EmptyState title="No reviews yet for this product." />;
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {reviews.map((r, i) => (
        <div key={i} className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="mb-1 flex items-center justify-between">
            <span className="font-medium text-gray-900">{r.reviewerName || "Anonymous"}</span>
            <span className="text-sm text-yellow-500">
              {"★".repeat(Math.round(r.rating))}
              {"☆".repeat(5 - Math.round(r.rating))}
            </span>
          </div>
          <p className="text-sm text-gray-600">{r.comment}</p>
          {r.date && <p className="mt-2 text-xs text-gray-400">{formatDate(r.date)}</p>}
        </div>
      ))}
    </div>
  );
}
