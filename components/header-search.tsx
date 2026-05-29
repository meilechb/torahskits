"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { SearchIcon } from "./icons";

export function HeaderSearch({
  placeholder = "Search parsha or skit…",
}: {
  placeholder?: string;
}) {
  const router = useRouter();
  const [q, setQ] = useState("");

  return (
    <label className="header-search">
      <SearchIcon />
      <input
        placeholder={placeholder}
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            router.push(`/browse${q ? `?q=${encodeURIComponent(q)}` : ""}`);
          }
        }}
      />
    </label>
  );
}
