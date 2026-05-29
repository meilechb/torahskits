"use client";

import { logout } from "@/lib/actions/auth";

export function LogoutButton() {
  return (
    <form action={logout}>
      <button type="submit" className="link-quiet" style={{ cursor: "pointer", background: "none", border: "none" }}>
        Log out
      </button>
    </form>
  );
}
