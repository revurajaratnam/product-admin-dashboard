"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import authService from "../services/authService";
import { saveAuth, clearAuth, getUser, isAuthenticated } from "../lib/auth";

export default function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const submitting = useRef(false);

  useEffect(() => {
    setUser(getUser());
  }, []);

  const login = useCallback(
    async (username, password) => {
      if (submitting.current) return;
      submitting.current = true;
      setLoading(true);
      setError("");
      try {
        const data = await authService.login(username, password);
        saveAuth(data.token, data);
        setUser(data);
        return true;
      } catch (err) {
        const message =
          err.status === 400 || err.status === 401
            ? "Invalid username or password."
            : err.message || "Login failed. Please try again.";
        setError(message);
        return false;
      } finally {
        setLoading(false);
        submitting.current = false;
      }
    },
    []
  );

  const logout = useCallback(() => {
    clearAuth();
    setUser(null);
    router.push("/login");
  }, [router]);

  return { user, loading, error, login, logout, isAuthenticated: isAuthenticated() };
}
