"use client";

import { useActionState } from "react";
import { login } from "@/lib/actions/auth";

export function LoginForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <form action={action}>
      <input type="hidden" name="next" value={next ?? ""} />

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
          autoComplete="current-password"
          required
        />
      </div>
      <div className="row-between">
        <label className="checkrow">
          <input type="checkbox" name="remember" /> Remember me
        </label>
        <a href="#">Forgot password?</a>
      </div>
      <button
        type="submit"
        className="btn btn-pri btn-block btn-lg"
        disabled={pending}
      >
        {pending ? "Logging in…" : "Log in"}
      </button>
      <div className="divider">or</div>
      <button type="button" className="altbtn" disabled>
        Continue with Google
      </button>
    </form>
  );
}
