import Link from "next/link";
import { CONDITION_LABEL } from "@/lib/catalogue";
import type { Listing } from "@/lib/types";
import { GarmentArt } from "./GarmentArt";

export function ListingCard({ listing, sellerName, reason }: { listing: Listing; sellerName?: string; reason?: string }) {
  return (
    <Link
      href={`/listings/${listing.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-card transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-accent"
    >
      <GarmentArt garment={listing.garment} hex={listing.colour_hex} label={listing.title} className="aspect-square" />
      <div className="flex flex-1 flex-col gap-1 p-3">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-lg font-semibold">${listing.price_sgd}</span>
          <span className="truncate text-xs text-muted">{CONDITION_LABEL[listing.condition]}</span>
        </div>
        <h3 className="line-clamp-2 text-sm leading-snug font-medium group-hover:underline">{listing.title}</h3>
        <p className="text-xs text-muted">Size {listing.size_label}</p>
        {reason ? (
          <p className="mt-1 rounded-lg bg-accent-soft px-2 py-1 text-xs leading-snug text-accent-ink">{reason}</p>
        ) : sellerName ? (
          <p className="mt-auto pt-1 text-xs text-muted">
            {sellerName} · {listing.meetup}
          </p>
        ) : null}
      </div>
    </Link>
  );
}
