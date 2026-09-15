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
      <div className="mt-3 space-y-3 leading-relaxed [&_li]:ml-5 [&_li]:list-disc [&_li]:pl-1 [&_ul]:space-y-2">{children}</div>
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
        Try it: <Link className="underline" href="/">browse &amp; search</Link> ·{" "}
        <Link className="underline" href="/listings/L010">ask if an item fits</Link> ·{" "}
        <Link className="underline" href="/compare">compare</Link> · <Link className="underline" href="/sell">sell with AI</Link>
      </p>

      <Section n={1} title="What I built and who it is for">
        <p>
          I built CampusCloset, an online flea market for clothes. It is a marketplace where students in a school can sell their
          second-hand clothes to other students, and meet somewhere on campus to hand them over. Each seller has their own
          &quot;stall&quot;, like at a real flea market.
        </p>
        <p>
          It is meant for students and young people. My intention is to make buying and selling second-hand clothes more accessible.
          There are platforms like Carousell, but they cover every kind of item. I wanted something specific to clothes, where every
          listing has the details that matter when buying clothes: size, measurements, material, condition and flaws.
        </p>
        <p>
          The idea also came from my own experience. When I buy clothes online, I sometimes get a little lazy to measure myself, so I
          go to the comments to see what other people say about the sizing. But I am not always able to find opinions on sizing. So I
          added an AI assistant on every listing that answers questions like &quot;Will this fit me? I&apos;m 175cm, 70kg&quot; using the
          seller&apos;s measurements, and tells you honestly when the listing doesn&apos;t have enough information.
        </p>
        <p>In the demo you can:</p>
        <ul>
          <li>Browse listings on your phone without signing in, filter by category and open any item.</li>
          <li>
            Search the way you would describe it to a friend, e.g. &quot;hall formal dress under $30&quot; or &quot;warm jacket for my winter
            exchange&quot;.
          </li>
          <li>Ask questions about an item: sizing, flaws, material, weather, what to wear it to.</li>
          <li>Add up to three items to Compare and ask which one suits you better.</li>
          <li>Try selling: type a rough description of an item and the AI drafts the listing for you.</li>
        </ul>
      </Section>

      <Section n={2} title="What is seeded, simulated or otherwise limited">
        <ul>
          <li>
            <strong>The listings are made up.</strong> There are {listings.length} seeded listings from {stalls.length} fictional student
            sellers on a fictional campus. The sellers, halls and meetup spots don&apos;t exist. Real brand names (Uniqlo, Zara, etc.) are
            only used to make the listings feel realistic.
          </li>
          <li>
            <strong>Some details are missing on purpose.</strong> {noMaterial} listings don&apos;t say the material, {noMeasurements} have no
            measurements, and some don&apos;t mention flaws. Real second-hand listings are often like this, and it lets you see the
            assistant say &quot;not stated in the listing&quot; instead of guessing.
          </li>
          <li>
            <strong>No real photos.</strong> Each item shows a simple clothing illustration in the item&apos;s colour.
          </li>
          <li>
            <strong>Simulated buttons.</strong> &quot;Reserve &amp; arrange meetup&quot;, &quot;Ask the seller&quot; and &quot;Publish listing&quot;
            don&apos;t send, save or charge anything. Each one says so when you press it.
          </li>
          <li>
            <strong>No accounts, payments, chat or database.</strong> A listing you create on the Sell page is not saved, and the compare
            list is only stored in your own browser.
          </li>
        </ul>
      </Section>

      <Section n={3} title="AI coding tools and the models behind search and Q&A">
        <p>
          <strong>Building it:</strong> I used Claude Code to help me code the application based on my requirements: a marketplace for
          second-hand clothes, with an aesthetic that resembles a flea market. It also helped write the seeded listings, test the AI
          features on the deployed site and adjust the prompts when answers weren&apos;t right. The code is on GitHub and I used Vercel
          to deploy it.
        </p>
        <p>
          <strong>The model:</strong> search, Q&amp;A and the selling helper all use <code>{model}</code>, called through the CognitioLabs
          AI gateway. If the gateway&apos;s weekly GPT allowance runs out, it automatically answers with DeepSeek V4.1 Flash instead, so
          some answers might come from that model.
        </p>
        <p>
          <strong>How search works:</strong>
        </p>
        <ul>
          <li>
            The website&apos;s server sends your search and the whole catalogue to the model. With only {listings.length} listings,
            everything fits in one request.
          </li>
          <li>
            The model splits what you asked for into strict requirements (budget, size, category, men&apos;s/women&apos;s) and preferences
            (style, occasion, warmth). It returns the best matches with a one-line reason for each.
          </li>
          <li>
            The server double-checks the answer against the real catalogue. It removes any item that doesn&apos;t exist or is over your
            budget, so the AI can&apos;t show made-up listings.
          </li>
          <li>If the AI is unavailable, a basic keyword search takes over and the page tells you.</li>
        </ul>
        <p>
          <strong>How the Q&amp;A stays honest:</strong>
        </p>
        <ul>
          <li>The assistant only receives the listings you are looking at, and is told to answer only from them.</li>
          <li>
            If a detail is missing, it has to say &quot;not stated&quot; instead of guessing. It also knows that a seller saying &quot;no
            flaws&quot; is different from not mentioning flaws.
          </li>
          <li>
            For sizing, it compares your details with the seller&apos;s measurements but never promises a fit. Missing details appear as
            &quot;Not stated in the listing&quot; tags, with a (simulated) button to ask the seller.
          </li>
        </ul>
        <p>
          <strong>Keeping the key safe:</strong> the API key is stored as a server-side environment variable on Vercel. The browser only
          talks to this website&apos;s own API, never to the AI gateway directly, so reviewers never need a key. The API also has a basic
          limit on how many requests one visitor can make per minute.
        </p>
      </Section>

      <Section n={4} title="What I chose not to build, and why">
        <ul>
          <li>
            <strong>3D body scanning:</strong> I wanted users to scan themselves so they could get size recommendations based on their
            real measurements. This is complex to do well and needs camera access, so the demo uses the seller&apos;s measurements
            instead.
          </li>
          <li>
            <strong>3D styling:</strong> I also wanted a 3D model where users can try combining clothes into outfits, or ask the AI for
            styling recommendations.
          </li>
          <li>
            <strong>Accounts, payments and chat:</strong> the brief doesn&apos;t require them, and I wanted to spend the time on search and
            Q&amp;A.
          </li>
          <li>
            <strong>Embeddings / a vector database:</strong> with {listings.length} listings, the model can read the whole catalogue, which
            was simpler and handled vague searches like &quot;something to wear to a hackathon&quot; well when I tested it. With thousands of
            listings, I would filter first and only send the closest matches to the model.
          </li>
        </ul>
        <p>
          The main reason is time. I was busy for most of the weekend and only had one morning to complete this assignment, so I focused
          on the four areas in the brief: the marketplace, search, Q&amp;A and this page.
        </p>
      </Section>

      <Section n={5} title="Known issues and unfinished parts">
        <ul>
          <li>
            <strong>Search is slow:</strong> AI search takes around 6–10 seconds, because the model reads the whole catalogue every time.
          </li>
          <li>
            <strong>Sizing help depends on the seller:</strong> {noMeasurements} of the {listings.length} listings have no measurements,
            so for those the assistant can only suggest asking the seller. It can never guarantee a fit.
          </li>
          <li>
            <strong>The AI can still make mistakes:</strong> results are checked against the catalogue, but the reasons and answers are
            written by the model. Answers may also be less accurate if the gateway switches to the backup model.
          </li>
          <li>
            <strong>Search tags can&apos;t be edited:</strong> the tags showing how your search was understood are display-only. You
            can&apos;t tap one to remove that filter yet.
          </li>
          <li>
            <strong>The keyword backup is basic:</strong> it only matches words and a small list of synonyms, so results are much weaker
            than AI search.
          </li>
          <li>
            <strong>Limited abuse protection:</strong> the request limit resets whenever the server restarts. It stops casual abuse, but it
            isn&apos;t a real usage quota.
          </li>
          <li>
            <strong>Not fully tested:</strong> I checked the site on a phone-sized screen, but haven&apos;t tested it with screen readers or
            on many different devices.
          </li>
        </ul>
      </Section>
    </article>
  );
}
