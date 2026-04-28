import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, SESSION_TTL_SECONDS, checkAdminPassword, createSessionToken } from "@/lib/auth";
import { checkRateLimit, clientIdFromHeaders } from "@/lib/rateLimit";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const ip = clientIdFromHeaders(req.headers);
  const rl = checkRateLimit(`login:${ip}`, { windowMs: 5 * 60_000, max: 8 });
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many attempts. Try again shortly." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(rl.retryAfterMs / 1000)) } },
    );
  }
  let body: { password?: string };
  try {
    body = (await req.json()) as { password?: string };
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }
  if (!body?.password || typeof body.password !== "string") {
    return NextResponse.json({ ok: false, error: "Password required" }, { status: 400 });
  }
  if (!checkAdminPassword(body.password)) {
    return NextResponse.json({ ok: false, error: "Invalid password" }, { status: 401 });
  }
  const token = createSessionToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
  return res;
}
