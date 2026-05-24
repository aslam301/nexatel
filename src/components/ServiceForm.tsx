"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUploadField } from "./admin/ImageUploadField";
import type { Service } from "@/lib/types";

const ICONS = ["box", "cabling", "fiber", "tower", "cctv", "bolt", "cpu"] as const;

export function ServiceForm({ service, mode }: { service?: Service; mode: "create" | "edit" }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [issues, setIssues] = useState<Record<string, string>>({});
  const [featured, setFeatured] = useState<boolean>(service?.featured ?? false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setIssues({});
    const fd = new FormData(e.currentTarget);
    const highlights = String(fd.get("highlights") || "")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    const payload = {
      slug: fd.get("slug"),
      title: fd.get("title"),
      summary: fd.get("summary"),
      details: fd.get("details"),
      icon: fd.get("icon"),
      image: fd.get("image"),
      highlights,
      featured,
    };
    try {
      const url = mode === "create"
        ? "/api/admin/services"
        : `/api/admin/services/${service?.slug}`;
      const method = mode === "create" ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = (await res.json()) as { ok: boolean; error?: string; issues?: { field: string; message: string }[] };
      if (!res.ok || !body.ok) {
        if (body.issues) {
          const map: Record<string, string> = {};
          body.issues.forEach((i) => { map[i.field] = i.message; });
          setIssues(map);
        }
        throw new Error(body.error || "Save failed");
      }
      router.push("/admin/services");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  async function onDelete() {
    if (!service) return;
    if (!confirm(`Delete "${service.title}"? This cannot be undone.`)) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/services/${service.slug}`, { method: "DELETE" });
      const body = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !body.ok) throw new Error(body.error || "Delete failed");
      router.push("/admin/services");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Delete failed");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="label" htmlFor="title">Title *</label>
          <input id="title" name="title" className="input" defaultValue={service?.title} required maxLength={120} />
          {issues.title && <p className="field-error">{issues.title}</p>}
        </div>
        <div>
          <label className="label" htmlFor="icon">Icon</label>
          <select id="icon" name="icon" className="select" defaultValue={service?.icon ?? "box"}>
            {ICONS.map((i) => <option key={i} value={i}>{i}</option>)}
          </select>
          {issues.icon && <p className="field-error">{issues.icon}</p>}
        </div>
      </div>

      <div>
        <label className="label" htmlFor="slug">Slug (leave blank to auto-generate)</label>
        <input id="slug" name="slug" className="input" defaultValue={service?.slug} maxLength={120} placeholder="lower-kebab-case" />
        {issues.slug && <p className="field-error">{issues.slug}</p>}
      </div>

      <div>
        <label className="label" htmlFor="summary">Summary *</label>
        <input id="summary" name="summary" className="input" defaultValue={service?.summary} required maxLength={280} />
        {issues.summary && <p className="field-error">{issues.summary}</p>}
      </div>

      <div>
        <label className="label" htmlFor="details">Details *</label>
        <textarea id="details" name="details" className="textarea" rows={5} defaultValue={service?.details} required maxLength={4000} />
        {issues.details && <p className="field-error">{issues.details}</p>}
      </div>

      <div>
        <label className="label" htmlFor="highlights">Highlights (one per line)</label>
        <textarea
          id="highlights"
          name="highlights"
          className="textarea"
          rows={5}
          defaultValue={service?.highlights?.join("\n")}
        />
      </div>

      <ImageUploadField
        name="image"
        defaultValue={service?.image}
        scope="services"
        slugHint={service?.slug}
        helperText="Upload a JPG, PNG, WebP, AVIF, GIF or SVG (max 10 MB). Stored on Cloudflare R2."
        error={issues.image}
      />

      <FeaturedToggle
        value={featured}
        onChange={setFeatured}
        label="Show on the homepage services grid"
      />

      {error && (
        <div
          className="rounded-lg p-3 text-sm text-red-200"
          style={{ background: "rgba(239,68,68,0.10)", border: "1px solid rgba(239,68,68,0.35)" }}
        >
          {error}
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
        <div>
          {mode === "edit" && (
            <button type="button" onClick={onDelete} className="text-sm font-semibold text-red-300 hover:text-red-200" disabled={busy}>
              Delete service
            </button>
          )}
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => router.back()} className="btn-outline">Cancel</button>
          <button type="submit" className="btn-primary" disabled={busy}>
            {busy ? "Saving…" : mode === "create" ? "Create service" : "Save changes"}
          </button>
        </div>
      </div>
    </form>
  );
}

export function FeaturedToggle({
  value,
  onChange,
  label,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label
      className="flex items-center justify-between gap-4 rounded-xl px-5 py-4 cursor-pointer select-none"
      style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)" }}
    >
      <div>
        <div className="text-sm font-semibold text-white">Featured on homepage</div>
        <div className="text-xs text-slate-400 mt-0.5">{label}</div>
      </div>
      <span
        role="switch"
        aria-checked={value}
        tabIndex={0}
        onClick={() => onChange(!value)}
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            onChange(!value);
          }
        }}
        className="relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors"
        style={{
          background: value ? "var(--violet)" : "rgba(148,163,184,0.30)",
        }}
      >
        <span
          className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform"
          style={{ transform: value ? "translateX(22px)" : "translateX(2px)" }}
        />
      </span>
    </label>
  );
}
