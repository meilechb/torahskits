"use client";

import { useState } from "react";
import Link from "next/link";

export function BillingToggle() {
  const [yearly, setYearly] = useState(false);
  const per = yearly ? " / year" : " / month";

  return (
    <>
      <div className="billing-toggle">
        <div className="tabs">
          <button
            type="button"
            className={!yearly ? "on" : undefined}
            onClick={() => setYearly(false)}
          >
            Monthly
          </button>
          <button
            type="button"
            className={yearly ? "on" : undefined}
            onClick={() => setYearly(true)}
          >
            Yearly · save 28%
          </button>
        </div>
      </div>
      <div className="plans">
        <div className="plan">
          <div className="pname">Free</div>
          <div className="pdesc">For families watching along</div>
          <div className="amt">$0</div>
          <ul>
            <li>Watch every weekly skit</li>
            <li>Full back-catalog to watch</li>
            <li>Weekly email</li>
          </ul>
          <Link href="/signup" className="btn btn-ghost btn-block btn-lg">
            Create free account
          </Link>
        </div>
        <div className="plan feat">
          <span className="ribbon badge gold">Most popular</span>
          <div className="pname">Rebbi</div>
          <div className="pdesc">Everything to recreate in class</div>
          <div className="amt">
            {yearly ? "$69" : "$8"}
            <span>{per}</span>
          </div>
          <ul>
            <li>Everything in Free</li>
            <li>Full script for every skit</li>
            <li>Costume &amp; prop lists</li>
            <li>Director&apos;s notes &amp; staging</li>
            <li>New kit every week before Shabbos</li>
          </ul>
          <Link href="/signup" className="btn btn-pri btn-block btn-lg">
            Start subscribing
          </Link>
        </div>
        <div className="plan">
          <div className="pname">School</div>
          <div className="pdesc">For a whole faculty</div>
          <div className="amt">
            {yearly ? "$349" : "$39"}
            <span>{per}</span>
          </div>
          <ul>
            <li>Everything in Rebbi</li>
            <li>Up to 25 staff logins</li>
            <li>Shared school skit library</li>
            <li>Priority new-skit requests</li>
          </ul>
          <Link href="/submit" className="btn btn-ghost btn-block btn-lg">
            Contact us
          </Link>
        </div>
      </div>
    </>
  );
}
