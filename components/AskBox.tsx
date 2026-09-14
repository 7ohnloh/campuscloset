"use client";

import Link from "next/link";
import { useState } from "react";
import type { AskResponse } from "@/lib/types";
import { GarmentArt } from "./GarmentArt";

export function AskBox({
  listingIds,
  suggestions,
  heading = "Ask about this item",
  sellerName,
}: {
  listingIds: string[];
  suggestions: string[];
  heading?: string;
  sellerName?: string;
}) {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [asked, setAsked] = useState<string | null>(null);
  const [result, setResult] = useState<AskResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sellerPinged, setSellerPinged] = useState(false);

  async function ask(q: string) {
    const trimmed = q.trim();
    if (!trimmed || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setSellerPinged(false);
    setAsked(trimmed);
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: trimmed, listingIds }),
      });
      const data = await res.json();
      if (data?.answer) setResult(data as AskResponse);
      else setError(data?.error ?? "Something went wrong. Please try again.");
    } catch {
      setError("Couldn't reach the assistant. Check your connection and try again.");
    } finally {
      setLoading(false);
      setQuestion("");
    }
  }

  return (
    <section className="rounded-2xl border border-line bg-card p-4 sm:p-5" aria-labelledby="ask-heading">
      <div className="flex items-center gap-2">
        <span aria-hidden className="text-lg">✨</span>
        <h2 id="ask-heading" className="font-display text-xl">
          {heading}
        </h2>
      </div>
      <p className="mt-1 text-sm text-muted">Answers use only what&apos;s in the listings, and say when something isn&apos;t stated.</p>

      <div className="mt-3 flex flex-wrap gap-2">
        {suggestions.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => ask(s)}
            disabled={loading}
            className="rounded-full border border-line bg-paper px-3 py-1.5 text-left text-xs hover:border-ink disabled:opacity-50"
          >
            {s}
          </button>
        ))}
      </div>

      <form
        className="mt-3 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          ask(question);
        }}
      >
        <label htmlFor="ask-input" className="sr-only">
          Your question
        </label>
        <input
          id="ask-input"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          maxLength={500}
          placeholder="e.g. Will this fit if I'm 170cm?"
          className="min-w-0 flex-1 rounded-xl border border-line bg-paper px-3 py-2.5 text-base outline-none focus:border-ink sm:text-sm"
        />
        <button
          type="submit"
          disabled={loading || !question.trim()}
          className="rounded-xl bg-ink px-4 py-2.5 text-sm font-medium text-paper disabled:opacity-40"
        >
          Ask
        </button>
      </form>

      <div aria-live="polite">
        {loading && (
          <p className="mt-4 animate-pulse text-sm text-muted">Checking the listing{listingIds.length === 1 ? "" : "s"}…</p>
        )}
        {error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p>}
        {result && (
          <div className="mt-4 space-y-3">
            {asked && <p className="text-sm text-muted">“{asked}”</p>}
            <p
              className={`rounded-xl p-3 text-sm leading-relaxed whitespace-pre-line ${
                result.mode === "ai" ? "bg-paper" : "bg-amber-50 text-amber-900"
              }`}
            >
              {result.answer}
            </p>

            {result.unknowns.length > 0 && (
              <div className="rounded-xl border border-dashed border-line p-3">
                <p className="text-xs font-medium tracking-wide text-muted uppercase">Not stated in the listing</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {result.unknowns.map((u) => (
                    <span key={u} className="rounded-full bg-line/60 px-2 py-0.5 text-xs">
                      {u}
                    </span>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setSellerPinged(true)}
                  className="mt-3 text-sm font-medium text-accent underline underline-offset-2"
                >
                  Ask {sellerName ?? "the seller"} (simulated)
                </button>
                {sellerPinged && (
                  <p className="mt-2 text-xs text-muted">
                    Demo only: in a real app this would message {sellerName ?? "the seller"}. No message was sent.
                  </p>
                )}
              </div>
            )}

            {result.cited.length > 0 && listingIds.length !== 1 && (
              <div>
                <p className="text-xs font-medium tracking-wide text-muted uppercase">Based on</p>
                <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
                  {result.cited.map((c) => (
                    <Link
                      key={c.id}
                      href={`/listings/${c.id}`}
                      className="flex w-44 shrink-0 items-center gap-2 rounded-xl border border-line p-2 hover:border-ink"
                    >
                      <GarmentArt garment={c.garment} hex={c.colour_hex} label={c.title} className="h-12 w-12 shrink-0 rounded-lg" />
                      <span className="min-w-0">
                        <span className="line-clamp-2 text-xs font-medium">{c.title}</span>
                        <span className="text-xs text-muted">${c.price_sgd}</span>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
