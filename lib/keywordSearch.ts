import { listings } from "./catalogue";
import type { Listing, SearchResponse } from "./types";

// Non-AI fallback: regex filters for price/size/gender plus weighted keyword matching
// with a small hand-written synonym list. Used when the model is unavailable.

const STOPWORDS = new Set(
  "a an the for to of in on with and or i im i'm me my something some any looking want need find show under below less than above over size cheap near around good nice please that is are can get outfit".split(
    " ",
  ),
);

const WINTER = ["winter", "exchange", "snow", "cool weather", "wool", "down", "fleece", "warm"];
const INTERVIEW = ["interview", "internship", "career fair", "blazer", "presentation"];
const VINTAGE = ["vintage", "90s", "y2k", "retro", "70s"];
const GYM = ["gym", "running", "sporty", "yoga", "sports"];
const LECTURE = ["lectures", "aircon", "comfy", "cosy"];

const EXPANSIONS: Record<string, string[]> = {
  formal: ["hall formal", "formal", "gown", "dinner"],
  interview: INTERVIEW,
  internship: INTERVIEW,
  office: INTERVIEW,
  work: INTERVIEW,
  winter: WINTER,
  cold: WINTER,
  warm: WINTER,
  exchange: WINTER,
  snow: WINTER,
  korea: WINTER,
  japan: WINTER,
  gym: GYM,
  workout: GYM,
  running: GYM,
  sports: GYM,
  vintage: VINTAGE,
  thrift: VINTAGE,
  retro: VINTAGE,
  lecture: LECTURE,
  lectures: LECTURE,
  class: LECTURE,
  comfy: ["comfy", "cosy", "oversized", "athleisure"],
  party: ["party", "night out", "glam"],
  wedding: ["wedding", "outdoor wedding"],
  rain: ["rainy", "rain jacket", "waterproof"],
  rainy: ["rainy", "rain jacket", "waterproof"],
  shoes: ["shoes", "sneakers", "heels", "boots", "sandals"],
  shoe: ["shoes", "sneakers", "heels", "boots", "sandals"],
  jacket: ["jacket", "outerwear", "coat", "puffer", "windbreaker"],
  coat: ["coat", "outerwear", "puffer"],
  pants: ["trousers", "jeans", "joggers", "chinos"],
  trousers: ["trousers", "chinos", "joggers"],
  top: ["tops", "t-shirt", "shirt", "blouse"],
  tops: ["tops", "t-shirt", "shirt", "blouse"],
  tee: ["t-shirt", "tee"],
  tshirt: ["t-shirt", "tee"],
  bag: ["bag", "tote", "clutch"],
  hot: ["linen", "breathable", "airism", "summery", "breezy"],
  breathable: ["linen", "breathable", "airism", "summery", "breezy"],
};

function haystacks(l: Listing) {
  return {
    title: l.title.toLowerCase(),
    strong: [l.category, l.subcategory, ...l.style_tags, ...l.occasion].join(" | ").toLowerCase(),
    weak: [l.brand ?? "", l.material ?? "", l.description, ...l.colour].join(" | ").toLowerCase(),
  };
}

export function keywordSearch(rawQuery: string): SearchResponse {
  let q = rawQuery.toLowerCase();
  const chips: string[] = [];

  let maxPrice: number | null = null;
  const priceMatch =
    q.match(/(?:under|below|less than|max|cheaper than|<)\s*\$?\s*(\d+)/) ?? q.match(/\$\s*(\d+)\s*(?:or less|and below|max)/);
  if (priceMatch) {
    maxPrice = Number(priceMatch[1]);
    chips.push(`Under $${maxPrice}`);
    q = q.replace(priceMatch[0], " ");
  }

  let gender: "mens" | "womens" | null = null;
  if (/\b(girls?|women'?s?|ladies|female|her)\b/.test(q)) gender = "womens";
  else if (/\b(guys?|men'?s?|male|boys?|him)\b/.test(q)) gender = "mens";
  if (gender) chips.push(gender === "mens" ? "Men's / unisex" : "Women's / unisex");

  let size: string | null = null;
  const sizeMatch = q.match(/\bsize\s+([a-z0-9]+)\b/);
  if (sizeMatch) {
    size = sizeMatch[1].toUpperCase();
    chips.push(`Size ${size}`);
    q = q.replace(sizeMatch[0], " ");
  }

  const tokens = q
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOPWORDS.has(t) && !/^\d+$/.test(t));

  const scored = listings
    .filter((l) => maxPrice === null || l.price_sgd <= maxPrice)
    .filter((l) => !gender || l.gender === gender || l.gender === "unisex")
    .filter((l) => !size || l.size_label.toUpperCase().split(/[^A-Z0-9]+/).includes(size))
    .map((l) => {
      const h = haystacks(l);
      let score = 0;
      const matched: string[] = [];
      for (const token of tokens) {
        const terms = [token, ...(EXPANSIONS[token] ?? [])];
        let best = 0;
        for (const term of terms) {
          if (h.title.includes(term)) best = Math.max(best, 3);
          else if (h.strong.includes(term)) best = Math.max(best, 2);
          else if (h.weak.includes(term)) best = Math.max(best, 1);
        }
        if (best > 0) matched.push(token);
        score += best;
      }
      return { l, score, matched };
    })
    .filter((r) => tokens.length === 0 || r.score > 0)
    .sort((a, b) => b.score - a.score || a.l.price_sgd - b.l.price_sgd)
    .slice(0, 12);

  const matchedTokens = [...new Set(scored.flatMap((r) => r.matched))].slice(0, 4);
  chips.push(...matchedTokens);

  return {
    mode: "keyword",
    summary: `Keyword matches for “${rawQuery}”`,
    chips,
    results: scored.map((r) => ({
      id: r.l.id,
      reason: r.matched.length ? `Matches “${r.matched.slice(0, 3).join("”, “")}”` : "Matches your filters",
    })),
  };
}
