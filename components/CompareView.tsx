"use client";

import Link from "next/link";
import { CONDITION_LABEL, capitalise, formatMeasurements } from "@/lib/catalogue";
import type { Listing } from "@/lib/types";
import { AskBox } from "./AskBox";
import { clearCompare, toggleCompare, useCompareIds } from "./compareStore";
import { GarmentArt } from "./GarmentArt";

const ROWS: { label: string; value: (l: Listing) => string | null }[] = [
  { label: "Price", value: (l) => `$${l.price_sgd}` },
  { label: "Size", value: (l) => l.size_label },
  { label: "Measurements", value: (l) => formatMeasurements(l.measurements_cm) },
  { label: "Material", value: (l) => l.material },
  { label: "Condition", value: (l) => CONDITION_LABEL[l.condition] },
  { label: "Flaws", value: (l) => (l.flaws === "none" ? "None (per seller)" : l.flaws) },
  { label: "Good for", value: (l) => l.occasion.join(", ") },
  { label: "Meetup", value: (l) => l.meetup },
];

export function CompareView({ listings }: { listings: Listing[] }) {
  const ids = useCompareIds();
  const items = ids.map((id) => listings.find((l) => l.id === id)).filter((l): l is Listing => Boolean(l));

  if (items.length < 2) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <h1 className="font-display text-3xl">Compare items</h1>
        <p className="mt-3 text-muted">
          Add at least two items using the <strong>+ Compare</strong> button on any listing, then ask the assistant which suits you
          better.
        </p>
        {items.length === 1 && <p className="mt-2 text-sm">You have 1 item so far: {items[0].title}.</p>}
        <Link href="/" className="mt-6 inline-block rounded-full bg-ink px-5 py-2.5 text-sm text-paper">
          Browse listings
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl">Compare</h1>
        <button type="button" onClick={clearCompare} className="text-sm underline underline-offset-2">
          Clear all
        </button>
      </div>

      <div className="mt-4 overflow-x-auto rounded-2xl border border-line bg-card">
        <table className="w-full min-w-[34rem] text-sm">
          <thead>
            <tr>
              <th className="w-28 p-3" />
              {items.map((l) => (
                <th key={l.id} className="p-3 text-left align-top font-normal">
                  <GarmentArt garment={l.garment} hex={l.colour_hex} label={l.title} className="aspect-square w-full max-w-40 rounded-xl" />
                  <Link href={`/listings/${l.id}`} className="mt-2 block font-medium hover:underline">
                    {l.title}
                  </Link>
                  <button type="button" onClick={() => toggleCompare(l.id)} className="mt-1 text-xs text-muted underline">
                    Remove
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.label} className="border-t border-line">
                <th scope="row" className="p-3 text-left align-top font-normal text-muted">
                  {row.label}
                </th>
                {items.map((l) => {
                  const v = row.value(l);
                  return (
                    <td key={l.id} className="p-3 align-top">
                      {v ? capitalise(v) : <span className="text-muted italic">Not stated</span>}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6">
        <AskBox
          heading="Ask the assistant to compare"
          listingIds={items.map((l) => l.id)}
          suggestions={["Which is better value?", "Which is better for an interview?", "Which would be warmer?", "Which has fewer flaws?"]}
        />
      </div>
    </div>
  );
}
