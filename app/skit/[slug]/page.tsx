import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getSkitBySlug, getRelatedSkits } from "@/lib/queries";
import { getCurrentProfile } from "@/lib/auth";
import { formatDate, hasKitAccess, youtubeThumb } from "@/lib/types";
import type { KitFileType } from "@/lib/types";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SkitCard } from "@/components/skit-card";
import { YouTubeEmbed } from "@/components/youtube-embed";
import { SITE_URL, SITE_NAME, pageMetadata, jsonLd } from "@/lib/seo";

const KIT_ICONS: Record<KitFileType, string> = {
  script: "📄",
  costumes: "🎭",
  notes: "🗒️",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const skit = await getSkitBySlug(slug);
  if (!skit) return { title: "Skit not found", robots: { index: false } };

  const description =
    skit.description ||
    `Watch the Parshas ${skit.parsha} skit${
      skit.performed_by ? `, performed by ${skit.performed_by}` : ""
    } — free on Torah Skits. Subscribe for the recreate kit.`;
  const image = skit.thumbnail_url || youtubeThumb(skit.youtube_id) || undefined;

  return pageMetadata({
    title: `${skit.title} — Parshas ${skit.parsha}`,
    description,
    path: `/skit/${skit.slug}`,
    type: "video.other",
    images: image ? [image] : undefined,
  });
}

export default async function SkitDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const skit = await getSkitBySlug(slug);
  if (!skit) notFound();

  const profile = await getCurrentProfile();
  if (skit.status !== "live" && profile?.role !== "admin") notFound();

  const canDownload = hasKitAccess(profile?.role);
  const related = await getRelatedSkits(skit.id, 4);
  const thumb = skit.thumbnail_url || youtubeThumb(skit.youtube_id);

  // ----- Structured data: VideoObject + breadcrumbs -----
  const videoLd = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: skit.title,
    description:
      skit.description || `A parsha skit for Parshas ${skit.parsha}.`,
    thumbnailUrl: thumb ? [thumb] : undefined,
    uploadDate: skit.release_date || skit.created_at,
    contentUrl: skit.youtube_id
      ? `https://www.youtube.com/watch?v=${skit.youtube_id}`
      : undefined,
    embedUrl: skit.youtube_id
      ? `https://www.youtube-nocookie.com/embed/${skit.youtube_id}`
      : undefined,
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "All Skits",
        item: `${SITE_URL}/browse`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: skit.title,
        item: `${SITE_URL}/skit/${skit.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(videoLd)}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(breadcrumbLd)}
      />
      <SiteHeader active="browse" />

      {/* ============ BIG VIDEO HEADER ============ */}
      <section className="skit-hero wrap">
        <div className="crumbs">
          <Link href="/">Home</Link> / <Link href="/browse">All Skits</Link> /{" "}
          {skit.parsha}
        </div>
        <div className="kicker">
          Parshas {skit.parsha}
          {skit.issue_number ? ` · Issue №${skit.issue_number}` : ""}
          {skit.hebrew_date ? ` · ${skit.hebrew_date}` : ""}
        </div>
        <h1>{skit.title}</h1>
        <div className="submeta">
          Parshas {skit.parsha} · {formatDate(skit.release_date)}
          {skit.performed_by ? ` · performed by ${skit.performed_by}` : ""}
        </div>

        {skit.youtube_id ? (
          <YouTubeEmbed
            youtubeId={skit.youtube_id}
            title={skit.title}
            tag={`Parshas ${skit.parsha}`}
            duration={skit.duration}
          />
        ) : (
          <div className="video hero-video">
            <div className="poster">
              <span className="tag">Parshas {skit.parsha}</span>
            </div>
          </div>
        )}
      </section>

      {/* ============ DETAILS + KIT ============ */}
      <div className="wrap">
        <div className="skit-layout">
          <div className="skit-main">
            {skit.description && (
              <>
                <div className="rule left">about this skit</div>
                <div className="skit-desc">{skit.description}</div>
              </>
            )}

            {skit.skit_cast && (
              <div className="skit-cast">
                <div className="lbl">Cast</div>
                {skit.skit_cast}
              </div>
            )}
          </div>

          <aside className="kit-side">
            <div className="panel pad">
              <h3 style={{ fontSize: 22, marginBottom: 18 }}>
                The recreate kit
              </h3>

              {canDownload ? (
                <div style={{ display: "grid", gap: 12 }}>
                  {skit.kit_files.length === 0 ? (
                    <p className="muted" style={{ fontSize: 14 }}>
                      Kit files are being prepared for this skit.
                    </p>
                  ) : (
                    skit.kit_files.map((f) => (
                      <a key={f.id} className="kit-dl" href={`/api/kit/${f.id}`}>
                        <span className="ic">{KIT_ICONS[f.type] ?? "📄"}</span>
                        <div className="t">{f.label ?? f.file_name}</div>
                        {f.meta && <div className="s">{f.meta}</div>}
                        <span className="go">Download PDF →</span>
                      </a>
                    ))
                  )}
                </div>
              ) : (
                <div className="locked-box">
                  <div className="lk">🔒</div>
                  <p style={{ color: "var(--ink-2)", marginBottom: 16 }}>
                    The recreate kit is for subscribers. Unlock the full script,
                    costume checklist, and director&apos;s notes to put this
                    skit on with your class.
                  </p>
                  <div
                    style={{
                      textAlign: "left",
                      margin: "0 auto 20px",
                      maxWidth: 240,
                    }}
                  >
                    <div className="kit-dl" style={{ marginBottom: 10 }}>
                      <span className="ic">📄</span>
                      <div className="t">Script</div>
                      <div className="s">Full parts &amp; lines</div>
                    </div>
                    <div className="kit-dl" style={{ marginBottom: 10 }}>
                      <span className="ic">🎭</span>
                      <div className="t">Costumes &amp; Props</div>
                      <div className="s">1-page checklist</div>
                    </div>
                    <div className="kit-dl">
                      <span className="ic">🗒️</span>
                      <div className="t">Director&apos;s Notes</div>
                      <div className="s">Staging &amp; timing</div>
                    </div>
                  </div>
                  <Link className="btn btn-pri btn-block" href="/subscribe">
                    Unlock the kit
                  </Link>
                  <p style={{ marginTop: 14, fontSize: 14 }}>
                    Already subscribe?{" "}
                    <Link href="/login" className="link-quiet">
                      Log in
                    </Link>
                  </p>
                </div>
              )}
            </div>
          </aside>
        </div>

        {related.length > 0 && (
          <section style={{ margin: "20px 0 40px" }}>
            <div className="sec-head">
              <h2>More skits</h2>
              <Link href="/browse">All skits →</Link>
            </div>
            <div className="grid grid-4">
              {related.map((s) => (
                <SkitCard key={s.id} skit={s} />
              ))}
            </div>
          </section>
        )}
      </div>
      <SiteFooter />
    </>
  );
}
