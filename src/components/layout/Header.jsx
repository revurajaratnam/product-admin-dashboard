"use client";

import { getUser } from "../../lib/auth";
import { useEffect, useState } from "react";
import LogoutButton from "./LogoutButton";

export default function Header({ title = "Products" }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(getUser());
  }, []);

  return (
    <header className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 sm:px-6">
      <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
      <div className="flex items-center gap-3">
        {user && (
          <span className="hidden text-sm text-gray-600 sm:inline">
            Signed in as <strong className="font-medium">{user.username}</strong>
          </span>
        )}
        <LogoutButton />
      </div>
    </header>
  );
}
