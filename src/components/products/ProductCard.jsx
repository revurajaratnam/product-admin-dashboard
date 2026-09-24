"use client";

import Link from "next/link";
import Image from "next/image";
import { formatCurrency } from "../../lib/utils";

export default function ProductCard({ product, onDeleteClick }) {
  return (
    <div className="flex gap-3 rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
      <Image
        src={product.thumbnail || product.images?.[0] || "/placeholder.svg"}
        alt={product.title}
        width={64}
        height={64}
        unoptimized
        className="h-16 w-16 shrink-0 rounded-lg object-cover"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-gray-900">{product.title}</p>
        <p className="text-xs capitalize text-gray-500">{product.category}</p>
        <div className="mt-1 flex items-center gap-3 text-sm text-gray-700">
          <span>{formatCurrency(product.price)}</span>
          <span>⭐ {Number(product.rating).toFixed(1)}</span>
          <span className={product.stock > 0 ? "text-green-600" : "text-red-600"}>
            {product.stock} in stock
          </span>
        </div>
        <div className="mt-2 flex gap-3 text-xs font-medium">
          <Link href={`/products/${product.id}`} className="text-brand-600">
            View
          </Link>
          <Link href={`/products/edit/${product.id}`} className="text-gray-600">
            Edit
          </Link>
          <button onClick={() => onDeleteClick(product)} className="text-red-600">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
