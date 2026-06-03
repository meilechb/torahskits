import type { Metadata } from "next";

/** Canonical site origin (the domain the user owns). */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://torahskits.com";

export const SITE_NAME = "Torah Skits";

export const DEFAULT_DESCRIPTION =
  "A new parsha skit every week — to watch with your family, and to recreate with your class. Free to watch; subscribe for the full recreate kit (script, costumes & director's notes).";

export const SITE_KEYWORDS = [
  "Torah skits",
  "parsha skit",
  "parsha play",
  "weekly parsha",
  "chinuch",
  "rebbi resources",
  "classroom parsha",
  "Jewish education",
  "kids Torah videos",
  "parsha video",
];

/**
 * Build a Metadata object for a public page with sensible Open Graph /
 * Twitter defaults and a canonical URL.
 */
export function pageMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path = "/",
  images,
  type = "website",
  noindex = false,
}: {
  title: string;
  description?: string;
  path?: string;
  images?: string[];
  type?: "website" | "article" | "video.other" | "profile";
  noindex?: boolean;
}): Metadata {
  const url = `${SITE_URL}${path}`;
  const ogImages = images?.length
    ? images
    : [`${SITE_URL}/opengraph-image`];
  return {
    title,
    description,
    alternates: { canonical: url },
    robots: noindex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: type === "video.other" ? "video.other" : type,
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImages,
    },
  };
}

/** Render a JSON-LD <script> for structured data. */
export function jsonLd(data: Record<string, unknown>) {
  return {
    __html: JSON.stringify(data),
  };
}
