"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useAuth from "../../hooks/useAuth";
import Input from "../common/Input";
import Button from "../common/Button";
import { validateLogin, hasErrors } from "../../lib/validation";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, loading, error } = useAuth();
  const [form, setForm] = useState({ username: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({});

  async function handleSubmit(e) {
    e.preventDefault();
    const errors = validateLogin(form);
    setFieldErrors(errors);
    if (hasErrors(errors)) return;

    const ok = await login(form.username.trim(), form.password);
    if (ok) {
      const destination = searchParams.get("from") || "/products";
      router.push(destination);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <Input
        id="username"
        label="Username"
        value={form.username}
        onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
        error={fieldErrors.username}
        autoComplete="username"
        placeholder="emilys"
      />
      <Input
        id="password"
        label="Password"
        type="password"
        value={form.password}
        onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
        error={fieldErrors.password}
        autoComplete="current-password"
        placeholder="emilyspass"
      />

      {error && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <Button type="submit" loading={loading} className="w-full">
        {loading ? "Logging in..." : "Log In"}
      </Button>

      <p className="text-center text-xs text-gray-400">
        Demo credentials: admin / admin123
      </p>
    </form>
  );
}
