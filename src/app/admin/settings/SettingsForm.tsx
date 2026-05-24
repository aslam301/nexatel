"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Settings } from "@/lib/types";

export function SettingsForm({ initial, writable }: { initial: Settings; writable: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setStatus("idle");
    setError(null);
    const fd = new FormData(e.currentTarget);
    const ccRaw = String(fd.get("ccEmails") || "");
    const ccEmails = ccRaw
      .split(/[,;\n]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    const defaultOgImage = String(fd.get("defaultOgImage") || "").trim();
    const defaultMetaDescription = String(fd.get("defaultMetaDescription") || "").trim();
    const payload: Settings = {
      notificationEmail: String(fd.get("notificationEmail") || "").trim(),
      ccEmails,
      emailSubjectPrefix: String(fd.get("emailSubjectPrefix") || "").trim() || "[Nexatel]",
      autoReplyEnabled: fd.get("autoReplyEnabled") === "on",
      defaultOgImage: defaultOgImage || undefined,
      defaultMetaDescription: defaultMetaDescription || undefined,
      updatedAt: new Date().toISOString(),
    };
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !body.ok) throw new Error(body.error || "Save failed");
      setStatus("ok");
      router.refresh();
    } catch (err: unknown) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {!writable && (
        <div
          className="rounded-lg p-3.5 text-sm text-amber-200"
          style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.30)" }}
        >
          Read-only environment — saving will fail until you run locally or wire writable storage.
        </div>
      )}

      {/* Notification settings */}
      <section className="card p-6 md:p-7">
        <h2 className="text-base font-semibold text-white">Notifications</h2>
        <p className="text-xs text-slate-400 mt-1">Where contact + quote submissions get emailed.</p>
        <div className="mt-5 space-y-4">
          <div>
            <label className="label" htmlFor="notificationEmail">Notification email *</label>
            <input
              id="notificationEmail"
              name="notificationEmail"
              type="email"
              className="input"
              defaultValue={initial.notificationEmail}
              required
              maxLength={200}
            />
          </div>

          <div>
            <label className="label" htmlFor="ccEmails">CC addresses</label>
            <input
              id="ccEmails"
              name="ccEmails"
              className="input"
              defaultValue={initial.ccEmails.join(", ")}
              placeholder="ops@nexatel.org, sales@nexatel.org"
            />
            <p className="text-xs text-slate-500 mt-1.5">Comma- or semicolon-separated. Leave blank for none.</p>
          </div>

          <div>
            <label className="label" htmlFor="emailSubjectPrefix">Email subject prefix</label>
            <input
              id="emailSubjectPrefix"
              name="emailSubjectPrefix"
              className="input"
              defaultValue={initial.emailSubjectPrefix}
              maxLength={40}
            />
          </div>

          <label className="flex items-start gap-3 cursor-pointer pt-1">
            <input type="checkbox" name="autoReplyEnabled" defaultChecked={initial.autoReplyEnabled} className="mt-1" />
            <div>
              <div className="text-sm font-semibold text-white">Send auto-reply to submitter</div>
              <div className="text-xs text-slate-400 mt-0.5">When enabled, a confirmation email is sent to the person submitting the form.</div>
            </div>
          </label>
        </div>
      </section>

      {/* Site-wide SEO defaults */}
      <section className="card p-6 md:p-7">
        <h2 className="text-base font-semibold text-white">SEO &amp; sharing defaults</h2>
        <p className="text-xs text-slate-400 mt-1">
          Site-wide fallbacks used when a page or product doesn&rsquo;t supply its own meta image or description.
        </p>
        <div className="mt-5 space-y-4">
          <div>
            <label className="label" htmlFor="defaultOgImage">Default Open Graph image URL</label>
            <input
              id="defaultOgImage"
              name="defaultOgImage"
              className="input"
              defaultValue={initial.defaultOgImage ?? ""}
              placeholder="https://… or /og-default.png  (1200×630)"
            />
            <p className="text-xs text-slate-500 mt-1.5">
              Used when a page has no image override and the content (product, service or project) has no image either. 1200&times;630 PNG/JPG recommended.
            </p>
          </div>
          <div>
            <label className="label" htmlFor="defaultMetaDescription">Default meta description</label>
            <textarea
              id="defaultMetaDescription"
              name="defaultMetaDescription"
              className="textarea"
              rows={3}
              defaultValue={initial.defaultMetaDescription ?? ""}
              maxLength={320}
              placeholder="A short, punchy description used when an individual page leaves it blank."
            />
            <p className="text-xs text-slate-500 mt-1.5">~120-160 characters works best.</p>
          </div>
        </div>
      </section>

      <div
        className="flex items-center gap-3 pt-2"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <button type="submit" className="btn-primary mt-4" disabled={busy}>{busy ? "Saving…" : "Save settings"}</button>
        {status === "ok" && <span className="text-sm text-emerald-300 mt-4">Saved.</span>}
        {status === "error" && <span className="text-sm text-red-300 mt-4">{error}</span>}
        <span className="ml-auto mt-4 text-xs text-slate-500">Last updated {new Date(initial.updatedAt).toLocaleString()}</span>
      </div>
    </form>
  );
}
