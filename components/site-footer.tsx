import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="inner">
        <div>
          <Link className="logo" href="/">
            <span className="mk">ת</span>Torah Skits
          </Link>
          <p>
            A new parsha skit every week — to watch with your family, and to
            recreate with your class.
          </p>
        </div>
        <div>
          <h4>Explore</h4>
          <Link href="/">Home</Link>
          <Link href="/browse">All skits</Link>
          <Link href="/browse">By chumash</Link>
          <Link href="/about">About</Link>
        </div>
        <div>
          <h4>For rebbeim</h4>
          <Link href="/subscribe">Subscribe</Link>
          <Link href="/login">Subscriber login</Link>
          <Link href="/subscribe">What&apos;s in a kit</Link>
          <Link href="/submit">Submit your skit</Link>
        </div>
        <div>
          <h4>Account</h4>
          <Link href="/login">Log in</Link>
          <Link href="/signup">Create account</Link>
          <Link href="/admin">Admin portal</Link>
          <Link href="/about">Contact</Link>
        </div>
      </div>
      <div className="legal">
        <span>© {new Date().getFullYear()} Torah Skits. All rights reserved.</span>
        <span>Privacy · Terms</span>
      </div>
    </footer>
  );
}
