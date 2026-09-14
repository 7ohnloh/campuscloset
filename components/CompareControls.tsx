"use client";

import Link from "next/link";
import { MAX_COMPARE, toggleCompare, useCompareIds } from "./compareStore";

export function CompareNavLink() {
  const ids = useCompareIds();
  return (
    <Link href="/compare" className="rounded-full px-3 py-1.5 hover:bg-line/60">
      Compare{ids.length ? <span className="ml-1 rounded-full bg-ink px-1.5 text-xs text-paper">{ids.length}</span> : null}
    </Link>
  );
}

export function CompareToggle({ id }: { id: string }) {
  const ids = useCompareIds();
  const active = ids.includes(id);
  return (
    <button
      type="button"
      onClick={() => toggleCompare(id)}
      className={`rounded-full border px-4 py-2.5 text-sm font-medium transition ${
        active ? "border-ink bg-ink text-paper" : "border-line bg-card hover:border-ink"
      }`}
      aria-pressed={active}
    >
      {active ? "✓ In compare" : `+ Compare${ids.length >= MAX_COMPARE ? " (replaces oldest)" : ""}`}
    </button>
  );
}
