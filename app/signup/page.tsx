import type { Metadata } from "next";
import Link from "next/link";
import { SignupForm } from "@/components/signup-form";

export const metadata: Metadata = {
  title: "Create your account",
  description: "Create a free Torah Skits account to watch every weekly parsha skit.",
  robots: { index: false, follow: false },
};

export default function SignupPage() {
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
          <div className="kicker">Create your free account</div>
          <h2>A new parsha skit every week</h2>
          <p>
            Sign up free to watch every weekly skit and explore the full
            back-catalog. It only takes a moment.
          </p>
          <ul>
            <li>Watch every weekly skit</li>
            <li>The complete back-catalog of past skits</li>
            <li>Weekly email when the new skit drops</li>
          </ul>
        </div>

        {/* FORM SIDE */}
        <div className="formside">
          <div className="authcard">
            <div className="top">
              <h1>Create your account</h1>
              <div className="sub">Free to watch — start in seconds.</div>
            </div>

            <div className="admin-note">
              <span>ℹ️</span>
              <span>
                Recreate-kit (paid) downloads are unlocked by our team after
                signup while payments are being set up.
              </span>
            </div>

            <SignupForm />

            <div className="foot-note">
              Already have an account? <Link href="/login">Log in</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
