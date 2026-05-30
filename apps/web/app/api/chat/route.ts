import { NextRequest } from "next/server";
import { z } from "zod";

import { fail, handleError, ok } from "@/lib/api/response";
import { ALLOWED_PATHS, findEntryByPath } from "@/lib/chatbot/knowledge";
import { MAX_HISTORY_MESSAGES, buildSystemPrompt } from "@/lib/chatbot/prompt";
import type { ChatResponseBody, SuggestedLink } from "@/lib/chatbot/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// ─────────────────────────────────────────────────────────── Validation ──

const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(4000),
});

const chatRequestSchema = z.object({
  messages: z.array(chatMessageSchema).min(1).max(50),
});

// ───────────────────────────────────────────────────────── Rate limiting ──

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 20;

type Bucket = { count: number; resetAt: number };
const ipBuckets: Map<string, Bucket> = new Map();

function getClientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]?.trim() || "unknown";
  return req.headers.get("x-real-ip") ?? "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const bucket = ipBuckets.get(ip);
  if (!bucket || now > bucket.resetAt) {
    ipBuckets.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  bucket.count += 1;
  return bucket.count > RATE_LIMIT_MAX;
}

// ──────────────────────────────────────────────────────────────── Cache ──

const RESPONSE_CACHE_TTL_MS = 5 * 60_000;
type CacheEntry = { data: ChatResponseBody; expiresAt: number };
const responseCache: Map<string, CacheEntry> = new Map();

function normalizeForCache(text: string): string {
  return text.trim().toLowerCase().replace(/\s+/g, " ");
}

function readCache(key: string): ChatResponseBody | null {
  const hit = responseCache.get(key);
  if (!hit) return null;
  if (Date.now() > hit.expiresAt) {
    responseCache.delete(key);
    return null;
  }
  return hit.data;
}

function writeCache(key: string, data: ChatResponseBody): void {
  responseCache.set(key, { data, expiresAt: Date.now() + RESPONSE_CACHE_TTL_MS });
}

// ────────────────────────────────────────────────────────── Gemini call ──
//
// Free-tier model priority (as of May 2026):
//   1. gemini-2.5-flash-lite  — 15 RPM, 1000 RPD (most generous free tier)
//   2. gemini-2.5-flash       — 10 RPM,  250 RPD
//   3. gemini-flash-latest    — alias to the current stable flash model
//
// gemini-2.0-flash is being deprecated June 2026 and free quotas have been
// reduced to near-zero, hence the fallback chain.
//
// Override via GEMINI_MODEL=<id> in env to force a specific model.

const DEFAULT_MODEL_CHAIN = [
  "gemini-2.5-flash-lite",
  "gemini-2.5-flash",
  "gemini-flash-latest",
] as const;

function getModelChain(): readonly string[] {
  const override = process.env.GEMINI_MODEL?.trim();
  if (override) return [override];
  return DEFAULT_MODEL_CHAIN;
}

const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

const RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    answer: { type: "STRING" },
    suggestedLinks: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          label: { type: "STRING" },
          href: { type: "STRING" },
        },
        required: ["label", "href"],
      },
    },
  },
  required: ["answer", "suggestedLinks"],
};

type GeminiContent = {
  role: "user" | "model";
  parts: { text: string }[];
};

class GeminiHttpError extends Error {
  constructor(public status: number, public bodyText: string) {
    super(`Gemini API error ${status}: ${bodyText.slice(0, 200)}`);
    this.name = "GeminiHttpError";
  }
}

