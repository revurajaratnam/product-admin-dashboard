"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { classNames } from "../../lib/utils";

const LINKS = [
  { href: "/products", label: "Products" },
  { href: "/products/new", label: "Add Product" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="w-full shrink-0 border-b border-gray-200 bg-white sm:w-56 sm:border-b-0 sm:border-r sm:min-h-screen">
      <div className="px-4 py-4">
        <span className="text-base font-bold text-brand-600">Admin Dashboard</span>
      </div>
      <ul className="flex gap-1 overflow-x-auto px-2 pb-2 sm:flex-col sm:overflow-visible sm:px-3">
        {LINKS.map((link) => {
          const active = pathname === link.href;
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className={classNames(
                  "block whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium",
                  active
                    ? "bg-brand-50 text-brand-700"
                    : "text-gray-600 hover:bg-gray-100"
                )}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
