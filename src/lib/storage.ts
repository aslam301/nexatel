import { promises as fs } from "node:fs";
import path from "node:path";
import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";

/**
 * One persistence layer for every JSON document in data/.
 *
 * - When R2 is configured (R2_BUCKET + R2_ACCESS_KEY_ID + R2_SECRET_ACCESS_KEY
 *   + R2_ACCOUNT_ID), JSON documents are stored in the same Cloudflare R2
 *   bucket used for image uploads, under the key prefix "nexatel-data/".
 *   On the first read of any file, if the R2 object doesn't exist yet, we
 *   seed it from the bundled data/<file> committed to the repo.
 * - Without R2 credentials (local dev, no R2 configured), we read and write
 *   the filesystem directly.
 */

const DATA_DIR = path.join(process.cwd(), "data");
// All JSON data files live under this prefix in the bucket.
const DATA_PREFIX = "nexatel-data";

export function r2Enabled(): boolean {
  return Boolean(
    process.env.R2_BUCKET &&
      process.env.R2_ACCESS_KEY_ID &&
      process.env.R2_SECRET_ACCESS_KEY &&
      process.env.R2_ACCOUNT_ID,
  );
}

// Back-compat alias (nothing outside storage.ts should call this).
export function blobEnabled(): boolean {
  return r2Enabled();
}

/** True when this runtime can persist edits. */
export function isPersistenceWritable(): boolean {
  if (r2Enabled()) return true;
  return process.env.VERCEL !== "1";
}

let _client: S3Client | null = null;
function client(): S3Client {
  if (_client) return _client;
  _client = new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  });
  return _client;
}

function r2Key(file: string): string {
  return `${DATA_PREFIX}/${file}`;
}

async function streamToString(stream: NodeJS.ReadableStream): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk as string));
  }
  return Buffer.concat(chunks).toString("utf8");
}

async function r2Get(file: string): Promise<string | null> {
  try {
    const resp = await client().send(
      new GetObjectCommand({ Bucket: process.env.R2_BUCKET!, Key: r2Key(file) }),
    );
    if (!resp.Body) return null;
    return streamToString(resp.Body as NodeJS.ReadableStream);
  } catch (err: unknown) {
    const e = err as { name?: string; $metadata?: { httpStatusCode?: number } };
    if (e?.name === "NoSuchKey" || e?.$metadata?.httpStatusCode === 404) return null;
    throw err;
  }
}

async function r2Put(file: string, body: string): Promise<void> {
  await client().send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET!,
      Key: r2Key(file),
      Body: body,
      ContentType: "application/json",
      CacheControl: "no-cache, no-store",
    }),
  );
}

async function readBundledDefault(file: string): Promise<string | null> {
  try {
    return await fs.readFile(path.join(DATA_DIR, file), "utf8");
  } catch {
    return null;
  }
}

export async function readJson<T>(file: string): Promise<T> {
  if (r2Enabled()) {
    let body = await r2Get(file);
    if (body === null) {
      // Seed R2 from the bundled default committed to the repo.
      const seed = await readBundledDefault(file);
      if (seed === null) throw new Error(`No R2 object and no bundled default for ${file}`);
      await r2Put(file, seed);
      body = seed;
    }
    return JSON.parse(body) as T;
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
  if (r2Enabled()) {
    await r2Put(file, body);
    return;
  }
  const target = path.join(DATA_DIR, file);
  const tmp = target + ".tmp";
  await fs.writeFile(tmp, body, "utf8");
  await fs.rename(tmp, target);
}
