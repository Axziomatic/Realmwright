"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { globalSearch, type SearchResult } from "@/app/actions/search";
import { useAppStore } from "@/store/appStore";

function typeLabel(t: SearchResult["type"]) {
  switch (t) {
    case "location":
      return "Location";
    case "npc":
      return "NPC";
    case "item":
      return "Item";
    case "god":
      return "God";
  }
}

export default function GlobalSearchBar() {
  const selectedWorld = useAppStore((s) => s.selectedWorld);
  const worldId = selectedWorld?.id;

  const pathname = usePathname();

  const [value, setValue] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [results, setResults] = React.useState<SearchResult[]>([]);
  const boxRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    // close results on route change
    setOpen(false);
  }, [pathname]);

  React.useEffect(() => {
    function onDocMouseDown(e: MouseEvent) {
      if (!boxRef.current) return;
      if (!boxRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, []);

  React.useEffect(() => {
    if (!worldId) {
      setResults([]);
      setOpen(false);
      return;
    }

    const q = value.trim();
    if (q.length === 0) {
      setResults([]);
      setOpen(false);
      return;
    }

    setLoading(true);
    const t = window.setTimeout(async () => {
      try {
        const res = await globalSearch(worldId, q);
        setResults(res);
        setOpen(true);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => window.clearTimeout(t);
  }, [value, worldId]);

  const disabled = !worldId;

  const inputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const isK = e.key.toLowerCase() === "k";
      const isMod = e.metaKey || e.ctrlKey;
      if (isMod && isK) {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div ref={boxRef} className="relative w-full">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-70" />
        <input
          value={value}
          ref={inputRef}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => {
            if (!disabled && results.length > 0) setOpen(true);
          }}
          placeholder={disabled ? "Select a world to search..." : "Search..."}
          disabled={disabled}
          className="w-full bg-transparent pl-9 pr-3 py-2 text-sm outline-none focus:ring-0"
        />
      </div>

      {open ? (
        <div className="absolute left-0 right-0 mt-2 overflow-hidden rounded-2xl border border-border-secondary bg-background-card shadow-[0_20px_60px_-20px_rgba(0,0,0,0.8)]">
          <div className="px-3 py-2 text-xs text-foreground-secondary border-b border-border-secondary">
            {loading ? "Searching..." : `${results.length} result(s)`}
          </div>

          {results.length === 0 && !loading ? (
            <div className="px-3 py-3 text-sm text-foreground-secondary">
              No results.
            </div>
          ) : (
            <ul className="max-h-[340px] overflow-auto">
              {results.map((r) => (
                <li key={`${r.type}:${r.id}`}>
                  <Link
                    href={r.href}
                    onClick={() => setOpen(false)}
                    className="flex items-start justify-between gap-4 px-3 py-2 text-sm hover:bg-background-muted"
                  >
                    <div className="min-w-0">
                      <div className="truncate text-foreground-primary">
                        {r.title}
                      </div>
                      {r.subtitle ? (
                        <div className="truncate text-xs text-foreground-secondary">
                          {r.subtitle}
                        </div>
                      ) : null}
                    </div>

                    <span className="shrink-0 rounded-xl border border-border-secondary px-2 py-0.5 text-xs text-foreground-secondary">
                      {typeLabel(r.type)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}
