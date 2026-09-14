"use client";

import { useState } from "react";
import { CATEGORIES, CONDITION_LABEL, GARMENTS, capitalise } from "@/lib/catalogue";
import type { Condition, ListingDraft } from "@/lib/types";
import { GarmentArt } from "./GarmentArt";

const EXAMPLE =
  "selling my black zara blazer, size S, worn twice for interviews. no stains. 70% polyester. $20, can meet at library plaza";

type FormState = {
  title: string;
  category: string;
  garment: string;
  brand: string;
  size_label: string;
  material: string;
  condition: string;
  flaws: string;
  price_sgd: string;
  colour: string;
  colour_hex: string;
  description: string;
};

const EMPTY_FORM: FormState = {
  title: "",
  category: "",
  garment: "tee",
  brand: "",
  size_label: "",
  material: "",
  condition: "",
  flaws: "",
  price_sgd: "",
  colour: "",
  colour_hex: "#9a8f80",
  description: "",
};

function draftToForm(d: ListingDraft): FormState {
  return {
    title: d.title ?? "",
    category: d.category ?? "",
    garment: d.garment ?? "tee",
    brand: d.brand ?? "",
    size_label: d.size_label ?? "",
    material: d.material ?? "",
    condition: d.condition ?? "",
    flaws: d.flaws ?? "",
    price_sgd: d.price_sgd?.toString() ?? "",
    colour: d.colour.join(", "),
    colour_hex: d.colour_hex ?? "#9a8f80",
    description: d.description ?? "",
  };
}

