// Simple per-IP sliding window. It lives in memory, so each serverless instance keeps its own
// count — enough to stop casual abuse of a public demo, not a real quota system.
const hits = new Map<string, number[]>();

export function isRateLimited(req: Request, limit = 20, windowMs = 60_000): boolean {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > limit;
}

export function tooManyRequests() {
  return Response.json({ error: "Too many requests — please wait a minute and try again." }, { status: 429 });
}
