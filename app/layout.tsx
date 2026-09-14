import type { Metadata, Viewport } from "next";
import { Fraunces, Geist } from "next/font/google";
import Link from "next/link";
import { CompareNavLink } from "@/components/CompareControls";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CampusCloset — the campus flea market for pre-loved clothes",
  description: "A demo second-hand clothing marketplace for university students, with AI search and grounded Q&A.",
};

export const viewport: Viewport = {
  themeColor: "#faf6ef",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${fraunces.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <div className="bg-ink px-4 py-1.5 text-center text-xs text-paper">
          Demo marketplace · seeded listings on a fictional campus · reservations are simulated ·{" "}
          <Link href="/notes" className="underline underline-offset-2">
            About this demo
          </Link>
        </div>
        <header className="sticky top-0 z-20 border-b border-line bg-paper/90 backdrop-blur">
          <nav className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3" aria-label="Main">
            <Link href="/" className="flex items-center gap-1.5 font-display text-xl font-semibold">
              <span aria-hidden>🧺</span> CampusCloset
            </Link>
            <div className="flex items-center gap-0.5 text-sm">
              <Link href="/" className="hidden rounded-full px-3 py-1.5 hover:bg-line/60 sm:block">
                Browse
              </Link>
              <CompareNavLink />
              <Link href="/sell" className="rounded-full bg-ink px-3 py-1.5 text-paper">
                Sell
              </Link>
            </div>
          </nav>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-line px-4 py-6 text-center text-xs text-muted">
          CampusCloset is a demo built for a candidate assessment. No real users, payments or meetups.{" "}
          <Link href="/notes" className="underline">
            Read the notes
          </Link>
          .
        </footer>
      </body>
    </html>
  );
}
