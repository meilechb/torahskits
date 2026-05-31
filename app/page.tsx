import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SkitCard } from "@/components/skit-card";
import { YouTubeEmbed } from "@/components/youtube-embed";
import { NewsletterForm } from "@/components/newsletter-form";
import { PlayIcon } from "@/components/icons";
import { getLiveSkits, getChumashCounts, getMostRecentSkit } from "@/lib/queries";
import { CHUMASHIM } from "@/lib/types";

export default async function Home() {
  const skits = await getLiveSkits(5);
  const [hero, ...rest] = skits;
  const library = rest.slice(0, 4);
  const counts = await getChumashCounts();
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const kitHref = hero ? `/skit/${hero.slug}` : "/login";

  return (
    <>
      <SiteHeader active="home" />

      {/* ============ HERO : THIS WEEK ============ */}
      <section className="hero wrap">
        {hero ? (
          <>
            <div className="kicker">
              This Week · Issue №{hero.issue_number ?? "—"}
              {hero.hebrew_date ? ` · ${hero.hebrew_date}` : ""}
            </div>
            <h1>{hero.title}</h1>
            <div className="by">
              Parshas {hero.parsha}
              {hero.performed_by ? ` · performed by ${hero.performed_by}` : ""}
            </div>
            <div className="rule">✦</div>
            {hero.youtube_id ? (
              <YouTubeEmbed
                youtubeId={hero.youtube_id}
                title={hero.title}
                tag={`Parshas ${hero.parsha}`}
                duration={hero.duration}
              />
            ) : (
              <div className="video hero-video">
                <div className="poster">
                  <div className="play-btn">
                    <PlayIcon size={32} />
                  </div>
                </div>
                <span className="tag">Parshas {hero.parsha}</span>
                {hero.duration && <span className="dur">{hero.duration}</span>}
              </div>
            )}
            <div className="heroact">
              <Link href={`/skit/${hero.slug}`} className="btn btn-pri btn-lg">
                <PlayIcon size={18} /> Watch this week&apos;s skit
              </Link>
              <Link href="/subscribe" className="btn btn-ghost btn-lg">
                Recreate it with your class
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="kicker">This Week</div>
            <h1>A new parsha skit, every week</h1>
            <div className="by">The first skit is on its way — check back soon.</div>
            <div className="rule">✦</div>
            <div className="heroact">
              <Link href="/subscribe" className="btn btn-pri btn-lg">
                See subscriber plans
              </Link>
            </div>
          </>
        )}
      </section>

      {/* ============ FROM THE LIBRARY ============ */}
      {library.length > 0 && (
        <section className="blk wrap">
          <div className="sec-head">
            <h2>From the library</h2>
            <Link href="/browse">Browse all {total} skits →</Link>
          </div>
          <div className="grid grid-4">
            {library.map((skit) => (
              <SkitCard key={skit.id} skit={skit} />
            ))}
          </div>
        </section>
      )}

      {/* ============ HOW IT WORKS ============ */}
      <section className="blk wrap">
        <div className="center" style={{ marginBottom: 34 }}>
          <div className="rule">how it works</div>
          <h2 style={{ fontSize: 38 }}>One parsha. One skit. Every week.</h2>
          <p className="lead" style={{ margin: "14px auto 0" }}>
            A new skit goes up before every Shabbos — watch with your family, or
            recreate it with your own class.
          </p>
        </div>
        <div className="how">
          <div className="feature">
            <div className="ic">▶</div>
            <div className="step-n">Step 01</div>
            <h3>Watch the weekly skit</h3>
            <p>
              Every parsha comes to life in a short, kid-made skit — free to
              watch, new every week, all year round.
            </p>
          </div>
          <div className="feature">
            <div className="ic">✦</div>
            <div className="step-n">Step 02</div>
            <h3>Subscribe for the kit</h3>
            <p>
              Subscribers unlock the full script, costume &amp; prop list, and
              director&apos;s notes for every single skit.
            </p>
          </div>
          <div className="feature">
            <div className="ic">★</div>
            <div className="step-n">Step 03</div>
            <h3>Recreate it with your class</h3>
            <p>
              Print the script, assign the parts, and put on the skit yourself.
              Film it and send it back — we&apos;ll feature it.
            </p>
          </div>
        </div>
      </section>

      {/* ============ RECREATE FEATURE ============ */}
      <section className="blk wrap">
        <div className="recreate">
          <div className="left">
            <div className="kicker" style={{ color: "var(--gold-bright)" }}>
              For rebbeim
            </div>
            <h2 style={{ marginTop: 14 }}>
              Everything you need to put it on yourself
            </h2>
            <p>
              Each week&apos;s skit comes with a complete, classroom-ready kit.
              Open it, print it, and your class can perform it that same day.
            </p>
            <ul>
              <li>Full word-for-word script, sized for your class</li>
              <li>Costume &amp; prop checklist — all simple, all cheap</li>
              <li>Director&apos;s notes &amp; staging tips from the rebbi</li>
              <li>Suggested parts for 6–12 talmidim</li>
            </ul>
            <Link href="/subscribe" className="btn btn-gold btn-lg">
              See what subscribers get →
            </Link>
          </div>
          <div className="right">
            <Link className="kit-row" href={kitHref}>
              <span className="ic">📄</span>
              <div>
                <div className="t">The Script</div>
                <div className="s">7 parts · 9 pages · PDF</div>
              </div>
              <span className="dl">Download</span>
            </Link>
            <Link className="kit-row" href={kitHref}>
              <span className="ic">🎭</span>
              <div>
                <div className="t">Costumes &amp; Props</div>
                <div className="s">Printable checklist</div>
              </div>
              <span className="dl">Download</span>
            </Link>
            <Link className="kit-row" href={kitHref}>
              <span className="ic">🗒️</span>
              <div>
                <div className="t">Director&apos;s Notes</div>
                <div className="s">Staging &amp; timing tips</div>
              </div>
              <span className="dl">Download</span>
            </Link>
            <div className="help center" style={{ marginTop: 4 }}>
              🔒 Free to watch · kit downloads for subscribers
            </div>
          </div>
        </div>
      </section>

      {/* ============ BROWSE BY CHUMASH ============ */}
      <section className="blk wrap">
        <div className="sec-head">
          <h2>Browse by chumash</h2>
          <Link href="/browse">All parshiyos →</Link>
        </div>
        <div className="books">
          {CHUMASHIM.filter((c) => c !== "Yom Tov").map((name) => (
            <Link
              key={name}
              className="book"
              href={`/browse?chumash=${encodeURIComponent(name)}`}
            >
              <div className="bn">{name}</div>
              <div className="bc">{counts[name] ?? 0} skits</div>
            </Link>
          ))}
        </div>
      </section>

      {/* ============ SUBSCRIBE CTA ============ */}
      <section className="blk wrap">
        <div className="subcta">
          <div>
            <div className="rule left">become a subscriber</div>
            <h2 style={{ fontSize: 38 }}>Get every week&apos;s skit kit, all year.</h2>
            <p className="lead" style={{ marginTop: 14 }}>
              New skit kits land in your subscriber library before every Shabbos.
              Scripts, costumes, and notes — ready to print, ready to perform.
              Cancel anytime.
            </p>
            <div style={{ marginTop: 24, display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link href="/subscribe" className="btn btn-pri btn-lg">
                View plans
              </Link>
              <Link href="/login" className="btn btn-ghost btn-lg">
                I&apos;m already a subscriber
              </Link>
            </div>
          </div>
          <div className="price-card">
            <span className="badge gold">Most popular</span>
            <div style={{ margin: "16px 0 4px" }} className="muted">
              Full season access
            </div>
            <div className="amt">
              $8<span> / month</span>
            </div>
            <ul>
              <li>Every weekly skit kit, all year</li>
              <li>Full scripts, costumes &amp; notes</li>
              <li>The complete back-catalog ({total}+ skits)</li>
              <li>New kit every week before Shabbos</li>
            </ul>
            <Link href="/subscribe" className="btn btn-pri btn-block btn-lg">
              Start subscribing
            </Link>
            <div className="help center" style={{ marginTop: 12 }}>
              Or $69 / year — best value
            </div>
          </div>
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section className="blk wrap">
        <div className="center" style={{ marginBottom: 30 }}>
          <div className="rule">from the kahal</div>
        </div>
        <div className="quotes">
          <div className="quote">
            <p>
              “My class begs for skit day every week. I print the script Thursday
              night and we&apos;re performing by Friday morning. It&apos;s the best
              chinuch tool I have.”
            </p>
            <div className="who">
              Rabbi Y. Friedman <span>· 4th grade rebbi, Lakewood</span>
            </div>
          </div>
          <div className="quote">
            <p>
              “My kids re-watch their parsha skit at the Shabbos table and act it
              out for the whole family. They remember the parsha all week.”
            </p>
            <div className="who">
              Mrs. Brachfeld <span>· parent, Monsey</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============ STATS ============ */}
      <section className="blk wrap">
        <div className="stat-row">
          <div className="stat">
            <div className="n">{total}+</div>
            <div className="l">skits &amp; counting</div>
          </div>
          <div className="stat">
            <div className="n">52</div>
            <div className="l">new skits a year</div>
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

      {/* ============ NEWSLETTER ============ */}
      <section className="blk wrap">
        <div className="band newsletter">
          <div className="kicker" style={{ color: "var(--gold-bright)" }}>
            never miss a week
          </div>
          <h2 style={{ margin: "12px 0 6px" }}>
            Get the new skit in your inbox every Thursday
          </h2>
          <p style={{ maxWidth: 520, margin: "0 auto" }}>
            One email a week — the new parsha skit, plus a heads-up when the kit
            is ready to download.
          </p>
          <NewsletterForm />
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
