"use client";

import useAuth from "../../hooks/useAuth";
import Button from "../common/Button";

export default function LogoutButton() {
  const { logout } = useAuth();
  return (
    <Button variant="secondary" onClick={logout} aria-label="Log out">
      Logout
    </Button>
  );
}
