"use client";

import { useMemo, useState } from "react";
import { capitalise } from "@/lib/catalogue";
import type { Listing, SearchResponse } from "@/lib/types";
import { ListingCard } from "./ListingCard";

const EXAMPLES = [
  "hall formal dress under $30",
  "warm jacket for my winter exchange",
  "interview outfit for guys",
  "comfy oversized stuff for lectures",
  "Y2K jeans, waist around 30",
];

export function SearchExperience({
  listings,
  sellerNames,
  categories,
}: {
  listings: Listing[];
  sellerNames: Record<string, string>;
  categories: string[];
}) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<SearchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);

  const byId = useMemo(() => new Map(listings.map((l) => [l.id, l])), [listings]);

  async function search(q: string) {
    const trimmed = q.trim();
    if (!trimmed || loading) return;
    setQuery(trimmed);
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) setError(data?.error ?? "Search failed. Please try again.");
      else setResponse(data as SearchResponse);
    } catch {
      setError("Couldn't reach search. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  function clear() {
    setResponse(null);
    setQuery("");
    setError(null);
  }

  const browseListings = listings
    .filter((l) => !category || l.category === category)
    .sort((a, b) => a.listed_days_ago - b.listed_days_ago);

  return (
    <div>
      <section className="mx-auto max-w-3xl px-4 pt-8 pb-6 text-center sm:pt-14">
        <h1 className="font-display text-4xl leading-tight sm:text-5xl">The campus flea market for pre-loved clothes</h1>
        <p className="mt-3 text-muted">
          Browse stalls from students clearing out their wardrobes. Describe what you need and we&apos;ll find it.
        </p>

        <form
          role="search"
          className="mt-6 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            search(query);
          }}
        >
          <label htmlFor="search" className="sr-only">
            Describe what you&apos;re looking for
          </label>
          <input
            id="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            maxLength={300}
            placeholder="Describe it, e.g. black blazer for interviews under $40"
            className="min-w-0 flex-1 rounded-2xl border border-line bg-card px-4 py-3.5 text-base shadow-sm outline-none focus:border-ink"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="rounded-2xl bg-accent px-5 py-3.5 font-medium text-white disabled:opacity-50"
          >
            {loading ? "…" : "Search"}
          </button>
        </form>

        <div className="mt-3 flex flex-wrap justify-center gap-2">
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => search(ex)}
              disabled={loading}
              className="rounded-full border border-line bg-card px-3 py-1.5 text-xs hover:border-ink disabled:opacity-50"
            >
              {ex}
            </button>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16" aria-live="polite">
        {error && <p className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p>}

        {loading && (
          <div className="mb-4 flex items-center gap-2 text-sm text-muted">
            <span className="h-2 w-2 animate-ping rounded-full bg-accent" />
            Reading your request and checking every stall…
          </div>
        )}

        {response ? (
          <>
            <div className="mb-4 rounded-2xl border border-line bg-card p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium tracking-wide text-muted uppercase">
                    {response.mode === "ai" ? "✨ AI search understood" : "Keyword search"}
                  </p>
                  <p className="mt-1 font-medium">{response.summary}</p>
                </div>
                <button type="button" onClick={clear} className="shrink-0 text-sm underline underline-offset-2">
                  Clear
                </button>
              </div>
              {response.chips.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {response.chips.map((c) => (
                    <span key={c} className="rounded-full bg-paper px-2.5 py-1 text-xs">
                      {c}
                    </span>
                  ))}
                </div>
              )}
              {response.notice && <p className="mt-3 rounded-lg bg-amber-50 p-2 text-sm text-amber-900">{response.notice}</p>}
            </div>

            {response.results.length === 0 ? (
              <p className="py-10 text-center text-muted">
                Nothing in the stalls matches that yet. Try describing it differently, or{" "}
                <button type="button" onClick={clear} className="underline">
                  browse everything
                </button>
                .
              </p>
            ) : (
              <>
                <p className="mb-3 text-sm text-muted">
                  {response.results.length} match{response.results.length === 1 ? "" : "es"}
                </p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
                  {response.results.map((r) => {
                    const l = byId.get(r.id);
                    return l ? <ListingCard key={r.id} listing={l} reason={r.reason} /> : null;
                  })}
                </div>
              </>
            )}
          </>
        ) : (
          <>
            <div className="-mx-4 mb-4 flex gap-2 overflow-x-auto px-4 pb-1">
              {[null, ...categories].map((c) => (
                <button
                  key={c ?? "all"}
                  type="button"
                  onClick={() => setCategory(c)}
                  className={`shrink-0 rounded-full border px-3.5 py-1.5 text-sm ${
                    category === c ? "border-ink bg-ink text-paper" : "border-line bg-card hover:border-ink"
                  }`}
                >
                  {c ? capitalise(c) : "All"}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
              {browseListings.map((l) => (
                <ListingCard key={l.id} listing={l} sellerName={sellerNames[l.stall_id]} />
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
