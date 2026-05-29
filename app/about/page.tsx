import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata = {
  title: "About — Torah Skits",
};

export default async function AboutPage() {
  return (
    <>
      <SiteHeader active="about" />

      <section className="hero wrap">
        <div className="kicker">Our story</div>
        <h1>The parsha, brought to life by the kids who live it</h1>
        <p>
          Torah Skits began in one classroom — and grew into a weekly skit
          watched at Shabbos tables everywhere.
        </p>
      </section>

      <section className="blk wrap">
        <div className="story">
          <div className="portrait">
            <div className="ph">[ photo of the rebbi &amp; class ]</div>
          </div>
          <div>
            <div className="rule left">meet the rebbi</div>
            <h2>It started with one Friday skit</h2>
            <p>
              Years ago, Rabbi Friedman&apos;s 5th-grade class put on a little
              skit about the week&apos;s parsha. The kids loved it. The parents
              loved it more. So they did it again the next week — and never
              stopped.
            </p>
            <p>
              What began as a Friday tradition became a weekly recording, then a
              library, and now a resource that rebbeim and moros around the
              world use to bring the parsha to life with their own classes.
            </p>
            <p>
              Every skit is still made the same way: real kids, a simple script,
              and a parsha they&apos;ll never forget.
            </p>
          </div>
        </div>
      </section>

      <section className="blk wrap">
        <div className="mission">
          <div className="rule">our mission</div>
          <h2>
            To make every child fall in love with the parsha — by living it, not
            just learning it.
          </h2>
        </div>
      </section>

      <section className="blk wrap">
        <div className="center" style={{ marginBottom: 34 }}>
          <div className="rule">what we believe</div>
          <h2 style={{ fontSize: 34 }}>How we make skits</h2>
        </div>
        <div className="vals">
          <div className="feature">
            <div className="ic">👧</div>
            <h3>Kids first</h3>
            <p>
              Every skit is performed by real talmidim. The parsha sticks
              because they lived the story themselves.
            </p>
          </div>
          <div className="feature">
            <div className="ic">✂️</div>
            <h3>Keep it simple</h3>
            <p>
              Simple scripts, simple costumes, simple props — so any class can
              recreate it without a big production.
            </p>
          </div>
          <div className="feature">
            <div className="ic">🤝</div>
            <h3>Share it forward</h3>
            <p>
              We hand every rebbi the full kit so the skit doesn&apos;t stop
              here — it travels to classrooms everywhere.
            </p>
          </div>
        </div>
      </section>

      <section className="blk wrap">
        <div className="center" style={{ marginBottom: 26 }}>
          <div className="rule">the journey</div>
        </div>
        <div className="timeline">
          <div className="tl">
            <div className="yr">2019</div>
            <div>
              <div className="t">The first Friday skit</div>
              <div className="s">One 5th-grade class, one parsha, one camcorder.</div>
            </div>
          </div>
          <div className="tl">
            <div className="yr">2021</div>
            <div>
              <div className="t">Recording every week</div>
              <div className="s">
                Parents asked to watch from home — so we started posting them.
              </div>
            </div>
          </div>
          <div className="tl">
            <div className="yr">2023</div>
            <div>
              <div className="t">Scripts for rebbeim</div>
              <div className="s">
                Other teachers wanted to recreate them, so we shared the kits.
              </div>
            </div>
          </div>
          <div className="tl">
            <div className="yr">2026</div>
            <div>
              <div className="t">38 skits &amp; counting</div>
              <div className="s">
                A full weekly library, watched and recreated across the world.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="blk wrap">
        <div className="stat-row">
          <div className="stat">
            <div className="n">38+</div>
            <div className="l">skits &amp; counting</div>
          </div>
          <div className="stat">
            <div className="n">7</div>
            <div className="l">years of skits</div>
          </div>
          <div className="stat">
            <div className="n">12k</div>
            <div className="l">weekly viewers</div>
          </div>
          <div className="stat">
            <div className="n">140+</div>
            <div className="l">classes recreating</div>
          </div>
        </div>
      </section>

      <section className="blk wrap">
        <div className="band endcta">
          <div className="kicker" style={{ color: "var(--gold-bright)" }}>
            join in
          </div>
          <h2 style={{ margin: "12px 0 8px" }}>
            Bring this week&apos;s skit to your class
          </h2>
          <p style={{ maxWidth: 520, margin: "0 auto 22px" }}>
            Watch the newest skit free, or subscribe for the full kit and put it
            on yourself.
          </p>
          <div
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link href="/" className="btn btn-gold btn-lg">
              Watch this week
            </Link>
            <Link
              href="/subscribe"
              className="btn btn-ghost btn-lg"
              style={{ borderColor: "var(--gold-soft)", color: "var(--cream)" }}
            >
              See subscriber plans
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
