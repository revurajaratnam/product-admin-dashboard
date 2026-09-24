"use client";

import ErrorState from "../../components/common/ErrorState";

export default function ProductsRouteError({ error, reset }) {
  return (
    <div className="p-6">
      <ErrorState message={error?.message || "Something went wrong."} onRetry={reset} />
    </div>
  );
}
