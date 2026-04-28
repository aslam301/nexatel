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
    const payload: Settings = {
      notificationEmail: String(fd.get("notificationEmail") || "").trim(),
      ccEmails,
      emailSubjectPrefix: String(fd.get("emailSubjectPrefix") || "").trim() || "[Nexatel]",
      autoReplyEnabled: fd.get("autoReplyEnabled") === "on",
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
    <form onSubmit={onSubmit} className="space-y-5">
      {!writable && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
          Read-only environment — saving will fail until you run locally or wire writable storage.
        </div>
      )}

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
        <p className="text-xs text-slate-500 mt-1.5">All contact and quote submissions are emailed here.</p>
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

      <label className="flex items-start gap-3 cursor-pointer">
        <input type="checkbox" name="autoReplyEnabled" defaultChecked={initial.autoReplyEnabled} className="mt-1" />
        <div>
          <div className="text-sm font-semibold text-[var(--primary)]">Send auto-reply to submitter</div>
          <div className="text-xs text-slate-500 mt-0.5">When enabled, a confirmation email is sent to the person submitting the form.</div>
        </div>
      </label>

      <div className="flex items-center gap-3 pt-3 border-t border-[var(--border)]">
        <button type="submit" className="btn-primary" disabled={busy}>{busy ? "Saving…" : "Save settings"}</button>
        {status === "ok" && <span className="text-sm text-emerald-700">Saved.</span>}
        {status === "error" && <span className="text-sm text-red-700">{error}</span>}
        <span className="ml-auto text-xs text-slate-500">Last updated {new Date(initial.updatedAt).toLocaleString()}</span>
      </div>
    </form>
  );
}
