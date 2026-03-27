import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE = "mc_session";
const SESSION_VALUE = "authorized";

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    // Password comes from Railway environment variable
    const correctPassword = process.env.MC_PASSWORD;

    if (!correctPassword) {
      // If env var not set, reject all (fail closed)
      return NextResponse.json({ error: "Auth not configured" }, { status: 500 });
    }

    if (password !== correctPassword) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    // Password correct — set session cookie
    const response = NextResponse.json({ ok: true });
    response.cookies.set(SESSION_COOKIE, SESSION_VALUE, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
