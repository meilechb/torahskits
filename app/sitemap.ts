import type { MetadataRoute } from "next";
import { getLiveSkits } from "@/lib/queries";
import { SITE_URL } from "@/lib/seo";

export const revalidate = 3600; // refresh hourly

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/browse`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/subscribe`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/about`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${SITE_URL}/submit`, changeFrequency: "yearly", priority: 0.4 },
  ];

  let skitRoutes: MetadataRoute.Sitemap = [];
  try {
    const skits = await getLiveSkits();
    skitRoutes = skits.map((s) => ({
      url: `${SITE_URL}/skit/${s.slug}`,
      lastModified: new Date(s.updated_at),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  } catch {
    // If the DB is unreachable at build time, still emit the static routes.
  }

  return [...staticRoutes, ...skitRoutes];
}
