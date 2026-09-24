"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProductForm from "../../../../components/products/ProductForm";
import productService from "../../../../services/productService";
import { applyOverlayToProduct, recordEdited, findLocalProduct } from "../../../../lib/overlay";
import Loader from "../../../../components/common/Loader";
import ErrorState from "../../../../components/common/ErrorState";
import { useToast } from "../../../../components/common/Toast";

export default function EditProductPage({ params }) {
  const { id } = params;
  const router = useRouter();
  const toast = useToast();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [apiError, setApiError] = useState("");

  async function load() {
    setLoading(true);
    setLoadError("");
    const local = findLocalProduct(id);
    if (local) {
      setProduct(local);
      setLoading(false);
      return;
    }
    try {
      const data = await productService.getProduct(id);
      setProduct(applyOverlayToProduct(data));
    } catch (err) {
      setLoadError(err.message || "Failed to load product.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [id]);

  async function handleSubmit(payload) {
    setApiError("");
    try {
      const isLocal = product.__local;
      if (!isLocal) {
        await productService.updateProduct(id, payload);
      }
      recordEdited(id, payload);
      toast("Product updated.", "success");
      router.push(`/products/${id}`);
    } catch (err) {
      setApiError(err.message || "Failed to update product.");
    }
  }

  if (loading) return <Loader label="Loading product..." />;
  if (loadError) {
    return (
      <div className="p-6">
        <ErrorState message={loadError} onRetry={load} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl p-4 sm:p-6">
      <h1 className="mb-4 text-xl font-semibold text-gray-900">Edit Product</h1>
      <ProductForm
        initialValues={product}
        submitLabel="Update Product"
        onSubmit={handleSubmit}
        apiError={apiError}
      />
    </div>
  );
}
