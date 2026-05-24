"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FeaturedToggle } from "./ServiceForm";
import { ImageUploadField } from "./admin/ImageUploadField";
import type { Project } from "@/lib/types";

export function ProjectForm({ project, mode }: { project?: Project; mode: "create" | "edit" }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [issues, setIssues] = useState<Record<string, string>>({});
  const [featured, setFeatured] = useState<boolean>(project?.featured ?? false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setIssues({});
    const fd = new FormData(e.currentTarget);
    const payload = {
      slug: fd.get("slug"),
      title: fd.get("title"),
      client: fd.get("client"),
      category: fd.get("category"),
      summary: fd.get("summary"),
      description: fd.get("description"),
      year: fd.get("year"),
      image: fd.get("image"),
      featured,
    };
    try {
      const url = mode === "create"
        ? "/api/admin/projects"
        : `/api/admin/projects/${project?.id}`;
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
      router.push("/admin/projects");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  async function onDelete() {
    if (!project) return;
    if (!confirm(`Delete "${project.title}"? This cannot be undone.`)) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/projects/${project.id}`, { method: "DELETE" });
      const body = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !body.ok) throw new Error(body.error || "Delete failed");
      router.push("/admin/projects");
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
          <input id="title" name="title" className="input" defaultValue={project?.title} required maxLength={160} />
          {issues.title && <p className="field-error">{issues.title}</p>}
        </div>
        <div>
          <label className="label" htmlFor="client">Client *</label>
          <input id="client" name="client" className="input" defaultValue={project?.client} required maxLength={160} />
          {issues.client && <p className="field-error">{issues.client}</p>}
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2">
          <label className="label" htmlFor="category">Category *</label>
          <input id="category" name="category" className="input" defaultValue={project?.category} required maxLength={80} placeholder="e.g. Fibre Optic, Network Cabling" />
          {issues.category && <p className="field-error">{issues.category}</p>}
        </div>
        <div>
          <label className="label" htmlFor="year">Year *</label>
          <input id="year" name="year" className="input" defaultValue={project?.year} required maxLength={16} placeholder="2024" />
          {issues.year && <p className="field-error">{issues.year}</p>}
        </div>
      </div>

      <div>
        <label className="label" htmlFor="slug">Slug (leave blank to auto-generate)</label>
        <input id="slug" name="slug" className="input" defaultValue={project?.slug} maxLength={120} placeholder="lower-kebab-case" />
        {issues.slug && <p className="field-error">{issues.slug}</p>}
      </div>

      <div>
        <label className="label" htmlFor="summary">Summary *</label>
        <input id="summary" name="summary" className="input" defaultValue={project?.summary} required maxLength={320} />
        {issues.summary && <p className="field-error">{issues.summary}</p>}
      </div>

      <div>
        <label className="label" htmlFor="description">Description</label>
        <textarea id="description" name="description" className="textarea" rows={5} defaultValue={project?.description} maxLength={4000} />
      </div>

      <ImageUploadField
        name="image"
        defaultValue={project?.image}
        scope="projects"
        slugHint={project?.slug ?? project?.id}
        helperText="Upload a JPG, PNG, WebP, AVIF, GIF or SVG (max 10 MB). Stored on Cloudflare R2."
        error={issues.image}
      />

      <FeaturedToggle
        value={featured}
        onChange={setFeatured}
        label="Show in the homepage recent projects strip"
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
              Delete project
            </button>
          )}
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => router.back()} className="btn-outline">Cancel</button>
          <button type="submit" className="btn-primary" disabled={busy}>
            {busy ? "Saving…" : mode === "create" ? "Create project" : "Save changes"}
          </button>
        </div>
      </div>
    </form>
  );
}
