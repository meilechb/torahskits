"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Profile } from "@/lib/types";

const MANAGE = [
  { href: "/admin", label: "Dashboard", icon: "▤", exact: true },
  { href: "/admin/skits", label: "All skits", icon: "▶", exact: false },
  { href: "/admin/upload", label: "Upload skit", icon: "＋", exact: false },
];

const AUDIENCE = [
  { href: "/admin/subscribers", label: "Subscribers", icon: "✦", exact: false },
  { href: "/admin/settings", label: "Settings", icon: "⚙", exact: false },
];

function initials(name: string | null, email: string): string {
  const source = (name || email || "").trim();
  if (!source) return "?";
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return source.slice(0, 2).toUpperCase();
}

export function Sidebar({ profile }: { profile: Profile | null }) {
  const pathname = usePathname();

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");

  const name = profile?.full_name || profile?.email || "Admin";

  return (
    <aside className="sidebar">
      <Link className="logo" href="/">
        <span className="mk">ת</span>Torah Skits
      </Link>

      <div className="side-sec">Manage</div>
      {MANAGE.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`navitem${isActive(item.href, item.exact) ? " on" : ""}`}
        >
          <span className="ic">{item.icon}</span> {item.label}
        </Link>
      ))}

      <div className="side-sec">Audience</div>
      {AUDIENCE.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`navitem${isActive(item.href, item.exact) ? " on" : ""}`}
        >
          <span className="ic">{item.icon}</span> {item.label}
        </Link>
      ))}

      <div className="bottom">
        <div className="me">
          <span className="av">{initials(profile?.full_name ?? null, profile?.email ?? "")}</span>
          <div>
            <div className="nm">{name}</div>
            <div className="rl">Admin</div>
          </div>
        </div>
        <Link
          href="/"
          className="navitem"
          style={{ fontSize: 13, padding: "8px 12px" }}
        >
          ↩ Back to site
        </Link>
      </div>
    </aside>
  );
}
