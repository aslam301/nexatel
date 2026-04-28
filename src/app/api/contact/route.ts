import { NextResponse } from "next/server";
import { checkRateLimit, clientIdFromHeaders } from "@/lib/rateLimit";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface ContactPayload {
  name?: string;
  email?: string;
  organisation?: string;
  topic?: string;
  message?: string;
  company_website?: string; // honeypot
}

export async function POST(req: Request) {
  const ip = clientIdFromHeaders(req.headers);
  const rl = checkRateLimit(`contact:${ip}`, { windowMs: 10 * 60_000, max: 5 });
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many submissions. Please try again later." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(rl.retryAfterMs / 1000)) } },
    );
  }

  let data: ContactPayload;
  try {
    data = (await req.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  // Honeypot — silently accept but discard
  if (data.company_website) {
    return NextResponse.json({ ok: true });
  }

  const name = (data.name ?? "").trim().slice(0, 120);
  const email = (data.email ?? "").trim().slice(0, 200);
  const organisation = (data.organisation ?? "").trim().slice(0, 160);
  const topic = (data.topic ?? "general").trim().slice(0, 40);
  const message = (data.message ?? "").trim().slice(0, 4000);

  if (!name || !email || !message) {
    return NextResponse.json({ ok: false, error: "Name, email and message are required" }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "Please provide a valid email" }, { status: 400 });
  }

  // Log so users see submissions in `vercel logs` until an email/CRM provider is wired up.
  console.log(
    JSON.stringify({
      type: "contact_form_submission",
      at: new Date().toISOString(),
      ip,
      name,
      email,
      organisation,
      topic,
      messagePreview: message.slice(0, 200),
    }),
  );

  return NextResponse.json({ ok: true });
}
