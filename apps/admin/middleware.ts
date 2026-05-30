import { NextResponse, type NextRequest } from "next/server";
import { sessionCookieName, verifyAdminSessionToken } from "@/lib/auth";

const PUBLIC_PATHS = new Set<string>([
  "/login",
  "/api/admin/login",
  "/api/admin/logout",
]);

function isPublicPath(pathname: string): boolean {
  if (PUBLIC_PATHS.has(pathname)) return true;
  if (pathname.startsWith("/_next/")) return true;
  if (pathname === "/favicon.ico") return true;
  if (pathname.startsWith("/assets/")) return true;
  // Allow public files in /public (e.g. /admin-logo.png, /logo.svg).
  if (/\.[a-zA-Z0-9]+$/.test(pathname)) return true;
  return false;
}

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  if (isPublicPath(pathname)) return NextResponse.next();

  const token = req.cookies.get(sessionCookieName())?.value;
  if (token) {
    const payload = await verifyAdminSessionToken(token);
    if (payload) return NextResponse.next();
  }

  const url = req.nextUrl.clone();
  url.pathname = "/login";
  url.searchParams.set("next", `${pathname}${search}`);
  return NextResponse.redirect(url);
}

export const config = {
  // Exclude Next internals + any request for a file (has an extension).
  matcher: ["/((?!_next/static|_next/image|.*\\..*).*)"],
};

