import { Suspense } from "react";
import LoginForm from "../../components/auth/LoginForm";

export const metadata = { title: "Log In — Product Admin Dashboard" };

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="mb-1 text-xl font-bold text-gray-900">Product Admin Dashboard</h1>
        <p className="mb-6 text-sm text-gray-500">Sign in to manage your product catalog.</p>
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
