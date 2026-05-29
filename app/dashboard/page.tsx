import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth";
import {
  getLiveSkits,
  getUpcomingSkits,
  getSkitBySlug,
} from "@/lib/queries";
import { formatDate, hasKitAccess } from "@/lib/types";
import type { KitFileType } from "@/lib/types";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SkitCard } from "@/components/skit-card";
import { YouTubeEmbed } from "@/components/youtube-embed";
import { LogoutButton } from "@/components/logout-button";

export const metadata: Metadata = {
  title: "My Library — Torah Skits",
};

const KIT_ICONS: Record<KitFileType, string> = {
  script: "📄",
  costumes: "🎭",
  notes: "🗒️",
};

export default async function DashboardPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");

  const liveSkits = await getLiveSkits(4);
  const newest = liveSkits[0];
  const recent = liveSkits.slice(1, 4);
  const upcoming = await getUpcomingSkits(3);
  const canAccess = hasKitAccess(profile.role);

  // Fetch the newest skit's kit files for the "this week" card.
  const newestWithKit = newest ? await getSkitBySlug(newest.slug) : null;
  const kitFiles = newestWithKit?.kit_files ?? [];

  const planLabel = profile.plan || profile.role;

  return (
    <>
      <SiteHeader active="dashboard" />

      <div className="wrap">
        <div className="welcome">
          <div className="kicker">
            Welcome back, {profile.full_name || profile.email}
          </div>
          <h1>Your skit library</h1>
          <p>
            This week&apos;s kit is ready to download. Print it, assign the
            parts, and you&apos;re set for Friday.
          </p>
        </div>

        <div className="dash">
          {/* MAIN */}
          <div>
            {newest ? (
              <div className="thisweek">
                <div className="ribbon">
                  ★ New this week · Parshas {newest.parsha}
                </div>
                {newest.youtube_id ? (
                  <YouTubeEmbed
                    youtubeId={newest.youtube_id}
                    title={newest.title}
                    duration={newest.duration}
                  />
                ) : null}
                <div className="body">
                  <h2>{newest.title}</h2>
                  <div className="meta">
                    Parshas {newest.parsha} · {formatDate(newest.release_date)}
                    {newest.performed_by ? ` · ${newest.performed_by}` : ""}
                  </div>
                  <div className="rule left" style={{ margin: "0 0 16px" }}>
                    your recreate kit
                  </div>
                  <div className="kit-actions">
                    {canAccess ? (
                      kitFiles.length > 0 ? (
                        kitFiles.map((f) => (
                          <a
                            key={f.id}
                            className="kit-dl"
                            href={`/api/kit/${f.id}`}
                          >
                            <span className="ic">
                              {KIT_ICONS[f.type] ?? "📄"}
                            </span>
                            <div className="t">{f.label ?? f.file_name}</div>
                            {f.meta && <div className="s">{f.meta}</div>}
                            <span className="go">Download PDF →</span>
                          </a>
                        ))
                      ) : (
                        <p className="muted" style={{ fontSize: 14 }}>
                          Kit files are being prepared for this skit.
                        </p>
                      )
                    ) : (
                      <>
                        <Link className="kit-dl" href="/subscribe">
                          <span className="ic">🔒</span>
                          <div className="t">Script</div>
                          <div className="s">Full parts &amp; lines</div>
                          <span className="go">Subscribe to unlock →</span>
                        </Link>
                        <Link className="kit-dl" href="/subscribe">
                          <span className="ic">🔒</span>
                          <div className="t">Costumes &amp; Props</div>
                          <div className="s">1-page checklist</div>
                          <span className="go">Subscribe to unlock →</span>
                        </Link>
                        <Link className="kit-dl" href="/subscribe">
                          <span className="ic">🔒</span>
                          <div className="t">Director&apos;s Notes</div>
                          <div className="s">Staging &amp; timing</div>
                          <span className="go">Subscribe to unlock →</span>
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="panel pad">
                <p className="muted">No skits are live yet — check back soon.</p>
              </div>
            )}

            <div className="sec-head" style={{ margin: "44px 0 24px" }}>
              <h2>Recently unlocked</h2>
              <Link href="/browse">Browse all →</Link>
            </div>
            <div className="grid grid-3">
              {recent.map((skit) => (
                <SkitCard key={skit.id} skit={skit} />
              ))}
            </div>
          </div>

          {/* SIDE */}
          <aside className="side">
            <div className="panel pad">
              <h3 style={{ fontSize: 18, marginBottom: 14 }}>
                Your subscription
              </h3>
              <div className="acct-row">
                <span className="k">Plan</span>
                <span className="v" style={{ textTransform: "capitalize" }}>
                  {planLabel}
                </span>
              </div>
              <div className="acct-row">
                <span className="k">Renews</span>
                <span className="v">—</span>
              </div>
              <div className="acct-row">
                <span className="k">Kits unlocked</span>
                <span className="v">{liveSkits.length}</span>
              </div>
              {canAccess ? (
                <a
                  href="#"
                  className="btn btn-ghost btn-block btn-sm"
                  style={{ marginTop: 16 }}
                >
                  Manage subscription
                </a>
              ) : (
                <Link
                  href="/subscribe"
                  className="btn btn-pri btn-block btn-sm"
                  style={{ marginTop: 16 }}
                >
                  Unlock recreate kits
                </Link>
              )}
              <div style={{ marginTop: 14, textAlign: "center" }}>
                <LogoutButton />
              </div>
            </div>

            <div className="panel pad">
              <h3 style={{ fontSize: 18, marginBottom: 16 }}>Coming up</h3>
              {upcoming.length === 0 ? (
                <p className="muted" style={{ fontSize: 14 }}>
                  Nothing scheduled just yet.
                </p>
              ) : (
                upcoming.map((skit, i) => (
                  <div
                    key={skit.id}
                    className="mini"
                    style={
                      i === upcoming.length - 1 ? { marginBottom: 0 } : undefined
                    }
                  >
                    <div className="th">
                      <span className="num">{skit.parsha}</span>
                    </div>
                    <div>
                      <div className="t">{skit.title}</div>
                      <div className="s">Drops {formatDate(skit.release_date)}</div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div
              className="panel pad"
              style={{
                background: "var(--dark)",
                color: "var(--paper)",
                border: "none",
              }}
            >
              <h3
                style={{
                  fontSize: 18,
                  color: "var(--cream)",
                  marginBottom: 8,
                }}
              >
                Put on the skit?
              </h3>
              <p
                style={{
                  color: "#cdbd9e",
                  fontSize: 14,
                  marginBottom: 16,
                }}
              >
                Film your class&apos;s version and send it in — we&apos;ll
                feature it on the site.
              </p>
              <Link href="/submit" className="btn btn-gold btn-block btn-sm">
                Submit your skit
              </Link>
            </div>
          </aside>
        </div>
      </div>

      <SiteFooter />
    </>
  );
}
