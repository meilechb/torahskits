import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SubmitForm } from "@/components/submit-form";

export const metadata = {
  title: "Submit your skit — Torah Skits",
};

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
