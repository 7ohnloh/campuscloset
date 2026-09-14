import { draftListing } from "@/lib/draft";
import { isRateLimited, tooManyRequests } from "@/lib/rateLimit";

export async function POST(req: Request) {
  if (isRateLimited(req)) return tooManyRequests();

  const body = await req.json().catch(() => null);
  const text = typeof body?.text === "string" ? body.text.trim().slice(0, 1000) : "";
  if (text.length < 5) return Response.json({ error: "Describe the item in a few words first." }, { status: 400 });

  try {
    return Response.json(await draftListing(text));
  } catch (err) {
    console.error("[draft-listing] failed:", err instanceof Error ? err.message : err);
    return Response.json(
      { error: "The AI listing helper is unavailable right now. You can still fill in the form manually." },
      { status: 503 },
    );
  }
}
