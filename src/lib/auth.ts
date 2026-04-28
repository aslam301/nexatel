import { createHmac, timingSafeEqual, randomBytes } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "nx_admin";
const SESSION_TTL_MS = 1000 * 60 * 60 * 8; // 8 hours

function getSecret(): string {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (!s || s.length < 16) {
    throw new Error(
      "ADMIN_SESSION_SECRET is missing or too short. Set it in .env.local (>= 32 chars).",
    );
  }
  return s;
}

function getAdminPassword(): string {
  const p = process.env.ADMIN_PASSWORD;
  if (!p || p.length < 6) {
    throw new Error("ADMIN_PASSWORD is missing or too short. Set it in .env.local.");
  }
  return p;
}

function sign(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("hex");
}

export interface SessionToken {
  iat: number;
  exp: number;
  nonce: string;
}

export function createSessionToken(): string {
  const now = Date.now();
  const data: SessionToken = {
    iat: now,
    exp: now + SESSION_TTL_MS,
    nonce: randomBytes(8).toString("hex"),
  };
  const payload = Buffer.from(JSON.stringify(data)).toString("base64url");
  const sig = sign(payload);
  return `${payload}.${sig}`;
}

export function verifySessionToken(token: string | undefined): SessionToken | null {
  if (!token) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const expected = sign(payload);
  const a = Buffer.from(sig, "hex");
  const b = Buffer.from(expected, "hex");
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as SessionToken;
    if (typeof data.exp !== "number" || data.exp < Date.now()) return null;
    return data;
  } catch {
    return null;
  }
}

export function checkAdminPassword(input: string): boolean {
  const expected = Buffer.from(getAdminPassword());
  const got = Buffer.from(input ?? "");
  if (expected.length !== got.length) return false;
  return timingSafeEqual(expected, got);
}

export async function isAuthenticated(): Promise<boolean> {
  const c = await cookies();
  return verifySessionToken(c.get(COOKIE_NAME)?.value) !== null;
}

export const ADMIN_COOKIE_NAME = COOKIE_NAME;
export const SESSION_TTL_SECONDS = Math.floor(SESSION_TTL_MS / 1000);
