import type { Product } from "./types";

export type Issue = { field: string; message: string };

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function str(value: unknown, max = 500): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

function strArr(value: unknown, maxItems = 20, maxLen = 200): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((v): v is string => typeof v === "string")
    .map((v) => v.trim().slice(0, maxLen))
    .filter(Boolean)
    .slice(0, maxItems);
}

export interface ProductInput {
  id?: string;
  slug?: string;
  name: string;
  category: string;
  shortDescription: string;
  description: string;
  features: string[];
  image: string;
  datasheetUrl?: string;
}

export function validateProductInput(raw: unknown): {
  ok: true;
  value: ProductInput;
} | { ok: false; issues: Issue[] } {
  const issues: Issue[] = [];
  const data = (raw ?? {}) as Record<string, unknown>;

  const name = str(data.name, 120);
  if (!name) issues.push({ field: "name", message: "Name is required" });

  const category = str(data.category, 80);
  if (!category) issues.push({ field: "category", message: "Category is required" });

  const shortDescription = str(data.shortDescription, 240);
  if (!shortDescription) issues.push({ field: "shortDescription", message: "Short description is required" });

  const description = str(data.description, 4000);
  if (!description) issues.push({ field: "description", message: "Description is required" });

  const features = strArr(data.features);
  const image = str(data.image, 600);
  const datasheetUrl = str(data.datasheetUrl, 600);

  if (image && !/^https?:\/\//i.test(image) && !image.startsWith("/")) {
    issues.push({ field: "image", message: "Image must be an http(s) URL or a /public path" });
  }
  if (datasheetUrl && !/^https?:\/\//i.test(datasheetUrl) && !datasheetUrl.startsWith("/")) {
    issues.push({ field: "datasheetUrl", message: "Datasheet URL must be an http(s) URL or /public path" });
  }

  let slug = str(data.slug, 120);
  if (!slug) slug = slugify(name);
  if (slug && !SLUG_RE.test(slug)) {
    issues.push({ field: "slug", message: "Slug may contain lowercase letters, numbers and dashes only" });
  }

  const id = str(data.id, 80);

  if (issues.length) return { ok: false, issues };

  return {
    ok: true,
    value: {
      id: id || undefined,
      slug,
      name,
      category,
      shortDescription,
      description,
      features,
      image,
      datasheetUrl: datasheetUrl || undefined,
    },
  };
}

export function toProduct(input: ProductInput, existing?: Product): Product {
  return {
    id: input.id || existing?.id || `nx-${Date.now().toString(36)}`,
    slug: input.slug!,
    name: input.name,
    category: input.category,
    shortDescription: input.shortDescription,
    description: input.description,
    features: input.features,
    image: input.image,
    datasheetUrl: input.datasheetUrl,
    createdAt: existing?.createdAt ?? new Date().toISOString(),
  };
}
