import api from "../lib/axios";

const productService = {
  async getProducts({ limit, skip, sortBy, order, category, signal }) {
    const base = category ? `/products/category/${encodeURIComponent(category)}` : "/products";
    const { data } = await api.get(base, {
      params: { limit, skip, sortBy, order },
      signal,
    });
    return data;
  },

  async searchProducts({ q, limit, skip, signal }) {
    const { data } = await api.get("/products/search", {
      params: { q, limit, skip },
      signal,
    });
    return data;
  },

  async getCategories(signal) {
    const { data } = await api.get("/products/categories", { signal });
    return Array.isArray(data)
      ? data.map((c) => (typeof c === "string" ? { slug: c, name: c } : c))
      : [];
  },

  async getProduct(id, signal) {
    const { data } = await api.get(`/products/${id}`, { signal });
    return data;
  },

  async addProduct(payload) {
    const { data } = await api.post("/products/add", payload);
    return data;
  },

  async updateProduct(id, payload) {
    const { data } = await api.put(`/products/${id}`, payload);
    return data;
  },

  async deleteProduct(id) {
    const { data } = await api.delete(`/products/${id}`);
    return data;
  },
};

export default productService;
