"use client";

import { useActionState } from "react";
import { submitSkit } from "@/lib/actions/public";

export function SubmitForm() {
  const [state, action, pending] = useActionState(submitSkit, undefined);
  return (
    <form action={action}>
      {state?.error && <div className="form-error">{state.error}</div>}
      {state?.ok && <div className="form-ok">{state.ok}</div>}
      <div className="field">
        <label htmlFor="submitter_name">Your name</label>
        <input
          className="input"
          id="submitter_name"
          name="submitter_name"
          placeholder="Rabbi Y. Friedman"
          required
        />
      </div>
      <div className="field">
        <label htmlFor="email">Email</label>
        <input
          className="input"
          id="email"
          name="email"
          type="email"
          placeholder="you@email.com"
          required
        />
      </div>
      <div className="field">
        <label htmlFor="school">School (optional)</label>
        <input
          className="input"
          id="school"
          name="school"
          placeholder="Your school or yeshiva"
        />
      </div>
      <div className="field">
        <label htmlFor="parsha">Parsha (optional)</label>
        <input
          className="input"
          id="parsha"
          name="parsha"
          placeholder="e.g. Naso"
        />
      </div>
      <div className="field">
        <label htmlFor="video_url">Video link (optional)</label>
        <input
          className="input"
          id="video_url"
          name="video_url"
          placeholder="YouTube, Google Drive, or Dropbox link"
        />
        <div className="help">Upload your video somewhere and paste the link.</div>
      </div>
      <div className="field">
        <label htmlFor="message">Message</label>
        <textarea
          className="input"
          id="message"
          name="message"
          placeholder="Tell us about your class's skit…"
        />
      </div>
      <button className="btn btn-pri btn-lg btn-block" disabled={pending}>
        {pending ? "Sending…" : "Submit your skit"}
      </button>
    </form>
  );
}
