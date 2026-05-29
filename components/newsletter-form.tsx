"use client";

import { useActionState } from "react";
import { subscribeNewsletter } from "@/lib/actions/public";

export function NewsletterForm() {
  const [state, action, pending] = useActionState(subscribeNewsletter, undefined);
  return (
    <form action={action} className="news-form">
      {state?.error && (
        <div className="form-error" style={{ flexBasis: "100%" }}>
          {state.error}
        </div>
      )}
      {state?.ok && (
        <div className="form-ok" style={{ flexBasis: "100%" }}>
          {state.ok}
        </div>
      )}
      <input type="email" name="email" placeholder="you@email.com" required />
      <button className="btn btn-gold" disabled={pending}>
        {pending ? "…" : "Sign me up"}
      </button>
    </form>
  );
}
