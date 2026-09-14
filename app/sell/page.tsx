import type { Metadata } from "next";
import { SellForm } from "@/components/SellForm";

export const metadata: Metadata = { title: "Sell an item · CampusCloset" };

export default function SellPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:py-10">
      <h1 className="font-display text-3xl sm:text-4xl">Open your stall</h1>
      <p className="mt-2 max-w-2xl text-muted">
        Clearing out before graduation or exchange? Describe an item in your own words and we&apos;ll draft the listing. Publishing is
        simulated in this demo.
      </p>
      <div className="mt-6">
        <SellForm />
      </div>
    </div>
  );
}
