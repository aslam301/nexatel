"use client";

import { useState } from "react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError(null);
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !body.ok) throw new Error(body.error || "Failed to send");
      form.reset();
      setStatus("ok");
    } catch (err: unknown) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Failed to send");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      {/* Honeypot */}
      <input type="text" name="company_website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="label" htmlFor="name">Full name</label>
          <input className="input" id="name" name="name" required maxLength={120} autoComplete="name" />
        </div>
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input className="input" id="email" name="email" type="email" required maxLength={200} autoComplete="email" />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="label" htmlFor="organisation">Organisation</label>
          <input className="input" id="organisation" name="organisation" maxLength={160} />
        </div>
        <div>
          <label className="label" htmlFor="topic">Topic</label>
          <select className="select" id="topic" name="topic" defaultValue="general">
            <option value="general">General enquiry</option>
            <option value="it">IT services</option>
            <option value="fiber">Fiber optics / cabling</option>
            <option value="telecom">Telecom infrastructure</option>
            <option value="solar">Electrical / solar</option>
            <option value="hardware">IT hardware supply</option>
          </select>
        </div>
      </div>
      <div>
        <label className="label" htmlFor="message">How can we help?</label>
        <textarea className="textarea" id="message" name="message" rows={5} required maxLength={4000} />
      </div>

      <div className="flex items-center justify-between gap-4">
        <button type="submit" className="btn-primary" disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : "Send enquiry"}
        </button>
        {status === "ok" && (
          <span className="text-sm text-emerald-700">Thanks — we&rsquo;ll be in touch within 1 business day.</span>
        )}
        {status === "error" && <span className="text-sm text-red-700">{error}</span>}
      </div>
    </form>
  );
}
