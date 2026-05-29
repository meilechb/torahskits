import Link from "next/link";
import { getCurrentProfile } from "@/lib/auth";
import { HeaderSearch } from "./header-search";

type NavKey = "home" | "browse" | "subscribe" | "about" | "dashboard";

function initials(name: string | null, email: string): string {
  const base = (name || email).trim();
  const parts = base.split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return base.slice(0, 2).toUpperCase();
}

export async function SiteHeader({ active }: { active?: NavKey }) {
  const profile = await getCurrentProfile();
  const loggedIn = !!profile;
  const isAdmin = profile?.role === "admin";

  return (
    <header className="site-header">
      <div className="bar">
        <Link className="logo" href="/">
          <span className="mk">ת</span>Torah Skits
        </Link>
        <nav className="nav">
          <Link href="/" className={active === "home" ? "active" : undefined}>
            Home
          </Link>
          <Link href="/browse" className={active === "browse" ? "active" : undefined}>
            All Skits
          </Link>
          {loggedIn ? (
            <Link
              href="/dashboard"
              className={active === "dashboard" ? "active" : undefined}
            >
              My Library
            </Link>
          ) : (
            <Link
              href="/subscribe"
              className={active === "subscribe" ? "active" : undefined}
            >
              Recreate It
            </Link>
          )}
          <Link href="/about" className={active === "about" ? "active" : undefined}>
            About
          </Link>
        </nav>
        <HeaderSearch />
        <div className="header-actions">
          {loggedIn ? (
            <>
              {isAdmin && (
                <Link className="link-quiet" href="/admin">
                  Admin
                </Link>
              )}
              <Link className="avatar" href="/dashboard" title="My library">
                {initials(profile.full_name, profile.email)}
              </Link>
            </>
          ) : (
            <>
              <Link className="link-quiet" href="/login">
                Log in
              </Link>
              <Link className="btn btn-pri btn-sm" href="/subscribe">
                Subscribe
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
