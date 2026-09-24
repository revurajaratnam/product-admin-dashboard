"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatCurrency, classNames } from "../../lib/utils";
import ProductReviews from "./ProductReviews";

export default function ProductDetails({ product }) {
  const images = product.images?.length ? product.images : [product.thumbnail].filter(Boolean);
  const [active, setActive] = useState(0);

  return (
    <div>
      <Link href="/products" className="mb-4 inline-block text-sm text-brand-600 hover:underline">
        ← Back to Products
      </Link>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <div className="aspect-square w-full overflow-hidden rounded-xl border border-gray-200 bg-white">
            {images[active] ? (
              <Image
                src={images[active]}
                alt={product.title}
                width={500}
                height={500}
                unoptimized
                className="h-full w-full object-contain"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-gray-300">No image</div>
            )}
          </div>
          {images.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {images.map((src, i) => (
                <button
                  key={src + i}
                  onClick={() => setActive(i)}
                  className={classNames(
                    "h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2",
                    active === i ? "border-brand-500" : "border-transparent"
                  )}
                >
                  <Image src={src} alt="" width={64} height={64} unoptimized className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-brand-600">
            {product.category}
          </p>
          <h1 className="mt-1 text-2xl font-bold text-gray-900">{product.title}</h1>
          {product.brand && <p className="text-sm text-gray-500">by {product.brand}</p>}

          <div className="mt-3 flex items-center gap-3 text-lg font-semibold text-gray-900">
            {formatCurrency(product.price)}
            <span className="text-sm font-normal text-yellow-500">
              ⭐ {Number(product.rating).toFixed(1)}
            </span>
          </div>

          <p
            className={classNames(
              "mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium",
              product.stock > 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
            )}
          >
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </p>

          <p className="mt-4 text-sm leading-relaxed text-gray-600">{product.description}</p>

          <div className="mt-6 flex gap-2">
            <Link
              href={`/products/edit/${product.id}`}
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
            >
              Edit Product
            </Link>
          </div>
        </div>
      </div>

      <section className="mt-10">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Reviews</h2>
        <ProductReviews reviews={product.reviews} />
      </section>
    </div>
  );
}
