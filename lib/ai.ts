// Server-only: the API key is read from environment variables and never sent to the browser.

export class AIUnavailableError extends Error {}

export function aiConfigured(): boolean {
  return Boolean(process.env.AI_API_KEY && process.env.AI_BASE_URL && process.env.AI_MODEL);
}

export function aiModelName(): string | null {
  return process.env.AI_MODEL ?? null;
}

/** Calls an OpenAI-compatible chat completions endpoint and parses a JSON object from the reply. */
export async function chatJSON<T>(system: string, user: string): Promise<T> {
  if (!aiConfigured()) throw new AIUnavailableError("AI is not configured");

  const base = process.env.AI_BASE_URL!.replace(/\/+$/, "");
  let res: Response;
  try {
    res = await fetch(`${base}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.AI_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.AI_MODEL,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        response_format: { type: "json_object" },
        // Optional: e.g. "low" to speed up reasoning models. Unset by default because not every
        // model behind the gateway (e.g. the DeepSeek overflow) accepts it.
        ...(process.env.AI_REASONING_EFFORT ? { reasoning_effort: process.env.AI_REASONING_EFFORT } : {}),
      }),
      signal: AbortSignal.timeout(45_000),
      cache: "no-store",
    });
  } catch (err) {
    throw new AIUnavailableError(`Model request failed: ${err instanceof Error ? err.message : String(err)}`);
  }

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new AIUnavailableError(`Model returned ${res.status}: ${detail.slice(0, 300)}`);
  }

  const data = await res.json();
  const content: unknown = data?.choices?.[0]?.message?.content;
  if (typeof content !== "string" || !content.trim()) {
    throw new AIUnavailableError("Model returned an empty response");
  }
  return parseJSONObject<T>(content);
}

function parseJSONObject<T>(text: string): T {
  try {
    return JSON.parse(text) as T;
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]) as T;
      } catch {
        // fall through
      }
    }
    throw new AIUnavailableError("Model response was not valid JSON");
  }
}
