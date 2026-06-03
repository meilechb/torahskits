import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SubmitForm } from "@/components/submit-form";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Submit your skit",
  description:
    "Recreated a parsha skit with your class? Send us your video — we'll feature classroom recreations from rebbeim and moros around the world.",
  path: "/submit",
});

export default async function SubmitPage() {
  return (
    <>
      <SiteHeader />

      <section className="hero wrap">
        <div className="kicker">Share it forward</div>
        <h1>Submit your class&apos;s skit</h1>
        <p>
          Recreated one of our skits with your class? Send it our way — we love
          featuring talmidim bringing the parsha to life.
        </p>
      </section>

      <section className="blk wrap-narrow">
        <div className="panel pad">
          <SubmitForm />
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
