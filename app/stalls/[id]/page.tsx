import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ListingCard } from "@/components/ListingCard";
import { getStall, listings, stalls } from "@/lib/catalogue";

export function generateStaticParams() {
  return stalls.map((s) => ({ id: s.id }));
}

export async function generateMetadata({ params }: PageProps<"/stalls/[id]">): Promise<Metadata> {
  const { id } = await params;
  return { title: `${getStall(id)?.name ?? "Stall not found"} · CampusCloset` };
}

export default async function StallPage({ params }: PageProps<"/stalls/[id]">) {
  const { id } = await params;
  const stall = getStall(id);
  if (!stall) notFound();
  const items = listings.filter((l) => l.stall_id === stall.id);

  return (
    <div className="mx-auto max-w-6xl px-4 py-5 sm:py-8">
      <Link href="/" className="text-sm text-muted hover:text-ink">
        ← Back to all listings
      </Link>
      <header className="mt-4 rounded-3xl border border-line bg-card p-5 sm:p-8">
        <p className="text-xs font-medium tracking-wide text-muted uppercase">Stall · {stall.hall}</p>
        <h1 className="mt-1 font-display text-3xl sm:text-4xl">{stall.name}</h1>
        <p className="mt-2 max-w-2xl text-muted">“{stall.blurb}”</p>
        <p className="mt-3 text-sm">
          {items.length} item{items.length === 1 ? "" : "s"} · seeded demo seller
        </p>
      </header>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {items.map((l) => (
          <ListingCard key={l.id} listing={l} />
        ))}
      </div>
    </div>
  );
}
