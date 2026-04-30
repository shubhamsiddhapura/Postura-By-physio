import { NextResponse } from "next/server";
import {
  adminStaticCredentials,
  createAdminSessionToken,
  sessionCookieName,
} from "@/lib/auth";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON" },
      { status: 400 }
    );
  }

  const { email, password } = (body ?? {}) as {
    email?: string;
    password?: string;
  };

  const creds = adminStaticCredentials();
  if (!email || !password || email !== creds.email || password !== creds.password) {
    return NextResponse.json(
      { success: false, error: "Invalid email or password" },
      { status: 401 }
    );
  }

  const token = await createAdminSessionToken({
    email,
    iat: Math.floor(Date.now() / 1000),
  });

  const res = NextResponse.json({ success: true });
  res.cookies.set(sessionCookieName(), token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}

