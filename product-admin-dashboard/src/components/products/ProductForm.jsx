"use client";

import { useRef, useState } from "react";
import Input from "../common/Input";
import Button from "../common/Button";
import { validateProduct, hasErrors } from "../../lib/validation";

const emptyForm = {
  title: "",
  description: "",
  category: "",
  price: "",
  stock: "",
  brand: "",
  rating: "",
  thumbnail: "",
};

export default function ProductForm({ initialValues, submitLabel, onSubmit, apiError }) {
  const [form, setForm] = useState({ ...emptyForm, ...initialValues });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const inFlight = useRef(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (inFlight.current) return;

    const validationErrors = validateProduct(form);
    setErrors(validationErrors);
    if (hasErrors(validationErrors)) return;

    inFlight.current = true;
    setSubmitting(true);
    try {
      await onSubmit({
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category.trim(),
        price: Number(form.price),
        stock: Number(form.stock),
        brand: form.brand.trim() || undefined,
        rating: form.rating === "" ? undefined : Number(form.rating),
        thumbnail: form.thumbnail.trim() || undefined,
      });
    } finally {
      inFlight.current = false;
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <Input
        id="title"
        label="Title"
        value={form.title}
        onChange={(e) => update("title", e.target.value)}
        error={errors.title}
      />
      <div>
        <label htmlFor="description" className="mb-1 block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          rows={3}
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
        {errors.description && (
          <p className="mt-1 text-xs text-red-600">{errors.description}</p>
        )}
      </div>
      <Input
        id="category"
        label="Category"
        value={form.category}
        onChange={(e) => update("category", e.target.value)}
        error={errors.category}
        placeholder="beauty, furniture, groceries..."
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          id="price"
          label="Price"
          type="number"
          step="0.01"
          min="0"
          value={form.price}
          onChange={(e) => update("price", e.target.value)}
          error={errors.price}
        />
        <Input
          id="stock"
          label="Stock"
          type="number"
          min="0"
          value={form.stock}
          onChange={(e) => update("stock", e.target.value)}
          error={errors.stock}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input
          id="brand"
          label="Brand (optional)"
          value={form.brand}
          onChange={(e) => update("brand", e.target.value)}
        />
        <Input
          id="rating"
          label="Rating (optional)"
          type="number"
          step="0.1"
          min="0"
          max="5"
          value={form.rating}
          onChange={(e) => update("rating", e.target.value)}
        />
      </div>
      <Input
        id="thumbnail"
        label="Image URL (optional)"
        value={form.thumbnail}
        onChange={(e) => update("thumbnail", e.target.value)}
        placeholder="https://..."
      />

      {apiError && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {apiError}
        </p>
      )}

      <Button type="submit" loading={submitting} className="w-full sm:w-auto">
        {submitting ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}
