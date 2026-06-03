import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/login-form";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to your Torah Skits account.",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <div className="login-shell">
      <div className="topbar">
        <Link className="logo" href="/">
          <span className="mk">ת</span>Torah Skits
        </Link>
      </div>

      <div className="auth">
        {/* PROMO SIDE */}
        <div className="promo">
          <div className="kicker">Welcome back</div>
          <h2>Your weekly skit kit is waiting</h2>
          <p>
            Log in to download this week&apos;s script, costume list, and
            director&apos;s notes — and recreate the skit with your class.
          </p>
          <ul>
            <li>This week&apos;s full kit, ready to print</li>
            <li>The complete library of past skits</li>
            <li>New kit every week before Shabbos</li>
          </ul>
        </div>

        {/* FORM SIDE */}
        <div className="formside">
          <div className="authcard">
            <div className="top">
              <h1>Log in</h1>
              <div className="sub">Welcome back to Torah Skits.</div>
            </div>

            <div className="admin-note">
              <span>ℹ️</span>
              <span>
                Demo: admin@torahskits.com · rebbi@torahskits.com ·
                family@torahskits.com — password TorahSkits2026!
              </span>
            </div>

            <LoginForm next={next} />

            <div className="foot-note">
              New here? <Link href="/signup">Create an account</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
