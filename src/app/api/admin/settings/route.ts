import { NextResponse } from "next/server";
import { getSettings, isFsWritable, saveSettings } from "@/lib/data";
import type { Settings } from "@/lib/types";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function GET() {
  const settings = await getSettings();
  return NextResponse.json({ ok: true, settings });
}

export async function PUT(req: Request) {
  if (!isFsWritable()) {
    return NextResponse.json(
      { ok: false, error: "Filesystem is read-only on this host. Run locally and commit data/settings.json." },
      { status: 503 },
    );
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }
  const data = (body ?? {}) as Partial<Settings>;
  const notificationEmail = (data.notificationEmail ?? "").trim().slice(0, 200);
  if (!notificationEmail || !EMAIL_RE.test(notificationEmail)) {
    return NextResponse.json({ ok: false, error: "A valid notification email is required" }, { status: 400 });
  }
  const cc = Array.isArray(data.ccEmails) ? data.ccEmails : [];
  const ccEmails = cc
    .filter((v): v is string => typeof v === "string")
    .map((v) => v.trim().slice(0, 200))
    .filter(Boolean)
    .filter((e) => EMAIL_RE.test(e))
    .slice(0, 10);
  const settings: Settings = {
    notificationEmail,
    ccEmails,
    emailSubjectPrefix: ((data.emailSubjectPrefix ?? "[Nexatel]") + "").trim().slice(0, 40) || "[Nexatel]",
    autoReplyEnabled: !!data.autoReplyEnabled,
    updatedAt: new Date().toISOString(),
  };
  await saveSettings(settings);
  return NextResponse.json({ ok: true, settings });
}
