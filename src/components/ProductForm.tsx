"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FeaturedToggle } from "./ServiceForm";
import { ImageUploadField } from "./admin/ImageUploadField";
import type { Product } from "@/lib/types";

export function ProductForm({ product, mode }: { product?: Product; mode: "create" | "edit" }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [issues, setIssues] = useState<Record<string, string>>({});
  const [featured, setFeatured] = useState<boolean>(product?.featured ?? false);
  const [seoOpen, setSeoOpen] = useState<boolean>(
    Boolean(product?.seoTitle || product?.seoDescription || product?.seoImage)
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setIssues({});
    const fd = new FormData(e.currentTarget);
    const features = String(fd.get("features") || "")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    const payload = {
      slug: fd.get("slug"),
      name: fd.get("name"),
      category: fd.get("category"),
      shortDescription: fd.get("shortDescription"),
      description: fd.get("description"),
      image: fd.get("image"),
      datasheetUrl: fd.get("datasheetUrl"),
      seoTitle: fd.get("seoTitle"),
      seoDescription: fd.get("seoDescription"),
      seoImage: fd.get("seoImage"),
      features,
      featured,
    };
    try {
      const url = mode === "create"
        ? "/api/admin/products"
        : `/api/admin/products/${product?.id}`;
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
      router.push("/admin/products");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  async function onDelete() {
    if (!product) return;
    if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, { method: "DELETE" });
      const body = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !body.ok) throw new Error(body.error || "Delete failed");
      router.push("/admin/products");
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
          <label className="label" htmlFor="name">Name *</label>
          <input id="name" name="name" className="input" defaultValue={product?.name} required maxLength={120} />
          {issues.name && <p className="field-error">{issues.name}</p>}
        </div>
        <div>
          <label className="label" htmlFor="category">Category *</label>
          <input id="category" name="category" className="input" defaultValue={product?.category} required maxLength={80} />
          {issues.category && <p className="field-error">{issues.category}</p>}
        </div>
      </div>

      <div>
        <label className="label" htmlFor="slug">Slug (leave blank to auto-generate)</label>
        <input id="slug" name="slug" className="input" defaultValue={product?.slug} maxLength={120} placeholder="lower-kebab-case" />
        {issues.slug && <p className="field-error">{issues.slug}</p>}
      </div>

      <div>
        <label className="label" htmlFor="shortDescription">Short description *</label>
        <input id="shortDescription" name="shortDescription" className="input" defaultValue={product?.shortDescription} required maxLength={240} />
        {issues.shortDescription && <p className="field-error">{issues.shortDescription}</p>}
      </div>

      <div>
        <label className="label" htmlFor="description">Description *</label>
        <textarea id="description" name="description" className="textarea" rows={5} defaultValue={product?.description} required maxLength={4000} />
        {issues.description && <p className="field-error">{issues.description}</p>}
      </div>

      <div>
        <label className="label" htmlFor="features">Features (one per line)</label>
        <textarea
          id="features"
          name="features"
          className="textarea"
          rows={5}
          defaultValue={product?.features?.join("\n")}
        />
      </div>

      <ImageUploadField
        name="image"
        defaultValue={product?.image}
        scope="products"
        slugHint={product?.slug ?? product?.id}
        helperText="Upload a JPG, PNG, WebP, AVIF, GIF or SVG (max 10 MB). Stored on Cloudflare R2."
        error={issues.image}
      />

      <div>
        <label className="label" htmlFor="datasheetUrl">Datasheet URL</label>
        <input id="datasheetUrl" name="datasheetUrl" className="input" defaultValue={product?.datasheetUrl} placeholder="optional" />
        {issues.datasheetUrl && <p className="field-error">{issues.datasheetUrl}</p>}
      </div>

      <FeaturedToggle
        value={featured}
        onChange={setFeatured}
        label="Show in the homepage featured products grid"
      />

      {/* SEO / Open Graph overrides — collapsible. All fields are optional and
          fall back to name / description / image when left blank. */}
      <div
        className="rounded-xl"
        style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)" }}
      >
        <button
          type="button"
          onClick={() => setSeoOpen((v) => !v)}
          className="w-full flex items-center justify-between px-5 py-4 text-left"
          aria-expanded={seoOpen}
        >
          <div>
            <div className="text-sm font-semibold text-white">SEO &amp; sharing</div>
            <div className="text-xs text-slate-400 mt-0.5">
              Optional overrides. Defaults to product name, description and image.
            </div>
          </div>
          <span className="text-slate-400 text-lg leading-none">{seoOpen ? "−" : "+"}</span>
        </button>
        {seoOpen && (
          <div className="px-5 pb-5 pt-1 space-y-4">
            <div>
              <label className="label" htmlFor="seoTitle">Meta title</label>
              <input
                id="seoTitle"
                name="seoTitle"
                className="input"
                defaultValue={product?.seoTitle ?? ""}
                maxLength={120}
                placeholder={product?.name || "Defaults to product name"}
              />
              <p className="text-xs text-slate-500 mt-1.5">Shown in browser tabs and search results. Leave blank to use the product name.</p>
            </div>
            <div>
              <label className="label" htmlFor="seoDescription">Meta description</label>
              <textarea
                id="seoDescription"
                name="seoDescription"
                className="textarea"
                rows={3}
                defaultValue={product?.seoDescription ?? ""}
                maxLength={320}
                placeholder="Defaults to a trimmed description (≤160 chars)"
              />
              <p className="text-xs text-slate-500 mt-1.5">~120-160 characters works best for social previews and search snippets.</p>
            </div>
            <div>
              <label className="label" htmlFor="seoImage">Open Graph image URL</label>
              <input
                id="seoImage"
                name="seoImage"
                className="input"
                defaultValue={product?.seoImage ?? ""}
                placeholder="Defaults to the product image; site default if neither is set"
              />
              {issues.seoImage && <p className="field-error">{issues.seoImage}</p>}
              <p className="text-xs text-slate-500 mt-1.5">1200×630 recommended. Leave blank to inherit the product image.</p>
            </div>
          </div>
        )}
      </div>

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
              Delete product
            </button>
          )}
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => router.back()} className="btn-outline">Cancel</button>
          <button type="submit" className="btn-primary" disabled={busy}>
            {busy ? "Saving…" : mode === "create" ? "Create product" : "Save changes"}
          </button>
        </div>
      </div>
    </form>
  );
}
