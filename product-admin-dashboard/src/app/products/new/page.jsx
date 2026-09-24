"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProductForm from "../../../components/products/ProductForm";
import productService from "../../../services/productService";
import { recordAdded } from "../../../lib/overlay";
import { useToast } from "../../../components/common/Toast";

export default function NewProductPage() {
  const router = useRouter();
  const toast = useToast();
  const [apiError, setApiError] = useState("");

  async function handleSubmit(payload) {
    setApiError("");
    try {
      const created = await productService.addProduct(payload);
      const local = recordAdded({ ...created, ...payload });
      toast("Product added.", "success");
      router.push(`/products/${local.id}`);
    } catch (err) {
      setApiError(err.message || "Failed to add product.");
    }
  }

  return (
    <div className="mx-auto max-w-2xl p-4 sm:p-6">
      <h1 className="mb-4 text-xl font-semibold text-gray-900">Add Product</h1>
      <ProductForm submitLabel="Save Product" onSubmit={handleSubmit} apiError={apiError} />
    </div>
  );
}
