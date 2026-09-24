"use client";

import Link from "next/link";
import Image from "next/image";
import { formatCurrency, classNames } from "../../lib/utils";

const SORT_COLUMNS = [
  { key: "title", label: "Title" },
  { key: "price", label: "Price" },
  { key: "rating", label: "Rating" },
];

export default function ProductTable({ products, sort, order, onSortChange, onDeleteClick }) {
  function headerFor(col) {
    const active = sort === col.key;
    const nextOrder = active && order === "asc" ? "desc" : "asc";
    return (
      <button
        onClick={() => onSortChange(col.key, nextOrder)}
        className="flex items-center gap-1 font-semibold text-gray-700 hover:text-gray-900"
      >
        {col.label}
        <span className="text-xs text-gray-400">
          {active ? (order === "asc" ? "▲" : "▼") : ""}
        </span>
      </button>
    );
  }

  return (
    <table className="hidden w-full text-left text-sm sm:table">
      <thead className="border-b border-gray-100 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
        <tr>
          <th className="px-4 py-3">Image</th>
          <th className="px-4 py-3">{headerFor(SORT_COLUMNS[0])}</th>
          <th className="px-4 py-3">Category</th>
          <th className="px-4 py-3">{headerFor(SORT_COLUMNS[1])}</th>
          <th className="px-4 py-3">{headerFor(SORT_COLUMNS[2])}</th>
          <th className="px-4 py-3">Stock</th>
          <th className="px-4 py-3 text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {products.map((p) => (
          <tr key={p.id} className="hover:bg-gray-50">
            <td className="px-4 py-3">
              <Image
                src={p.thumbnail || p.images?.[0] || "/placeholder.svg"}
                alt={p.title}
                width={40}
                height={40}
                unoptimized
                className="h-10 w-10 rounded object-cover"
              />
            </td>
            <td className="max-w-[16rem] truncate px-4 py-3 font-medium text-gray-900">
              {p.title}
            </td>
            <td className="px-4 py-3 capitalize text-gray-600">{p.category}</td>
            <td className="px-4 py-3 text-gray-900">{formatCurrency(p.price)}</td>
            <td className="px-4 py-3 text-gray-900">⭐ {Number(p.rating).toFixed(1)}</td>
            <td className="px-4 py-3">
              <span
                className={classNames(
                  "rounded-full px-2 py-0.5 text-xs font-medium",
                  p.stock > 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                )}
              >
                {p.stock}
              </span>
            </td>
            <td className="px-4 py-3">
              <div className="flex justify-end gap-2">
                <Link
                  href={`/products/${p.id}`}
                  className="rounded-lg px-2 py-1 text-xs font-medium text-brand-600 hover:bg-brand-50"
                >
                  View
                </Link>
                <Link
                  href={`/products/edit/${p.id}`}
                  className="rounded-lg px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100"
                >
                  Edit
                </Link>
                <button
                  onClick={() => onDeleteClick(p)}
                  className="rounded-lg px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
