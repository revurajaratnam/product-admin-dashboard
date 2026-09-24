import axios from "axios";
import { getToken, clearAuth } from "./auth";

const api = axios.create({
  baseURL: "https://dummyjson.com",
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isCancel(error)) {
      return Promise.reject({ isCancel: true, message: "Request cancelled" });
    }

    const status = error.response?.status;
    let message = "Something went wrong. Please try again.";

    if (status === 401) {
      message = "Your session has expired. Please log in again.";
      clearAuth();
    } else if (status === 400) {
      message = error.response?.data?.message || "Invalid request.";
    } else if (status === 404) {
      message = "Not found.";
    } else if (!error.response) {
      message = "Network error. Check your connection and try again.";
    }

    if (process.env.NODE_ENV === "development") {
      console.error("[API ERROR]", status, error.message, error.config?.url);
    }

    return Promise.reject({ status, message, raw: error });
  }
);

export default api;