async function callGeminiOnce(
  apiKey: string,
  model: string,
  history: { role: "user" | "assistant"; content: string }[]
): Promise<ChatResponseBody> {
  const contents: GeminiContent[] = history.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const body = {
    systemInstruction: {
      role: "user",
      parts: [{ text: buildSystemPrompt() }],
    },
    contents,
    generationConfig: {
      temperature: 0.6,
      maxOutputTokens: 512,
      responseMimeType: "application/json",
      responseSchema: RESPONSE_SCHEMA,
    },
    safetySettings: [
      { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" },
      { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" },
      { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_ONLY_HIGH" },
      { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" },
    ],
  };

  const res = await fetch(`${GEMINI_BASE}/${model}:generateContent?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new GeminiHttpError(res.status, errText);
  }

  const json = (await res.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };

  const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Gemini returned no text");

  let parsed: { answer?: unknown; suggestedLinks?: unknown };
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("Gemini returned non-JSON output");
  }

  return sanitizeResponse(parsed);
}

/**
 * Try each model in the chain. If a model returns 429 (quota) or 404 (model
 * not available), fall through to the next. Other errors abort immediately.
 */
async function callGemini(
  apiKey: string,
  history: { role: "user" | "assistant"; content: string }[]
): Promise<ChatResponseBody> {
  const chain = getModelChain();
  let lastError: unknown;

  for (const model of chain) {
    try {
      return await callGeminiOnce(apiKey, model, history);
    } catch (err) {
      lastError = err;
      const isRetriable =
        err instanceof GeminiHttpError &&
        (err.status === 429 || err.status === 404 || err.status === 503);
      if (!isRetriable) throw err;
      console.warn(
        `[chat] Model "${model}" returned ${(err as GeminiHttpError).status}, trying next in chain.`
      );
    }
  }

  throw lastError ?? new Error("All Gemini models failed");
}

/**
 * Validate and clean up the model's JSON output:
 *  - Filter out any links whose href isn't in `ALLOWED_PATHS`.
 *  - Cap to at most 3 suggested links.
 *  - If the model didn't supply a label, pull it from the knowledge base.
 */
function sanitizeResponse(raw: {
  answer?: unknown;
  suggestedLinks?: unknown;
}): ChatResponseBody {
  const answer =
    typeof raw.answer === "string" && raw.answer.trim().length > 0
      ? raw.answer.trim()
      : "I'm here to help you find the right physiotherapy or fitness program. What would you like to know?";

  const rawLinks = Array.isArray(raw.suggestedLinks) ? raw.suggestedLinks : [];
  const seen = new Set<string>();
  const suggestedLinks: SuggestedLink[] = [];

  for (const item of rawLinks) {
    if (!item || typeof item !== "object") continue;
    const candidate = item as { label?: unknown; href?: unknown };
    const href = typeof candidate.href === "string" ? candidate.href.trim() : "";
    if (!ALLOWED_PATHS.has(href) || seen.has(href)) continue;

    const fallbackTitle = findEntryByPath(href)?.title ?? href;
    const label =
      typeof candidate.label === "string" && candidate.label.trim().length > 0
        ? candidate.label.trim()
        : fallbackTitle;

    suggestedLinks.push({ label, href });
    seen.add(href);
    if (suggestedLinks.length >= 3) break;
  }

  return { answer, suggestedLinks };
}

// ───────────────────────────────────────────────────────────── Fallback ──

const FALLBACK_RESPONSE: ChatResponseBody = {
  answer:
    "I'm having trouble connecting right now. You can browse our services or reach out directly — we'll get back to you quickly.",
  suggestedLinks: [
    { label: "All Services", href: "/services" },
    { label: "Contact Us", href: "/contact-us" },
    { label: "Book a Session", href: "/book-a-session" },
  ],
};

// ─────────────────────────────────────────────────────────────── Handler ──

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    if (isRateLimited(ip)) {
      return fail("Too many requests. Please slow down.", 429);
    }

    const json = await req.json().catch(() => null);
    if (!json || typeof json !== "object") {
      return fail("Invalid JSON body", 400);
    }

    const { messages } = chatRequestSchema.parse(json);

    // Trim to the last MAX_HISTORY_MESSAGES.
    const trimmed = messages.slice(-MAX_HISTORY_MESSAGES);

    // Cache only single-turn (no prior assistant context) to avoid stale memory.
    const lastUser = trimmed[trimmed.length - 1];
    const isSingleTurn =
      trimmed.length === 1 && lastUser?.role === "user";
    const cacheKey =
      isSingleTurn && lastUser ? normalizeForCache(lastUser.content) : null;

    if (cacheKey) {
      const cached = readCache(cacheKey);
      if (cached) return ok<ChatResponseBody>(cached);
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("[chat] GEMINI_API_KEY is missing");
      return ok<ChatResponseBody>(FALLBACK_RESPONSE);
    }

    try {
      const result = await callGemini(apiKey, trimmed);
      if (cacheKey) writeCache(cacheKey, result);
      return ok<ChatResponseBody>(result);
    } catch (err) {
      console.error("[chat] Gemini call failed:", err);
      return ok<ChatResponseBody>(FALLBACK_RESPONSE);
    }
  } catch (err) {
    return handleError(err);
  }
}
