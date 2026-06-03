import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { BillingToggle } from "@/components/billing-toggle";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Subscribe — Recreate It with your class",
  description:
    "Subscribe to unlock the full recreate kit for every parsha skit — printable scripts, costume & prop lists, and director's notes. Plans for rebbeim, moros, and whole schools.",
  path: "/subscribe",
});

export default async function SubscribePage() {
  return (
    <>
      <SiteHeader active="subscribe" />

      <section className="hero wrap">
        <div className="kicker">For rebbeim &amp; moros</div>
        <h1>Recreate every week&apos;s skit with your own class</h1>
        <p>
          Subscribe and unlock the full kit for every skit — scripts, costume
          lists, and director&apos;s notes — ready to print and perform.
        </p>
        <div className="heroact">
          <Link href="#plans" className="btn btn-pri btn-lg">
            View plans
          </Link>
          <Link href="/login" className="btn btn-ghost btn-lg">
            I already subscribe
          </Link>
        </div>
      </section>

      <section className="blk wrap">
        <div className="valuegrid">
          <div className="feature">
            <div className="ic">📄</div>
            <h3>Ready-to-print scripts</h3>
            <p>
              Full word-for-word scripts for every parsha skit, formatted for
              the classroom and sized to your class.
            </p>
          </div>
          <div className="feature">
            <div className="ic">🎭</div>
            <h3>Costume &amp; prop lists</h3>
            <p>
              Simple, low-cost costume and prop checklists so you can set the
              scene in minutes, not hours.
            </p>
          </div>
          <div className="feature">
            <div className="ic">🗒️</div>
            <h3>Director&apos;s notes</h3>
            <p>
              Staging tips, timing, and part assignments straight from the rebbi
              who created the original.
            </p>
          </div>
        </div>
      </section>

      <section className="blk wrap" id="plans">
        <div className="center" style={{ marginBottom: 30 }}>
          <div className="rule">simple pricing</div>
          <h2 style={{ fontSize: 38 }}>Choose your plan</h2>
        </div>
        <BillingToggle />
      </section>

      <section className="blk wrap">
        <div className="kit-preview">
          <div>
            <div className="rule left">inside a kit</div>
            <h2 style={{ fontSize: 34 }}>Here&apos;s exactly what you&apos;ll download</h2>
            <p className="lead" style={{ marginTop: 14 }}>
              Every skit&apos;s kit is the same simple bundle — open it Thursday,
              perform it by Friday.
            </p>
          </div>
          <div className="kit-list">
            <div className="kit-row">
              <span className="ic">📄</span>
              <div>
                <div className="t">Naso — Full Script</div>
                <div className="s">7 parts · 9 pages · PDF</div>
              </div>
            </div>
            <div className="kit-row">
              <span className="ic">🎭</span>
              <div>
                <div className="t">Costume &amp; Prop Checklist</div>
                <div className="s">1 page · printable</div>
              </div>
            </div>
            <div className="kit-row">
              <span className="ic">🗒️</span>
              <div>
                <div className="t">Director&apos;s Notes</div>
                <div className="s">Staging, timing &amp; part assignments</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="blk wrap">
        <div className="center" style={{ marginBottom: 14 }}>
          <div className="rule">questions</div>
          <h2 style={{ fontSize: 34 }}>Good to know</h2>
        </div>
        <div className="faq">
          <div className="qa">
            <h3>Is watching the skits free?</h3>
            <p>
              Yes — every weekly skit is free to watch for everyone. A
              subscription unlocks the downloadable kits (scripts, costumes,
              notes) so you can recreate them.
            </p>
          </div>
          <div className="qa">
            <h3>How often are new skits added?</h3>
            <p>
              A brand-new skit and kit goes up every week, before Shabbos, all
              year round.
            </p>
          </div>
          <div className="qa">
            <h3>Can I cancel anytime?</h3>
            <p>
              Of course. Cancel in one click from your account — you&apos;ll keep
              access through the end of your billing period.
            </p>
          </div>
          <div className="qa">
            <h3>Do you have a plan for a whole school?</h3>
            <p>
              Yes — the School plan covers up to 25 staff logins with a shared
              library. Reach out and we&apos;ll set it up.
            </p>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
