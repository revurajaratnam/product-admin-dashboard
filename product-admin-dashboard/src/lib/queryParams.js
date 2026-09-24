import { safeInt } from "./utils";

export const ALLOWED_LIMITS = [10, 20, 50];
export const ALLOWED_SORTS = ["price", "rating", "title"];
export const ALLOWED_ORDERS = ["asc", "desc"];

export const DEFAULT_QUERY = {
  page: 1,
  limit: 20,
  search: "",
  category: "",
  sort: "",
  order: "asc",
};

export function parseProductQuery(searchParams) {
  const page = safeInt(searchParams.get("page"), DEFAULT_QUERY.page, { min: 1 });

  const rawLimit = safeInt(searchParams.get("limit"), DEFAULT_QUERY.limit);
  const limit = ALLOWED_LIMITS.includes(rawLimit) ? rawLimit : DEFAULT_QUERY.limit;

  const search = (searchParams.get("search") || "").trim();

  const category = (searchParams.get("category") || "").trim();

  const rawSort = searchParams.get("sort") || "";
  const sort = ALLOWED_SORTS.includes(rawSort) ? rawSort : "";

  const rawOrder = searchParams.get("order") || DEFAULT_QUERY.order;
  const order = ALLOWED_ORDERS.includes(rawOrder) ? rawOrder : DEFAULT_QUERY.order;

  return { page, limit, search, category, sort, order };
}

export function clampPage(page, totalPages) {
  if (totalPages <= 0) return 1;
  if (page > totalPages) return totalPages;
  if (page < 1) return 1;
  return page;
}
