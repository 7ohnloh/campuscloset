import type { Metadata } from "next";
import { CompareView } from "@/components/CompareView";
import { listings } from "@/lib/catalogue";

export const metadata: Metadata = { title: "Compare · CampusCloset" };

export default function ComparePage() {
  return <CompareView listings={listings} />;
}
