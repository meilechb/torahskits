"use client";

import { useActionState } from "react";
import { saveSettings } from "@/lib/actions/admin";
import type { Settings } from "@/lib/types";

const RELEASE_DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];

export function SettingsForm({ settings }: { settings: Settings | null }) {
  const [state, action, pending] = useActionState(saveSettings, undefined);

  return (
    <form action={action} className="panel pad" style={{ maxWidth: 620 }}>
      <h3 className="card-title">Program details</h3>

      {state?.error && <div className="form-error">{state.error}</div>}
      {state?.ok && <div className="form-ok">{state.ok}</div>}

      <div className="field">
        <label htmlFor="program_name">Program name</label>
        <input
          className="input"
          id="program_name"
          name="program_name"
          defaultValue={settings?.program_name ?? "Torah Skits"}
        />
      </div>
      <div className="field">
        <label htmlFor="host_name">Rebbi / host name</label>
        <input
          className="input"
          id="host_name"
          name="host_name"
          defaultValue={settings?.host_name ?? ""}
        />
      </div>
      <div className="field">
        <label htmlFor="release_day">Release day</label>
        <select
          className="input"
          id="release_day"
          name="release_day"
          defaultValue={settings?.release_day ?? "Thursday"}
        >
          {RELEASE_DAYS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>
      <div className="field" style={{ marginBottom: 0 }}>
        <label htmlFor="weekly_email">Weekly email</label>
        <select
          className="input"
          id="weekly_email"
          name="weekly_email"
          defaultValue={settings?.weekly_email ? "on" : "off"}
        >
          <option value="on">On — send every release</option>
          <option value="off">Off</option>
        </select>
      </div>

      <button className="btn btn-pri" style={{ marginTop: 20 }} disabled={pending}>
        {pending ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}
