import { SearchExperience } from "@/components/SearchExperience";
import { CATEGORIES, listings, stalls } from "@/lib/catalogue";

export default function Home() {
  const sellerNames = Object.fromEntries(stalls.map((s) => [s.id, s.seller]));
  const usedCategories = CATEGORIES.filter((c) => listings.some((l) => l.category === c));
  return <SearchExperience listings={listings} sellerNames={sellerNames} categories={usedCategories} />;
}
