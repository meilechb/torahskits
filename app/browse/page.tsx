import { getLiveSkits } from "@/lib/queries";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { BrowseGrid } from "@/components/browse-grid";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "All Skits",
  description:
    "Browse every weekly parsha skit, newest first. Search by name or parsha, or filter by chumash — free to watch, with recreate kits for subscribers.",
  path: "/browse",
});

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; chumash?: string }>;
}) {
  const sp = await searchParams;
  const skits = await getLiveSkits();

  return (
    <>
      <SiteHeader active="browse" />
      <div className="wrap">
        <div className="page-head">
          <h1>All skits</h1>
          <p>
            Every parsha skit, newest first. Search by name or parsha, or filter
            by chumash.
          </p>
        </div>
        <BrowseGrid
          skits={skits}
          initialQuery={sp.q}
          initialChumash={sp.chumash}
        />
      </div>
      <SiteFooter />
    </>
  );
}
