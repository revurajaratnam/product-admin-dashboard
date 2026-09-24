export default function Loader({ label = "Loading...", size = "md" }) {
  const dims = size === "sm" ? "h-4 w-4" : "h-8 w-8";
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-10 text-gray-500">
      <span
        className={`${dims} animate-spin rounded-full border-2 border-brand-500 border-t-transparent`}
        role="status"
      />
      <span className="text-sm">{label}</span>
    </div>
  );
}

export function TableSkeleton({ rows = 6 }) {
  return (
    <div className="animate-pulse divide-y divide-gray-100">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-4 py-4">
          <div className="h-10 w-10 rounded bg-gray-200" />
          <div className="h-3 flex-1 rounded bg-gray-200" />
          <div className="h-3 w-16 rounded bg-gray-200" />
          <div className="h-3 w-16 rounded bg-gray-200" />
          <div className="h-3 w-16 rounded bg-gray-200" />
        </div>
      ))}
    </div>
  );
}
