import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AskBox } from "@/components/AskBox";
import { CompareToggle } from "@/components/CompareControls";
import { GarmentArt } from "@/components/GarmentArt";
import { ListingCard } from "@/components/ListingCard";
import { ReserveButton } from "@/components/ReserveButton";
import { CONDITION_LABEL, capitalise, formatMeasurements, getListing, getStall, listings } from "@/lib/catalogue";
import type { Listing } from "@/lib/types";

export function generateStaticParams() {
  return listings.map((l) => ({ id: l.id }));
}

export async function generateMetadata({ params }: PageProps<"/listings/[id]">): Promise<Metadata> {
  const { id } = await params;
  const listing = getListing(id);
  return { title: listing ? `${listing.title} · $${listing.price_sgd} · CampusCloset` : "Listing not found · CampusCloset" };
}

function suggestionsFor(l: Listing): string[] {
  const s = [l.measurements_cm ? "Will this fit me? I'm 170cm, 60kg" : "What are the measurements?"];
  if (l.category === "outerwear" || l.occasion.includes("winter")) s.push("Is this warm enough for a Korean winter?");
  else s.push("Is it comfortable in Singapore weather?");
  s.push("Any flaws I should know about?", "What occasions could I wear this to?");
  return s;
}

function Fact({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="grid grid-cols-[7.5rem_1fr] gap-2 border-b border-line py-2.5 text-sm last:border-0">
      <dt className="text-muted">{label}</dt>
      <dd>{value ?? <span className="text-muted italic">Not stated by seller</span>}</dd>
    </div>
  );
}

export default async function ListingPage({ params }: PageProps<"/listings/[id]">) {
  const { id } = await params;
  const listing = getListing(id);
  if (!listing) notFound();
  const stall = getStall(listing.stall_id)!;
  const moreFromStall = listings.filter((l) => l.stall_id === stall.id && l.id !== listing.id).slice(0, 4);

  const flaws = listing.flaws === "none" ? "None, according to the seller" : listing.flaws;

  return (
    <div className="mx-auto max-w-6xl px-4 py-5 sm:py-8">
      <Link href="/" className="text-sm text-muted hover:text-ink">
        ← Back to all listings
      </Link>

      <div className="mt-4 grid gap-6 md:grid-cols-2 md:gap-10">
        <div className="md:sticky md:top-20 md:self-start">
          <GarmentArt garment={listing.garment} hex={listing.colour_hex} label={listing.title} className="aspect-square rounded-3xl" />
          <p className="mt-2 text-center text-xs text-muted">Illustration — seeded demo listings don&apos;t have real photos</p>
        </div>

        <div className="space-y-5">
          <div>
            <p className="text-sm text-muted">
              {listing.brand ?? "Unbranded / brand not stated"} · {capitalise(listing.subcategory)}
            </p>
            <h1 className="mt-1 font-display text-3xl leading-tight">{listing.title}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-3xl font-semibold">${listing.price_sgd}</span>
              <span className="rounded-full bg-card px-2.5 py-1 text-xs ring-1 ring-line">{CONDITION_LABEL[listing.condition]}</span>
              <span className="rounded-full bg-card px-2.5 py-1 text-xs ring-1 ring-line">Size {listing.size_label}</span>
            </div>
            <p className="mt-4 leading-relaxed">{listing.description}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <ReserveButton sellerName={stall.seller} meetup={listing.meetup} />
            <CompareToggle id={listing.id} />
          </div>

          <dl className="rounded-2xl border border-line bg-card px-4">
            <Fact label="Size" value={listing.size_label} />
            <Fact label="Measurements" value={formatMeasurements(listing.measurements_cm)} />
            <Fact label="Material" value={listing.material} />
            <Fact label="Colour" value={listing.colour.map(capitalise).join(", ")} />
            <Fact label="Condition" value={CONDITION_LABEL[listing.condition]} />
            <Fact label="Flaws" value={flaws} />
            <Fact label="Cut" value={{ mens: "Men's", womens: "Women's", unisex: "Unisex" }[listing.gender]} />
            <Fact label="Style" value={listing.style_tags.join(", ")} />
            <Fact label="Good for" value={listing.occasion.join(", ")} />
            <Fact label="Meetup" value={listing.meetup} />
          </dl>

          <AskBox listingIds={[listing.id]} suggestions={suggestionsFor(listing)} sellerName={stall.seller} />

          <Link
            href={`/stalls/${stall.id}`}
            className="block rounded-2xl border border-line bg-card p-4 transition hover:border-ink"
          >
            <p className="text-xs font-medium tracking-wide text-muted uppercase">Sold by</p>
            <p className="mt-1 font-display text-lg">{stall.name}</p>
            <p className="text-sm text-muted">{stall.blurb}</p>
            <p className="mt-2 text-sm font-medium">Visit stall →</p>
          </Link>
        </div>
      </div>

      {moreFromStall.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 font-display text-2xl">More from {stall.name}</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {moreFromStall.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
