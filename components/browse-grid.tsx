"use client";

import { useMemo, useState } from "react";
import type { Skit } from "@/lib/types";
import { CHUMASHIM, PARSHA_ORDER, groupByMonth } from "@/lib/types";
import { SkitCard } from "@/components/skit-card";
import { SearchIcon } from "@/components/icons";

type SortKey = "newest" | "oldest" | "views" | "parsha";

export function BrowseGrid({
  skits,
  initialQuery,
  initialChumash,
}: {
  skits: Skit[];
  initialQuery?: string;
  initialChumash?: string;
}) {
  const [query, setQuery] = useState(initialQuery ?? "");
  const [chumash, setChumash] = useState<string>(
    initialChumash && CHUMASHIM.includes(initialChumash as (typeof CHUMASHIM)[number])
      ? initialChumash
      : "All"
  );
  const [sort, setSort] = useState<SortKey>("newest");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = skits.filter((s) => {
      if (chumash !== "All" && s.chumash !== chumash) return false;
      if (q) {
        const hay = `${s.title} ${s.parsha}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    list = [...list].sort((a, b) => {
      switch (sort) {
        case "oldest":
          return (a.release_date ?? "").localeCompare(b.release_date ?? "");
        case "views":
          return (b.views ?? 0) - (a.views ?? 0);
        case "parsha": {
          const ai = PARSHA_ORDER.indexOf(a.parsha);
          const bi = PARSHA_ORDER.indexOf(b.parsha);
          return (
            (ai === -1 ? Number.MAX_SAFE_INTEGER : ai) -
            (bi === -1 ? Number.MAX_SAFE_INTEGER : bi)
          );
        }
        case "newest":
        default:
          return (b.release_date ?? "").localeCompare(a.release_date ?? "");
      }
    });

    return list;
  }, [skits, query, chumash, sort]);

  const groups = useMemo(() => groupByMonth(filtered), [filtered]);

  return (
    <>
      <div className="toolbar">
        <label className="bigsearch">
          <SearchIcon size={20} />
          <input
            placeholder="Search “korbanos”, “Naso”, “Chanukah”…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <select
          className="sortsel"
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
        >
          <option value="newest">Sort: Newest first</option>
          <option value="oldest">Sort: Oldest first</option>
          <option value="views">Sort: Most viewed</option>
          <option value="parsha">Sort: By parsha order</option>
        </select>
      </div>

      <div className="chips">
        <span
          className={chumash === "All" ? "chip on" : "chip"}
          onClick={() => setChumash("All")}
        >
          All
        </span>
        {CHUMASHIM.map((c) => (
          <span
            key={c}
            className={chumash === c ? "chip on" : "chip"}
            onClick={() => setChumash(c)}
          >
            {c}
          </span>
        ))}
      </div>

      {groups.length === 0 ? (
        <div className="empty">No skits match your search.</div>
      ) : (
        groups.map((g) => (
          <div key={g.label}>
            <div className="monthlabel">{g.label}</div>
            <div className="grid grid-4">
              {g.skits.map((s) => (
                <SkitCard key={s.id} skit={s} />
              ))}
            </div>
          </div>
        ))
      )}
    </>
  );
}
