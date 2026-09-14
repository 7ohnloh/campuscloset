import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <p className="text-5xl" aria-hidden>
        🧺
      </p>
      <h1 className="mt-4 font-display text-3xl">Someone got here first</h1>
      <p className="mt-2 text-muted">This item or stall doesn&apos;t exist in the demo catalogue.</p>
      <Link href="/" className="mt-6 inline-block rounded-full bg-ink px-5 py-2.5 text-sm text-paper">
        Back to the market
      </Link>
    </div>
  );
}
