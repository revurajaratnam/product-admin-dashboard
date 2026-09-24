"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { classNames } from "../../lib/utils";

const ToastContext = createContext(null);

const STYLES = {
  success: "bg-green-600",
  error: "bg-red-600",
  info: "bg-gray-800",
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const push = useCallback((message, type = "info") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => {
      setToasts((t) => t.filter((toast) => toast.id !== id));
    }, 3500);
  }, []);

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={classNames(
              "rounded-lg px-4 py-2.5 text-sm font-medium text-white shadow-lg",
              STYLES[t.type] || STYLES.info
            )}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
