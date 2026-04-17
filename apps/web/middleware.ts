import { NextRequest, NextResponse } from "next/server";

/**
 * Adds permissive CORS headers to every `/api/*` response and answers
 * pre-flight `OPTIONS` requests so the admin dashboard (running on a
 * different port in dev) can call the web API from the browser.
 *
 * For production, tighten `Access-Control-Allow-Origin` to the admin's
 * deployed origin (e.g. `https://admin.example.com`).
 */
const ALLOWED_ORIGIN = process.env.ADMIN_ORIGIN ?? "*";
const ALLOWED_METHODS = "GET, POST, PATCH, DELETE, OPTIONS";
const ALLOWED_HEADERS = "Content-Type, Authorization";

function withCors(res: NextResponse) {
  res.headers.set("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
  res.headers.set("Access-Control-Allow-Methods", ALLOWED_METHODS);
  res.headers.set("Access-Control-Allow-Headers", ALLOWED_HEADERS);
  res.headers.set("Access-Control-Max-Age", "86400");
  return res;
}

export function middleware(req: NextRequest) {
  if (req.method === "OPTIONS") {
    return withCors(new NextResponse(null, { status: 204 }));
  }
  return withCors(NextResponse.next());
}

export const config = {
  matcher: ["/api/:path*"],
};
