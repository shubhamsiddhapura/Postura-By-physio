import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { sessionCookieName, verifyAdminSessionToken } from "@/lib/auth";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function parseInviteEmail(body: unknown): string | null {
  if (!body || typeof body !== "object") return null;
  const raw = (body as { email?: unknown }).email;
  if (typeof raw !== "string") return null;
  const email = raw.trim();
  if (!email || !EMAIL_RE.test(email)) return null;
  return email;
}

export async function POST(req: Request) {
  const cookieStore = cookies();
  const token = cookieStore.get(sessionCookieName())?.value;
  const session = token ? await verifyAdminSessionToken(token) : null;
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  let rawBody: unknown;
  try {
    rawBody = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON" },
      { status: 400 }
    );
  }

  const email = parseInviteEmail(rawBody);
  if (!email) {
    return NextResponse.json(
      { success: false, error: "Valid email address is required" },
      { status: 400 }
    );
  }

  const secret = process.env.ADMIN_INTERNAL_API_SECRET?.trim();
  if (!secret) {
    return NextResponse.json(
      {
        success: false,
        error:
          "Server misconfiguration: ADMIN_INTERNAL_API_SECRET is not set on the admin app.",
      },
      { status: 503 }
    );
  }

  const url = `${API_BASE_URL.replace(/\/+$/, "")}/api/internal/testimonials/send-share-invite`;

  let upstream: Response;
  try {
    upstream = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${secret}`,
      },
      body: JSON.stringify({ email }),
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Could not reach the web API. Is it running?" },
      { status: 502 }
    );
  }

  const text = await upstream.text();
  let parsed: { success?: boolean; data?: unknown; error?: string };
  try {
    parsed = text ? JSON.parse(text) : {};
  } catch {
    return NextResponse.json(
      { success: false, error: `Unreadable response from web API (${upstream.status})` },
      { status: 502 }
    );
  }

  if (!upstream.ok || parsed.success === false) {
    const errMsg =
      typeof parsed.error === "string"
        ? parsed.error
        : `Invite request failed (${upstream.status})`;
    return NextResponse.json(
      { success: false, error: errMsg },
      { status: upstream.status >= 400 && upstream.status < 600 ? upstream.status : 502 }
    );
  }

  return NextResponse.json({
    success: true as const,
    data: parsed.data ?? {},
  });
}
