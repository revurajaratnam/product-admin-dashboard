"use client";

import { classNames } from "../../lib/utils";

export default function Select({ label, id, className = "", children, ...props }) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="mb-1 block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <select
        id={id}
        className={classNames(
          "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900",
          "focus:outline-none focus:ring-2 focus:ring-brand-500",
          className
        )}
        {...props}
      >
        {children}
      </select>
    </div>
  );
}
