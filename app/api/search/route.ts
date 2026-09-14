import { aiConfigured } from "@/lib/ai";
import { keywordSearch } from "@/lib/keywordSearch";
import { isRateLimited, tooManyRequests } from "@/lib/rateLimit";
import { aiSearch } from "@/lib/search";

export async function POST(req: Request) {
  if (isRateLimited(req)) return tooManyRequests();

  const body = await req.json().catch(() => null);
  const query = typeof body?.query === "string" ? body.query.trim().slice(0, 300) : "";
  if (!query) return Response.json({ error: "Please type what you're looking for." }, { status: 400 });

  try {
    return Response.json(await aiSearch(query));
  } catch (err) {
    console.error("[search] AI search failed, using keyword fallback:", err instanceof Error ? err.message : err);
    const fallback = keywordSearch(query);
    fallback.notice = aiConfigured()
      ? "AI search is temporarily unavailable, so these are basic keyword matches."
      : "AI search isn't connected in this environment, so these are basic keyword matches.";
    return Response.json(fallback);
  }
}
