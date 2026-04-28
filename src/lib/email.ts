import type { Submission, Settings } from "./types";

export interface EmailResult {
  ok: boolean;
  provider: "resend" | "console";
  error?: string;
}

const FROM = process.env.EMAIL_FROM || "Nexatel <onboarding@resend.dev>";

function escapeHtml(s: string | undefined | null): string {
  return String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string),
  );
}

function row(label: string, value: string | undefined | null): string {
  if (!value) return "";
  return `<tr>
    <td style="padding:6px 16px 6px 0;color:#475569;font-size:13px;white-space:nowrap;vertical-align:top;">${escapeHtml(label)}</td>
    <td style="padding:6px 0;color:#0a2540;font-size:14px;">${escapeHtml(value)}</td>
  </tr>`;
}

function renderHtml(s: Submission): string {
  const isQuote = s.kind === "quote";
  const heading = isQuote ? "New quote request" : "New contact enquiry";
  const accent = "#f59e0b";
  return `<!doctype html><html><body style="margin:0;background:#f8fafc;font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#0a2540;">
  <div style="max-width:640px;margin:0 auto;padding:32px 16px;">
    <div style="background:#0a2540;color:#fff;padding:24px 28px;border-radius:14px 14px 0 0;">
      <div style="font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:${accent};font-weight:700;">Nexatel · ${escapeHtml(s.kind)}</div>
      <div style="font-size:22px;font-weight:700;margin-top:6px;">${heading}</div>
      <div style="font-size:13px;color:#94a3b8;margin-top:4px;">${escapeHtml(new Date(s.createdAt).toUTCString())}</div>
    </div>
    <div style="background:#ffffff;border:1px solid #e2e8f0;border-top:0;border-radius:0 0 14px 14px;padding:24px 28px;">
      <table style="width:100%;border-collapse:collapse;">
        ${row("Name", s.name)}
        ${row("Email", s.email)}
        ${row("Organisation", s.organisation)}
        ${row("Phone", s.phone)}
        ${row("Topic", s.topic)}
        ${row("Service area", s.serviceArea)}
        ${row("Scope", s.scope)}
        ${row("Budget", s.budget)}
        ${row("Timeline", s.timeline)}
        ${row("Location", s.location)}
      </table>
      <div style="margin-top:18px;padding:14px 16px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;font-size:14px;line-height:1.55;white-space:pre-wrap;">${escapeHtml(s.message)}</div>
      <div style="margin-top:20px;font-size:12px;color:#94a3b8;">Submission ID: ${escapeHtml(s.id)} · Source: nexatel.org</div>
    </div>
  </div>
</body></html>`;
}

function renderText(s: Submission): string {
  const lines = [
    `Nexatel — ${s.kind === "quote" ? "Quote request" : "Contact enquiry"}`,
    `Received: ${new Date(s.createdAt).toUTCString()}`,
    "",
    `Name: ${s.name}`,
    `Email: ${s.email}`,
  ];
  if (s.organisation) lines.push(`Organisation: ${s.organisation}`);
  if (s.phone) lines.push(`Phone: ${s.phone}`);
  if (s.topic) lines.push(`Topic: ${s.topic}`);
  if (s.serviceArea) lines.push(`Service area: ${s.serviceArea}`);
  if (s.scope) lines.push(`Scope: ${s.scope}`);
  if (s.budget) lines.push(`Budget: ${s.budget}`);
  if (s.timeline) lines.push(`Timeline: ${s.timeline}`);
  if (s.location) lines.push(`Location: ${s.location}`);
  lines.push("", "Message:", s.message, "", `Submission ID: ${s.id}`);
  return lines.join("\n");
}

export async function sendSubmissionEmail(submission: Submission, settings: Settings): Promise<EmailResult> {
  const subject = `${settings.emailSubjectPrefix || "[Nexatel]"} ${submission.kind === "quote" ? "Quote request" : "Contact"} — ${submission.name}`;
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    // Graceful fallback: log to stdout so it's visible in `vercel logs`,
    // and still mark the submission as not delivered so the admin sees it.
    console.log(
      JSON.stringify({
        type: "email_skipped_no_provider",
        to: settings.notificationEmail,
        subject,
        submission,
      }),
    );
    return { ok: false, provider: "console", error: "RESEND_API_KEY not configured" };
  }

  try {
    // Lazy import so the build doesn't fail if the package is absent.
    const { Resend } = await import("resend");
    const client = new Resend(apiKey);
    const result = await client.emails.send({
      from: FROM,
      to: [settings.notificationEmail, ...(settings.ccEmails || [])].filter(Boolean),
      replyTo: submission.email,
      subject,
      html: renderHtml(submission),
      text: renderText(submission),
    });
    if ((result as { error?: { message?: string } }).error) {
      const msg = (result as { error: { message?: string } }).error.message || "Resend API error";
      return { ok: false, provider: "resend", error: msg };
    }
    return { ok: true, provider: "resend" };
  } catch (err) {
    return {
      ok: false,
      provider: "resend",
      error: err instanceof Error ? err.message : String(err),
    };
  }
}
