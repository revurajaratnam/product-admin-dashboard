"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useProducts from "../../hooks/useProducts";
import { parseProductQuery, clampPage } from "../../lib/queryParams";
import { buildQueryString } from "../../lib/utils";
import ProductSearch from "../../components/products/ProductSearch";
import ProductFilters from "../../components/products/ProductFilters";
import ProductTable from "../../components/products/ProductTable";
import ProductGrid from "../../components/products/ProductGrid";
import ProductPagination from "../../components/products/ProductPagination";
import DeleteConfirmModal from "../../components/products/DeleteConfirmModal";
import Loader, { TableSkeleton } from "../../components/common/Loader";
import ErrorState from "../../components/common/ErrorState";
import EmptyState from "../../components/common/EmptyState";
import Button from "../../components/common/Button";
import productService from "../../services/productService";
import { recordDeleted } from "../../lib/overlay";
import { useToast } from "../../components/common/Toast";

function ProductsPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();

  const query = parseProductQuery(searchParams);
  const { products, total, loading, error, retry, refetch } = useProducts(query);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const totalPages = Math.max(1, Math.ceil(total / query.limit));

  const updateQuery = useCallback(
    (partial) => {
      const next = { ...query, ...partial };
      const qs = buildQueryString(next);
      router.replace(`/products${qs}`, { scroll: false });
    },
    [query, router]
  );

  useEffect(() => {
    if (loading || error) return;
    const clamped = clampPage(query.page, totalPages);
    if (clamped !== query.page) {
      updateQuery({ page: clamped });
    }
  }, [loading, error, total]);

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      if (!deleteTarget.__local) {
        await productService.deleteProduct(deleteTarget.id);
      }
      recordDeleted(deleteTarget.id);
      toast(`"${deleteTarget.title}" was deleted.`, "success");
      setDeleteTarget(null);

      if (products.length === 1 && query.page > 1) {
        updateQuery({ page: query.page - 1 });
      } else {
        refetch();
      }
    } catch (err) {
      toast(err.message || "Failed to delete product.", "error");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-end">
          <ProductSearch value={query.search} onChange={(v) => updateQuery({ search: v, page: 1 })} />
          <ProductFilters
            category={query.category}
            searchActive={Boolean(query.search)}
            onCategoryChange={(v) => updateQuery({ category: v, page: 1 })}
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        {loading && (
          <>
            <TableSkeleton />
            <div className="p-4 sm:hidden">
              <Loader label="Loading products..." size="sm" />
            </div>
          </>
        )}

        {!loading && error && <div className="p-4"><ErrorState message={error} onRetry={retry} /></div>}

        {!loading && !error && products.length === 0 && (
          <div className="p-4">
            <EmptyState
              title={query.search ? `No products found for "${query.search}"` : "No products found"}
              action={
                (query.search || query.category) && (
                  <Button variant="secondary" onClick={() => updateQuery({ search: "", category: "", page: 1 })}>
                    Clear Search
                  </Button>
                )
              }
            />
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <>
            <ProductTable
              products={products}
              sort={query.sort}
              order={query.order}
              onSortChange={(sort, order) => updateQuery({ sort, order, page: 1 })}
              onDeleteClick={setDeleteTarget}
            />
            <ProductGrid products={products} onDeleteClick={setDeleteTarget} />
            <ProductPagination
              page={query.page}
              limit={query.limit}
              total={total}
              onPageChange={(p) => updateQuery({ page: p })}
              onLimitChange={(l) => updateQuery({ limit: l, page: 1 })}
            />
          </>
        )}
      </div>

      <DeleteConfirmModal
        product={deleteTarget}
        loading={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<Loader label="Loading products..." />}>
      <ProductsPageInner />
    </Suspense>
  );
}
