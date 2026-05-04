"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Logo } from "@/components/Logo";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/admin/products";
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error || "Invalid credentials");
      router.push(next);
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-start md:items-center justify-center px-5 py-16 relative overflow-hidden"
      style={{ background: "var(--background)" }}
    >
      <div
        className="pointer-events-none absolute -top-32 right-[-10%] h-[420px] w-[420px] rounded-full opacity-50 blur-3xl"
        aria-hidden
        style={{ background: "radial-gradient(closest-side, rgba(124,58,237,0.45), transparent)" }}
      />
      <div
        className="pointer-events-none absolute -bottom-40 left-[-10%] h-[460px] w-[460px] rounded-full opacity-40 blur-3xl"
        aria-hidden
        style={{ background: "radial-gradient(closest-side, rgba(6,182,212,0.40), transparent)" }}
      />
      <div className="relative w-full max-w-sm card p-8">
        <div className="flex items-center justify-between">
          <Logo size={28} />
          <span
            className="text-[10px] tracking-widest uppercase font-semibold px-2 py-0.5 rounded"
            style={{
              color: "var(--violet)",
              background: "rgba(124,58,237,0.10)",
              border: "1px solid rgba(124,58,237,0.30)",
            }}
          >
            Admin
          </span>
        </div>
        <h1 className="mt-6 text-xl font-semibold text-white">Admin sign-in</h1>
        <p className="text-sm text-slate-400 mt-2">
          Enter the admin password to manage the product catalogue and submissions.
        </p>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              autoComplete="current-password"
              required
            />
          </div>
          {error && <div className="field-error">{error}</div>}
          <button className="btn-primary w-full justify-center" disabled={busy}>
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="max-w-sm mx-auto card p-7 text-slate-300">Loading…</div>}>
      <LoginForm />
    </Suspense>
  );
}
