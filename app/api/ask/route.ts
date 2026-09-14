import { askCatalogue } from "@/lib/ask";
import { isRateLimited, tooManyRequests } from "@/lib/rateLimit";
import type { AskResponse } from "@/lib/types";

export async function POST(req: Request) {
  if (isRateLimited(req)) return tooManyRequests();

  const body = await req.json().catch(() => null);
  const question = typeof body?.question === "string" ? body.question.trim().slice(0, 500) : "";
  const listingIds = Array.isArray(body?.listingIds)
    ? body.listingIds.filter((id: unknown): id is string => typeof id === "string").slice(0, 3)
    : [];
  if (!question) return Response.json({ error: "Please type a question." }, { status: 400 });

  try {
    return Response.json(await askCatalogue(question, listingIds));
  } catch (err) {
    console.error("[ask] failed:", err instanceof Error ? err.message : err);
    const unavailable: AskResponse = {
      mode: "unavailable",
      answer:
        "The AI assistant is unavailable right now, so I can't answer that. Everything shown in the listing details is accurate — anything not shown there hasn't been stated by the seller.",
      cited: [],
      unknowns: [],
    };
    return Response.json(unavailable, { status: 503 });
  }
}
