import { promises as fs } from "node:fs";
import path from "node:path";
import { head, put, type HeadBlobResult } from "@vercel/blob";

/**
 * One persistence layer for every JSON document in data/.
 *
 * - When BLOB_READ_WRITE_TOKEN is set, we use Vercel Blob. Reads fetch the
 *   blob's public URL; writes overwrite the same stable pathname. The very
 *   first read for any file falls back to the bundled data/<file> in the
 *   deploy, seeds Blob with it, and returns it. This means a fresh Blob
 *   store boots up with the same content the repo committed.
 * - Without the token (local dev, no Blob enabled), we read and write the
 *   filesystem directly, same as before.
 *
 * Reads on Blob are cached per request via Next.js' fetch cache; writes go
 * straight through. We never mix the two stores in a single environment.
 */

const DATA_DIR = path.join(process.cwd(), "data");

export function blobEnabled(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

/** True when this runtime can persist edits. Vercel filesystem is read-only at runtime. */
export function isPersistenceWritable(): boolean {
  // With Blob configured, writes always work.
  if (blobEnabled()) return true;
  // Otherwise we can only write on platforms where the FS is writable (i.e. not Vercel).
  return process.env.VERCEL !== "1";
}

const urlCache = new Map<string, string>();

async function blobUrl(file: string): Promise<string | null> {
  const cached = urlCache.get(file);
  if (cached) return cached;
  try {
    const h: HeadBlobResult = await head(file);
    urlCache.set(file, h.url);
    return h.url;
  } catch {
    return null;
  }
}

async function blobPut(file: string, body: string): Promise<string> {
  const result = await put(file, body, {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
    cacheControlMaxAge: 0,
  });
  urlCache.set(file, result.url);
  return result.url;
}

async function readBundledDefault(file: string): Promise<string | null> {
  try {
    return await fs.readFile(path.join(DATA_DIR, file), "utf8");
  } catch {
    return null;
  }
}

export async function readJson<T>(file: string): Promise<T> {
  if (blobEnabled()) {
    let url = await blobUrl(file);
    if (!url) {
      // Seed from the bundled default committed to the repo, then re-read.
      const seed = await readBundledDefault(file);
      if (seed === null) throw new Error(`No blob and no bundled default for ${file}`);
      url = await blobPut(file, seed);
    }
    // No-store on the fetch so admin saves are visible immediately.
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to read blob ${file}: ${res.status}`);
    return (await res.json()) as T;
  }

  const buf = await fs.readFile(path.join(DATA_DIR, file), "utf8");
  return JSON.parse(buf) as T;
}

export async function readJsonOr<T>(file: string, fallback: T): Promise<T> {
  try {
    return await readJson<T>(file);
  } catch {
    return fallback;
  }
}

export async function writeJson<T>(file: string, value: T): Promise<void> {
  const body = JSON.stringify(value, null, 2) + "\n";
  if (blobEnabled()) {
    await blobPut(file, body);
    return;
  }
  const target = path.join(DATA_DIR, file);
  const tmp = target + ".tmp";
  await fs.writeFile(tmp, body, "utf8");
  await fs.rename(tmp, target);
}
