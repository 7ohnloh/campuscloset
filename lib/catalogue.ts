import listingsData from "@/data/listings.json";
import stallsData from "@/data/stalls.json";
import type { CitedListing, Condition, Listing, Stall } from "./types";

export const listings = listingsData as Listing[];
export const stalls = stallsData as Stall[];

const listingById = new Map(listings.map((l) => [l.id, l]));
const stallById = new Map(stalls.map((s) => [s.id, s]));

export function getListing(id: string): Listing | undefined {
  return listingById.get(id);
}

export function getStall(id: string): Stall | undefined {
  return stallById.get(id);
}

export const CONDITION_LABEL: Record<Condition, string> = {
  new_with_tags: "New with tags",
  like_new: "Like new",
  good: "Good",
  fair: "Fair",
};

export const CATEGORIES = [
  "tops",
  "bottoms",
  "dresses",
  "skirts",
  "outerwear",
  "knitwear",
  "formal",
  "activewear",
  "shoes",
  "accessories",
  "innerwear",
];

export const GARMENTS = [
  "tee", "shirt", "hoodie", "sweater", "jacket", "blazer", "coat", "puffer",
  "jeans", "trousers", "shorts", "skirt", "dress",
  "sneakers", "sandals", "heels", "boots", "formal shoes",
  "bag", "cap", "scarf", "tie",
];

const MEASUREMENT_LABEL: Record<string, string> = {
  pit_to_pit: "Pit to pit",
  length: "Length",
  shoulder: "Shoulder",
  waist_flat: "Waist (flat)",
  inseam: "Inseam",
  leg_opening: "Leg opening",
};

export function formatMeasurements(m: Listing["measurements_cm"]): string | null {
  if (!m) return null;
  return Object.entries(m)
    .map(([k, v]) => `${MEASUREMENT_LABEL[k] ?? k} ${v} cm`)
    .join(" · ");
}

export function capitalise(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function toCited(l: Listing): CitedListing {
  return {
    id: l.id,
    title: l.title,
    price_sgd: l.price_sgd,
    garment: l.garment,
    colour_hex: l.colour_hex,
    size_label: l.size_label,
  };
}

/** Listing as the model sees it. Nulls are kept so the model can tell "not stated" apart from "none". */
export function listingForPrompt(l: Listing) {
  return {
    id: l.id,
    title: l.title,
    category: l.category,
    subcategory: l.subcategory,
    brand: l.brand,
    gender: l.gender,
    size: l.size_label,
    measurements_cm: l.measurements_cm,
    colour: l.colour,
    material: l.material,
    condition: CONDITION_LABEL[l.condition],
    flaws: l.flaws,
    style_tags: l.style_tags,
    good_for: l.occasion,
    price_sgd: l.price_sgd,
    seller: getStall(l.stall_id)?.seller ?? null,
    meetup: l.meetup,
    description: l.description,
  };
}
