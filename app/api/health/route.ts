import { aiConfigured, aiModelName, chatJSON } from "@/lib/ai";

// Quick check that the deployed site can reach the model. Never returns the key.
export async function GET() {
  if (!aiConfigured()) return Response.json({ ai: "not_configured" }, { status: 503 });
  const started = Date.now();
  try {
    const out = await chatJSON<{ ok?: boolean }>('Reply with the JSON object {"ok": true}.', "ping");
    return Response.json({ ai: out.ok ? "ok" : "unexpected_reply", model: aiModelName(), ms: Date.now() - started });
  } catch (err) {
    return Response.json(
      { ai: "error", model: aiModelName(), detail: err instanceof Error ? err.message.slice(0, 200) : "unknown" },
      { status: 502 },
    );
  }
}
