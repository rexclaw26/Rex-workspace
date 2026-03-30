import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_PATHS = ["/calendar", "/decks", "/headlines", "/memory", "/ops", "/slides", "/tasks", "/x-feed", "/ready-posts"];
const PUBLIC_PATHS = ["/login", "/api/", "/_next", "/favicon"];
const SESSION_COOKIE = "mc_session";
const SESSION_VALUE = "authorized"; // Value stored in cookie when authenticated

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (PUBLIC_PATHS.some(p => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Allow static assets
  if (pathname.startsWith("/_next") || pathname.includes(".")) {
    return NextResponse.next();
  }

  // Check auth cookie on all other routes
  const session = request.cookies.get(SESSION_COOKIE)?.value;
  if (session === SESSION_VALUE) {
    return NextResponse.next();
  }

  // Not authenticated → redirect to login
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("from", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
