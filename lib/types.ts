export type Condition = "new_with_tags" | "like_new" | "good" | "fair";

export type Listing = {
  id: string;
  stall_id: string;
  title: string;
  category: string;
  subcategory: string;
  garment: string;
  brand: string | null;
  gender: "mens" | "womens" | "unisex";
  size_label: string;
  measurements_cm: Record<string, number> | null;
  colour: string[];
  colour_hex: string;
  material: string | null;
  condition: Condition;
  /** "none" = seller says no flaws; null = seller didn't say */
  flaws: string | null;
  style_tags: string[];
  occasion: string[];
  price_sgd: number;
  meetup: string;
  listed_days_ago: number;
  description: string;
};

export type Stall = {
  id: string;
  name: string;
  seller: string;
  blurb: string;
  hall: string;
};

export type SearchResult = { id: string; reason: string };

export type SearchResponse = {
  mode: "ai" | "keyword";
  summary: string;
  chips: string[];
  results: SearchResult[];
  notice?: string | null;
};

export type CitedListing = Pick<Listing, "id" | "title" | "price_sgd" | "garment" | "colour_hex" | "size_label">;

export type AskResponse = {
  mode: "ai" | "unavailable";
  answer: string;
  cited: CitedListing[];
  unknowns: string[];
};

export type ListingDraft = {
  title: string | null;
  category: string | null;
  subcategory: string | null;
  garment: string | null;
  brand: string | null;
  gender: Listing["gender"] | null;
  size_label: string | null;
  measurements_cm: Record<string, number> | null;
  colour: string[];
  colour_hex: string | null;
  material: string | null;
  condition: Condition | null;
  flaws: string | null;
  style_tags: string[];
  occasion: string[];
  price_sgd: number | null;
  description: string | null;
  missing: string[];
};
