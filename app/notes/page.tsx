import type { Metadata } from "next";
import Link from "next/link";
import { aiModelName } from "@/lib/ai";
import { listings, stalls } from "@/lib/catalogue";

export const metadata: Metadata = { title: "Notes · CampusCloset" };

function Section({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-line py-8" aria-labelledby={`s${n}`}>
      <h2 id={`s${n}`} className="font-display text-2xl">
        <span className="mr-2 text-muted">{n}.</span>
        {title}
      </h2>
      <div className="mt-3 space-y-3 leading-relaxed [&_li]:ml-5 [&_li]:list-disc [&_li]:pl-1">{children}</div>
    </section>
  );
}

export default function NotesPage() {
  const model = aiModelName() ?? "no model connected in this environment";
  const noMaterial = listings.filter((l) => !l.material).length;
  const noMeasurements = listings.filter((l) => !l.measurements_cm).length;

  return (
    <article className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      <p className="text-sm text-muted">Notes for reviewers</p>
      <h1 className="font-display text-4xl">About CampusCloset</h1>
      <p className="mt-3 text-muted">
        Quick links: <Link className="underline" href="/">browse & search</Link> ·{" "}
        <Link className="underline" href="/listings/L023">an item with Q&A</Link> ·{" "}
        <Link className="underline" href="/compare">compare</Link> · <Link className="underline" href="/sell">AI-assisted selling</Link>
      </p>

      <Section n={1} title="What I built and who it's for">
        <p>
          CampusCloset is an online flea market where university students buy and sell second-hand clothes. Students clear out their
          wardrobes before graduating, going on exchange or after an internship, and other students pick things up cheaply at a campus
          meetup spot. Each seller has a &quot;stall&quot;, which keeps the flea-market feel.
        </p>
        <p>A buyer can:</p>
        <ul>
          <li>Browse listings on a phone without signing in, filter by category, and open an item page.</li>
          <li>
            Search in natural language, e.g. &quot;hall formal dress under $30&quot; or &quot;warm jacket for my winter exchange&quot;. The page
            shows how the query was understood and a short reason for each match.
          </li>
          <li>Ask questions about an item (fit, flaws, weather, occasions) and get answers grounded in that listing.</li>
          <li>Add up to three items to Compare and ask the assistant which suits them better.</li>
          <li>Try the seller side: describe an item in messy text and let the AI draft a structured listing.</li>
        </ul>
      </Section>

      <Section n={2} title="What is seeded, simulated or limited">
        <ul>
          <li>
            <strong>Seeded catalogue:</strong> {listings.length} listings across {stalls.length} fictional seller stalls on a fictional
            campus. The sellers, halls and meetup spots are made up. Brands are real names used for realism only.
          </li>
          <li>
            <strong>Deliberate gaps:</strong> {noMaterial} listings have no material and {noMeasurements} have no measurements, and some
            don&apos;t mention flaws. This mirrors real second-hand listings and shows how the assistant handles missing facts.
          </li>
          <li>
            <strong>Images:</strong> items use tinted garment illustrations instead of photos.
          </li>
          <li>
            <strong>Simulated:</strong> &quot;Reserve &amp; arrange meetup&quot;, &quot;Ask the seller&quot; and &quot;Publish listing&quot; don&apos;t send,
            save or charge anything. There are no accounts, payments or messaging.
          </li>
          <li>The compare tray is stored in your browser only.</li>
        </ul>
      </Section>

      <Section n={3} title="AI tools and models">
        <ul>
          <li>
            <strong>Coding tool:</strong> Claude Code (Anthropic) helped plan the project, write the seed catalogue and write most of the
            code. I reviewed the work and made the product decisions.
          </li>
          <li>
            <strong>Model powering search, Q&A and listing drafts:</strong> <code>{model}</code>, called through the provided AI gateway&apos;s OpenAI-compatible endpoint. If the weekly GPT allowance runs out, the gateway
            answers with DeepSeek V4.1 Flash instead, so some answers may come from that model.
          </li>
          <li>
            <strong>How search works:</strong> the server sends the query and the whole catalogue (small enough to fit) to the model. The
            model separates hard filters (price, size, category, gender) from soft preferences (style, occasion, warmth) and returns
            ranked listing IDs with reasons. The server then checks the output against the real catalogue: unknown IDs are dropped, and
            anything over the stated budget is removed unless the model explains it relaxed the filter. If the model is unavailable, a
            keyword search with simple price/size/gender parsing takes over and the page says so.
          </li>
          <li>
            <strong>How Q&A stays grounded:</strong> the model only receives the relevant listings. It is told that a missing field means
            &quot;not stated&quot;, that &quot;flaws: none&quot; differs from flaws not mentioned, and to label general clothing knowledge. It
            returns which listings it used and which facts it couldn&apos;t find. Those show as &quot;Not stated in the listing&quot; tags.
          </li>
          <li>
            <strong>Security:</strong> the API key lives only in a server-side environment variable. The browser only talks to this
            site&apos;s own API routes, which have basic per-IP rate limiting and input length limits.
          </li>
        </ul>
      </Section>

      <Section n={4} title="What I chose not to build, and why">
        <ul>
          <li>
            <strong>Accounts, payments, chat and real listings storage:</strong> the brief doesn&apos;t require them, and they would take time
            away from search and Q&A quality.
          </li>
          <li>
            <strong>Embeddings / vector database:</strong> with {listings.length} listings, the model can read the whole catalogue, which is
            simpler and gave better matches for vague queries. At thousands of listings I would pre-filter with structured filters and
            embeddings, then send only the top candidates to the model.
          </li>
          <li>
            <strong>Photo uploads and image understanding:</strong> useful for sellers, but out of scope for the time available.
          </li>
        </ul>
      </Section>

      <Section n={5} title="Known issues and unfinished parts">
        <ul>
          <li>AI search takes a few seconds because the model reads the whole catalogue on each query.</li>
          <li>The interpretation chips on search results are display-only; you can&apos;t remove a filter by tapping it yet.</li>
          <li>Rate limiting is in memory, so it resets per server instance. It&apos;s a guard for a demo, not a real quota.</li>
          <li>Fit answers can only use the measurements listed; the assistant can&apos;t guarantee fit.</li>
          <li>The AI can still occasionally make mistakes; results are checked against the catalogue, but reasons are model-written.</li>
        </ul>
      </Section>
    </article>
  );
}