export function SellForm() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [tips, setTips] = useState<string[]>([]);
  const [aiFilled, setAiFilled] = useState<Set<keyof FormState>>(new Set());
  const [published, setPublished] = useState(false);

  async function draft() {
    if (text.trim().length < 5 || loading) return;
    setLoading(true);
    setError(null);
    setPublished(false);
    try {
      const res = await fetch("/api/draft-listing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "Couldn't draft the listing. Please try again.");
        return;
      }
      const d = data as ListingDraft;
      const next = draftToForm(d);
      setForm(next);
      setTips(d.missing);
      setAiFilled(new Set((Object.keys(next) as (keyof FormState)[]).filter((k) => next[k] && next[k] !== EMPTY_FORM[k])));
    } catch {
      setError("Couldn't reach the listing helper. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setPublished(false);
  };

  const fieldClass = (k: keyof FormState) =>
    `mt-1 w-full rounded-xl border px-3 py-2 text-base sm:text-sm outline-none focus:border-ink ${
      aiFilled.has(k) ? "border-emerald-300 bg-emerald-50/60" : form[k] ? "border-line bg-card" : "border-amber-300 bg-amber-50/60"
    }`;

  const hasDraft = aiFilled.size > 0 || Object.entries(form).some(([k, v]) => v !== EMPTY_FORM[k as keyof FormState]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
      <div className="space-y-5">
        <section className="rounded-2xl border border-line bg-card p-4 sm:p-5">
          <h2 className="font-display text-xl">1. Describe it like you&apos;d text a friend</h2>
          <p className="mt-1 text-sm text-muted">The AI turns it into a proper listing. It only fills in what you actually said.</p>
          <label htmlFor="sell-text" className="sr-only">
            Item description
          </label>
          <textarea
            id="sell-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={1000}
            rows={4}
            placeholder={EXAMPLE}
            className="mt-3 w-full rounded-xl border border-line bg-paper p-3 text-base outline-none focus:border-ink sm:text-sm"
          />
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={draft}
              disabled={loading || text.trim().length < 5}
              className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50"
            >
              {loading ? "Drafting…" : "✨ Draft my listing"}
            </button>
            <button type="button" onClick={() => setText(EXAMPLE)} className="rounded-full border border-line px-4 py-2.5 text-sm hover:border-ink">
              Use an example
            </button>
          </div>
          {error && <p className="mt-3 rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p>}
        </section>

        <section className="rounded-2xl border border-line bg-card p-4 sm:p-5">
          <h2 className="font-display text-xl">2. Check the details</h2>
          <p className="mt-1 flex flex-wrap gap-3 text-xs text-muted">
            <span>
              <span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm bg-emerald-200 align-middle" />
              Filled from your description
            </span>
            <span>
              <span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm bg-amber-200 align-middle" />
              Missing — buyers may ask
            </span>
          </p>

          {tips.length > 0 && (
            <ul className="mt-3 space-y-1 rounded-xl bg-paper p-3 text-sm">
              {tips.map((t) => (
                <li key={t}>💡 {t}</li>
              ))}
            </ul>
          )}

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="text-sm sm:col-span-2">
              Title
              <input value={form.title} onChange={set("title")} className={fieldClass("title")} />
            </label>
            <label className="text-sm">
              Category
              <select value={form.category} onChange={set("category")} className={fieldClass("category")}>
                <option value="">Choose…</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {capitalise(c)}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm">
              Price (SGD)
              <input inputMode="decimal" value={form.price_sgd} onChange={set("price_sgd")} className={fieldClass("price_sgd")} />
            </label>
            <label className="text-sm">
              Brand
              <input value={form.brand} onChange={set("brand")} className={fieldClass("brand")} />
            </label>
            <label className="text-sm">
              Size
              <input value={form.size_label} onChange={set("size_label")} className={fieldClass("size_label")} />
            </label>
            <label className="text-sm">
              Material
              <input value={form.material} onChange={set("material")} className={fieldClass("material")} />
            </label>
            <label className="text-sm">
              Condition
              <select value={form.condition} onChange={set("condition")} className={fieldClass("condition")}>
                <option value="">Choose…</option>
                {(Object.keys(CONDITION_LABEL) as Condition[]).map((c) => (
                  <option key={c} value={c}>
                    {CONDITION_LABEL[c]}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm">
              Flaws
              <input value={form.flaws} onChange={set("flaws")} placeholder="e.g. none, or small stain on cuff" className={fieldClass("flaws")} />
            </label>
            <label className="text-sm">
              Colour
              <input value={form.colour} onChange={set("colour")} className={fieldClass("colour")} />
            </label>
            <label className="text-sm sm:col-span-2">
              Description
              <textarea value={form.description} onChange={set("description")} rows={3} className={fieldClass("description")} />
            </label>
          </div>
        </section>
      </div>

      <aside className="lg:sticky lg:top-20 lg:self-start">
        <div className="overflow-hidden rounded-2xl border border-line bg-card">
          <GarmentArt
            garment={GARMENTS.includes(form.garment) ? form.garment : "tee"}
            hex={form.colour_hex}
            label="Listing preview"
            className="aspect-square"
          />
          <div className="p-4">
            <p className="text-xs font-medium tracking-wide text-muted uppercase">Preview</p>
            <p className="mt-1 text-lg font-semibold">{form.price_sgd ? `$${form.price_sgd}` : "$—"}</p>
            <p className="font-medium">{form.title || "Your listing title"}</p>
            <p className="text-sm text-muted">
              {form.size_label ? `Size ${form.size_label}` : "Size not set"}
              {form.condition ? ` · ${CONDITION_LABEL[form.condition as Condition]}` : ""}
            </p>
            <button
              type="button"
              disabled={!hasDraft || !form.title || !form.price_sgd}
              onClick={() => setPublished(true)}
              className="mt-4 w-full rounded-full bg-ink px-4 py-2.5 text-sm font-medium text-paper disabled:opacity-40"
            >
              Publish listing (simulated)
            </button>
            {published && (
              <p className="mt-2 text-xs text-muted" role="status">
                Demo only: this listing wasn&apos;t saved or shown to other buyers. Seller accounts and storage aren&apos;t part of this
                demo.
              </p>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}
