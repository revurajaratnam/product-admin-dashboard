"use client";

import ProductCard from "./ProductCard";

export default function ProductGrid({ products, onDeleteClick }) {
  return (
    <div className="grid grid-cols-1 gap-3 p-4 sm:hidden">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} onDeleteClick={onDeleteClick} />
      ))}
    </div>
  );
}
