"use client";

import { useActionState } from "react";
import { signup } from "@/lib/actions/auth";

export function SignupForm() {
  const [state, action, pending] = useActionState(signup, undefined);

  return (
    <form action={action}>
      {state?.error && (
        <div
          className="admin-note form-error"
          style={{ background: "#f6e2dd", color: "var(--burg)" }}
        >
          <span>⚠️</span>
          <span>{state.error}</span>
        </div>
      )}

      <div className="field">
        <label htmlFor="full_name">Full name</label>
        <input
          id="full_name"
          className="input"
          type="text"
          name="full_name"
          placeholder="Your name"
          autoComplete="name"
        />
      </div>
      <div className="field">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          className="input"
          type="email"
          name="email"
          placeholder="you@email.com"
          autoComplete="email"
          required
        />
      </div>
      <div className="field">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          className="input"
          type="password"
          name="password"
          placeholder="••••••••"
          autoComplete="new-password"
          required
        />
        <div className="help">At least 6 characters.</div>
      </div>
      <button
        type="submit"
        className="btn btn-pri btn-block btn-lg"
        disabled={pending}
      >
        {pending ? "Creating account…" : "Create account"}
      </button>
      <div className="divider">or</div>
      <button type="button" className="altbtn" disabled>
        Continue with Google
      </button>
    </form>
  );
}
