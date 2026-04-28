import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { checkRateLimit, clientIdFromHeaders } from "@/lib/rateLimit";
import { appendSubmission, getSettings } from "@/lib/data";
import { sendSubmissionEmail } from "@/lib/email";
import type { Submission } from "@/lib/types";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const VALID_SERVICE_AREAS = new Set([
  "it-services",
  "fiber-optics",
  "telecom",
  "electrical-solar",
  "it-hardware",
  "other",
]);

interface QuotePayload {
  name?: string;
  email?: string;
  organisation?: string;
  phone?: string;
  serviceArea?: string;
  scope?: string;
  budget?: string;
  timeline?: string;
  location?: string;
  message?: string;
  company_website?: string; // honeypot
}

function clip(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(req: Request) {
  const ip = clientIdFromHeaders(req.headers);
  const rl = checkRateLimit(`quote:${ip}`, { windowMs: 10 * 60_000, max: 5 });
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many submissions. Please try again later." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(rl.retryAfterMs / 1000)) } },
    );
  }

  let data: QuotePayload;
  try {
    data = (await req.json()) as QuotePayload;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  if (data.company_website) return NextResponse.json({ ok: true });

  const name = clip(data.name, 120);
  const email = clip(data.email, 200);
  const organisation = clip(data.organisation, 160);
  const phone = clip(data.phone, 40);
  const serviceAreaRaw = clip(data.serviceArea, 40);
  const scope = clip(data.scope, 200);
  const budget = clip(data.budget, 80);
  const timeline = clip(data.timeline, 80);
  const location = clip(data.location, 200);
  const message = clip(data.message, 4000);

  if (!name || !email || !serviceAreaRaw || !message) {
    return NextResponse.json(
      { ok: false, error: "Name, email, service area and message are required" },
      { status: 400 },
    );
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "Please provide a valid email" }, { status: 400 });
  }
  const serviceArea = VALID_SERVICE_AREAS.has(serviceAreaRaw) ? serviceAreaRaw : "other";

  const settings = await getSettings();

  const submission: Submission = {
    id: `q-${randomUUID()}`,
    kind: "quote",
    createdAt: new Date().toISOString(),
    name,
    email,
    organisation: organisation || undefined,
    phone: phone || undefined,
    serviceArea,
    scope: scope || undefined,
    budget: budget || undefined,
    timeline: timeline || undefined,
    location: location || undefined,
    message,
    emailDelivered: false,
    ip,
  };

  const emailRes = await sendSubmissionEmail(submission, settings);
  submission.emailDelivered = emailRes.ok;
  if (!emailRes.ok) submission.emailError = emailRes.error;

  await appendSubmission(submission);

  return NextResponse.json({ ok: true });
}
