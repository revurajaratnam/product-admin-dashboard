"use client";

import { useEffect, useState } from "react";
import Select from "../common/Select";
import productService from "../../services/productService";

export default function ProductFilters({ category, onCategoryChange, searchActive }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;
    productService
      .getCategories()
      .then((data) => mounted && setCategories(data))
      .catch(() => mounted && setError(true))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="w-full sm:w-56">
      <Select
        id="category-filter"
        label="Category"
        value={category}
        disabled={loading || error}
        onChange={(e) => onCategoryChange(e.target.value)}
      >
        <option value="">All Categories</option>
        {categories.map((c) => (
          <option key={c.slug} value={c.slug}>
            {c.name}
          </option>
        ))}
      </Select>
      {searchActive && (
        <p className="mt-1 text-xs text-gray-400">
          Applied on top of your search results.
        </p>
      )}
    </div>
  );
}
