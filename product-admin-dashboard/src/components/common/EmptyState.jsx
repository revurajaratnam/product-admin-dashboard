export default function EmptyState({ title = "No results found", action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-gray-300 px-6 py-12 text-center">
      <p className="text-sm font-medium text-gray-600">{title}</p>
      {action}
    </div>
  );
}
