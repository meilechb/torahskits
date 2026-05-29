"use client";

import { useActionState, useState } from "react";
import { saveSkit } from "@/lib/actions/admin";
import {
  CHUMASHIM,
  formatDate,
  parseYouTubeId,
  youtubeThumb,
  type KitFile,
  type KitFileType,
  type Skit,
} from "@/lib/types";

const KIT_INPUTS: { type: KitFileType; icon: string; label: string }[] = [
  { type: "script", icon: "📄", label: "Script (PDF)" },
  { type: "costumes", icon: "🎭", label: "Costumes" },
  { type: "notes", icon: "🗒️", label: "Notes" },
];

export function SkitForm({
  skit,
  kitFiles = [],
}: {
  skit?: Skit;
  kitFiles?: KitFile[];
}) {
  const [state, action, pending] = useActionState(saveSkit, undefined);

  // Live-preview state
  const [title, setTitle] = useState(skit?.title ?? "");
  const [parsha, setParsha] = useState(skit?.parsha ?? "");
  const [date, setDate] = useState(skit?.release_date ?? "");
  const [yt, setYt] = useState(skit?.youtube_id ?? "");

  // Track chosen file names per kit type + thumbnail
  const [fileNames, setFileNames] = useState<Record<string, string>>({});

  const existingByType = new Map(kitFiles.map((k) => [k.type, k]));

  const ytId = parseYouTubeId(yt);
  const previewThumb = ytId ? youtubeThumb(ytId) : skit?.thumbnail_url ?? null;

  return (
    <form action={action} className="upload-grid">
      {/* hidden id (edit mode) + intent (set by buttons) */}
      {skit?.id && <input type="hidden" name="id" value={skit.id} />}

      {/* LEFT: form panels */}
      <div>
        {state?.error && <div className="form-error">{state.error}</div>}

        <div className="panel pad" style={{ marginBottom: 20 }}>
          <h3 className="card-title">1 · The video</h3>
          <div className="field">
            <label htmlFor="youtube_id">YouTube link</label>
            <input
              className="input"
              id="youtube_id"
              name="youtube_id"
              placeholder="https://youtube.com/watch?v=…"
              defaultValue={skit?.youtube_id ?? ""}
              onChange={(e) => setYt(e.target.value)}
            />
          </div>
          <div className="embed-note">
            <span>✦</span>
            <span>
              We embed the video on the skit page and pull the thumbnail from
              YouTube.
            </span>
          </div>
        </div>

        <div className="panel pad" style={{ marginBottom: 20 }}>
          <h3 className="card-title">2 · Skit details</h3>
          <div className="field">
            <label htmlFor="title">Title</label>
            <input
              className="input"
              id="title"
              name="title"
              defaultValue={skit?.title ?? ""}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="two-col">
            <div className="field">
              <label htmlFor="parsha">Parsha</label>
              <input
                className="input"
                id="parsha"
                name="parsha"
                placeholder="e.g. Naso"
                defaultValue={skit?.parsha ?? ""}
                onChange={(e) => setParsha(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="chumash">Chumash</label>
              <select
                className="input"
                id="chumash"
                name="chumash"
                defaultValue={skit?.chumash ?? ""}
              >
                <option value="">—</option>
                {CHUMASHIM.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="two-col">
            <div className="field">
              <label htmlFor="release_date">Date / week</label>
              <input
                className="input"
                id="release_date"
                name="release_date"
                type="date"
                defaultValue={skit?.release_date ?? ""}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="issue_number">Issue #</label>
              <input
                className="input"
                id="issue_number"
                name="issue_number"
                type="number"
                defaultValue={skit?.issue_number ?? ""}
              />
            </div>
          </div>
          <div className="two-col">
            <div className="field">
              <label htmlFor="hebrew_date">Hebrew date</label>
              <input
                className="input"
                id="hebrew_date"
                name="hebrew_date"
                placeholder="e.g. כ״ה סיון"
                defaultValue={skit?.hebrew_date ?? ""}
              />
            </div>
            <div className="field">
              <label htmlFor="duration">Duration</label>
              <input
                className="input"
                id="duration"
                name="duration"
                placeholder="e.g. 4:32"
                defaultValue={skit?.duration ?? ""}
              />
            </div>
          </div>
          <div className="field">
            <label htmlFor="description">Description</label>
            <textarea
              className="input"
              id="description"
              name="description"
              placeholder="What's this week's skit about?"
              defaultValue={skit?.description ?? ""}
            />
          </div>
          <div className="two-col" style={{ marginBottom: 0 }}>
            <div className="field" style={{ marginBottom: 0 }}>
              <label htmlFor="skit_cast">Cast (optional)</label>
              <input
                className="input"
                id="skit_cast"
                name="skit_cast"
                placeholder="Narrator, Kohen, Nazir…"
                defaultValue={skit?.skit_cast ?? ""}
              />
            </div>
            <div className="field" style={{ marginBottom: 0 }}>
              <label htmlFor="performed_by">Performed by (optional)</label>
              <input
                className="input"
                id="performed_by"
                name="performed_by"
                placeholder="Grade 5"
                defaultValue={skit?.performed_by ?? ""}
              />
            </div>
          </div>
        </div>

        <div className="panel pad" style={{ marginBottom: 20 }}>
          <h3 className="card-title">3 · The recreate kit</h3>
          <div className="filedrops">
            {KIT_INPUTS.map(({ type, icon, label }) => {
              const chosen = fileNames[type];
              const existing = existingByType.get(type);
              const has = Boolean(chosen || existing);
              return (
                <label
                  key={type}
                  className={`filedrop${has ? " has" : ""}`}
                  htmlFor={`kit-${type}`}
                >
                  <span className="ic">{icon}</span>
                  {chosen
                    ? chosen
                    : existing
                      ? `✓ ${existing.file_name}`
                      : `＋ ${label}`}
                  <input
                    id={`kit-${type}`}
                    type="file"
                    name={type}
                    accept="application/pdf"
                    onChange={(e) =>
                      setFileNames((prev) => ({
                        ...prev,
                        [type]: e.target.files?.[0]?.name ?? "",
                      }))
                    }
                  />
                </label>
              );
            })}
          </div>
          <div className="help">
            Subscribers download these from the skit page &amp; their library.
          </div>

          <div className="field" style={{ marginTop: 18, marginBottom: 0 }}>
            <label htmlFor="thumbnail">Thumbnail image (optional)</label>
            <input
              className="input"
              id="thumbnail"
              name="thumbnail"
              type="file"
              accept="image/*"
            />
          </div>
        </div>

        <div className="pubrow">
          <button
            className="btn btn-pri btn-lg"
            name="intent"
            value="publish"
            disabled={pending}
          >
            ✓ Publish now
          </button>
          <button
            className="btn btn-ghost btn-lg"
            name="intent"
            value="draft"
            disabled={pending}
          >
            Save draft
          </button>
          <button
            className="btn btn-ghost btn-lg"
            name="intent"
            value="schedule"
            disabled={pending}
          >
            ⏱ Schedule
          </button>
        </div>
      </div>

      {/* RIGHT: live preview */}
      <div className="preview-card">
        <div className="kicker" style={{ marginBottom: 12 }}>
          Live preview
        </div>
        <span className="card" style={{ pointerEvents: "none", display: "block" }}>
          <span className="th" style={{ display: "block" }}>
            {previewThumb ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewThumb}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <span className="pl">
                <span className="play-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              </span>
            )}
            <span className="num">{parsha || "Parsha"}</span>
          </span>
          <h3>{title || "Untitled skit"}</h3>
          <div className="dt">{date ? formatDate(date) : "Coming soon"}</div>
        </span>
        <div className="help center" style={{ marginTop: 14 }}>
          ↑ how it&apos;ll appear in the library
        </div>
      </div>
    </form>
  );
}
