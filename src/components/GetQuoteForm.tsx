"use client";

import { useState } from "react";

const SERVICE_AREAS = [
  { value: "it-services", label: "IT Services & Solutions" },
  { value: "fiber-optics", label: "Fiber Optics & Structured Cabling" },
  { value: "telecom", label: "Telecom Infrastructure" },
  { value: "electrical-solar", label: "Electrical, Solar & Energy" },
  { value: "it-hardware", label: "IT Hardware Supply" },
  { value: "other", label: "Something else" },
];

const BUDGETS = ["< $5k", "$5k – $25k", "$25k – $100k", "$100k – $500k", "> $500k", "Not sure yet"];
const TIMELINES = ["ASAP", "Within 1 month", "1 – 3 months", "3 – 6 months", "Flexible"];

export function GetQuoteForm({ defaultServiceArea }: { defaultServiceArea?: string }) {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError(null);
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !body.ok) throw new Error(body.error || "Failed to submit");
      form.reset();
      setStatus("ok");
    } catch (err: unknown) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Failed to submit");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <input type="text" name="company_website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="label" htmlFor="q-name">Full name *</label>
          <input id="q-name" name="name" className="input" required maxLength={120} autoComplete="name" />
        </div>
        <div>
          <label className="label" htmlFor="q-email">Email *</label>
          <input id="q-email" name="email" type="email" className="input" required maxLength={200} autoComplete="email" />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="label" htmlFor="q-organisation">Organisation</label>
          <input id="q-organisation" name="organisation" className="input" maxLength={160} />
        </div>
        <div>
          <label className="label" htmlFor="q-phone">Phone</label>
          <input id="q-phone" name="phone" className="input" maxLength={40} autoComplete="tel" />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="label" htmlFor="q-serviceArea">Service area *</label>
          <select id="q-serviceArea" name="serviceArea" className="select" defaultValue={defaultServiceArea || ""} required>
            <option value="" disabled>Select a service…</option>
            {SERVICE_AREAS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="q-location">Project location</label>
          <input id="q-location" name="location" className="input" maxLength={200} placeholder="City / country" />
        </div>
      </div>

      <div>
        <label className="label" htmlFor="q-scope">One-line scope</label>
        <input id="q-scope" name="scope" className="input" maxLength={200} placeholder="e.g. 8 km OFC backbone for new campus" />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="label" htmlFor="q-budget">Indicative budget</label>
          <select id="q-budget" name="budget" className="select" defaultValue="">
            <option value="">Select range…</option>
            {BUDGETS.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="q-timeline">Target timeline</label>
          <select id="q-timeline" name="timeline" className="select" defaultValue="">
            <option value="">Select…</option>
            {TIMELINES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="label" htmlFor="q-message">Project details *</label>
        <textarea id="q-message" name="message" className="textarea" rows={5} required maxLength={4000} placeholder="Tell us about the site, constraints, expected outcomes…" />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-xs text-slate-500">We&rsquo;ll usually reply within one business day. Your details are emailed to our project team and stored securely.</p>
        <button type="submit" className="btn-primary" disabled={status === "sending"}>
          {status === "sending" ? "Submitting…" : "Request quote"}
        </button>
      </div>

      {status === "ok" && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Thanks — your request has been received. We&rsquo;ll be in touch shortly.
        </div>
      )}
      {status === "error" && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>
      )}
    </form>
  );
}
