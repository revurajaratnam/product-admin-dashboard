"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import productService from "../services/productService";
import { applyOverlayToList } from "../lib/overlay";

export default function useProducts(query) {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadToken, setReloadToken] = useState(0);

  const abortRef = useRef(null);
  const requestId = useRef(0);

  const fetchProducts = useCallback(async () => {
    const { page, limit, search, category, sort, order } = query;
    const skip = (page - 1) * limit;

    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const thisRequestId = ++requestId.current;
    setLoading(true);
    setError("");

    try {
      let result;
      if (search) {
        result = await productService.searchProducts({
          q: search,
          limit,
          skip,
          signal: controller.signal,
        });
        if (category) {
          const filtered = result.products.filter((p) => p.category === category);
          result = { ...result, products: filtered, total: filtered.length };
        }
      } else {
        result = await productService.getProducts({
          limit,
          skip,
          sortBy: sort || undefined,
          order: sort ? order : undefined,
          category: category || undefined,
          signal: controller.signal,
        });
      }

      if (sort) {
        const dir = order === "desc" ? -1 : 1;
        result = {
          ...result,
          products: [...result.products].sort((a, b) => {
            if (sort === "title") return dir * a.title.localeCompare(b.title);
            return dir * (Number(a[sort]) - Number(b[sort]));
          }),
        };
      }

      const withOverlay = applyOverlayToList(result, { skip });

      if (thisRequestId !== requestId.current) return;
      setProducts(withOverlay.products);
      setTotal(withOverlay.total);
    } catch (err) {
      if (err.isCancel) return;
      if (thisRequestId !== requestId.current) return;
      setError(err.message || "Something went wrong.");
      setProducts([]);
      setTotal(0);
    } finally {
      if (thisRequestId === requestId.current) setLoading(false);
    }
  }, [query.page, query.limit, query.search, query.category, query.sort, query.order]);

  useEffect(() => {
    fetchProducts();
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, [fetchProducts, reloadToken]);

  const retry = useCallback(() => setReloadToken((t) => t + 1), []);

  return { products, total, loading, error, retry, refetch: retry };
}
