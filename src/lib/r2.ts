import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

/**
 * Cloudflare R2 is S3-API compatible. We use the AWS S3 SDK pointed at
 * `https://<account-id>.r2.cloudflarestorage.com`. Credentials live in env
 * vars and never leave the server. The browser only ever sees the resulting
 * presigned PUT URL.
 */
function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

let _client: S3Client | null = null;

function client(): S3Client {
  if (_client) return _client;
  _client = new S3Client({
    region: "auto",
    endpoint: `https://${requireEnv("R2_ACCOUNT_ID")}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: requireEnv("R2_ACCESS_KEY_ID"),
      secretAccessKey: requireEnv("R2_SECRET_ACCESS_KEY"),
    },
  });
  return _client;
}

export const R2_BUCKET = process.env.R2_BUCKET ?? "";
export const R2_PUBLIC_BASE_URL = (process.env.R2_PUBLIC_BASE_URL ?? "").replace(/\/$/, "");
export const R2_KEY_PREFIX = (process.env.R2_KEY_PREFIX ?? "").replace(/^\/|\/$/g, "");

export interface PresignResult {
  uploadUrl: string;
  publicUrl: string;
  key: string;
}

/**
 * Generates a presigned PUT URL the browser can upload directly to.
 * The browser does NOT receive R2 credentials.
 */
export async function presignUpload({
  key,
  contentType,
  expiresInSeconds = 60 * 5,
}: {
  key: string;
  contentType: string;
  expiresInSeconds?: number;
}): Promise<PresignResult> {
  const command = new PutObjectCommand({
    Bucket: R2_BUCKET,
    Key: key,
    ContentType: contentType,
  });
  const uploadUrl = await getSignedUrl(client(), command, { expiresIn: expiresInSeconds });
  const publicUrl = `${R2_PUBLIC_BASE_URL}/${key}`;
  return { uploadUrl, publicUrl, key };
}

const SAFE_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
  "image/avif": "avif",
};

export function safeExtension(contentType: string): string | null {
  return SAFE_EXT[contentType.toLowerCase()] ?? null;
}

/**
 * Builds a collision-resistant object key under the configured prefix.
 * Example: images/services/service-name-1714.jpg
 */
export function buildObjectKey({
  scope,
  slugHint,
  ext,
}: {
  scope: string;
  slugHint?: string;
  ext: string;
}): string {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, "").toLowerCase() || "misc";
  const safeSlug = (slugHint ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
  const ts = Date.now().toString(36);
  const rnd = Math.random().toString(36).slice(2, 6);
  const stem = safeSlug ? `${safeSlug}-${ts}${rnd}` : `${ts}${rnd}`;
  const parts = [R2_KEY_PREFIX, safeScope, `${stem}.${ext}`].filter(Boolean);
  return parts.join("/");
}
