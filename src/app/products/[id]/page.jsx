"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import productService from "../../../services/productService";
import { applyOverlayToProduct, findLocalProduct } from "../../../lib/overlay";
import ProductDetails from "../../../components/products/ProductDetails";
import Loader from "../../../components/common/Loader";
import ErrorState from "../../../components/common/ErrorState";

export default function ProductDetailsPage({ params }) {
  const { id } = params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);

  async function load() {
    setLoading(true);
    setError("");
    setNotFound(false);

    const local = findLocalProduct(id);
    if (local) {
      setProduct(local);
      setLoading(false);
      return;
    }

    try {
      const data = await productService.getProduct(id);
      const withOverlay = applyOverlayToProduct(data);
      if (!withOverlay) {
        setNotFound(true);
      } else {
        setProduct(withOverlay);
      }
    } catch (err) {
      if (err.status === 404) setNotFound(true);
      else setError(err.message || "Failed to load product.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [id]);

  if (loading) return <Loader label="Loading product..." />;

  if (notFound) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 p-10 text-center">
        <h1 className="text-xl font-semibold text-gray-900">Product Not Found</h1>
        <p className="text-sm text-gray-500">
          We couldn&apos;t find a product with id &ldquo;{id}&rdquo;.
        </p>
        <Link href="/products" className="text-sm font-medium text-brand-600 hover:underline">
          ← Back to Products
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState message={error} onRetry={load} />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <ProductDetails product={product} />
    </div>
  );
}
