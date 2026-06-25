/**
 * One-shot migration: Vercel Blob → Cloudflare R2
 *
 * Run from the repo root with env vars loaded:
 *   node --env-file=.env.local scripts/migrate-blob-to-r2.mjs
 *
 * What it does:
 *   1. Lists every object in your Vercel Blob store
 *   2. Downloads each one
 *   3. Uploads it to R2 under the same key logic storage.ts uses:
 *      - JSON files  → nexatel-data/<filename>
 *      - Everything else (images) → kept at their existing pathname
 *
 * Safe to re-run: PutObject in R2 is idempotent (overwrites).
 * Does NOT delete anything from Vercel Blob.
 */

import { list } from "@vercel/blob";
import {
  S3Client,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

// ── Validate required env vars ────────────────────────────────────────────────
const required = [
  "BLOB_READ_WRITE_TOKEN",
  "R2_ACCOUNT_ID",
  "R2_ACCESS_KEY_ID",
  "R2_SECRET_ACCESS_KEY",
  "R2_BUCKET",
];
const missing = required.filter((k) => !process.env[k]);
if (missing.length) {
  console.error("Missing env vars:", missing.join(", "));
  process.exit(1);
}

const DATA_PREFIX = "nexatel-data";
const JSON_FILES = new Set([
  "company.json",
  "services.json",
  "products.json",
  "projects.json",
  "settings.json",
  "submissions.json",
  "site.json",
]);

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

function r2KeyFor(blobPathname) {
  // Vercel Blob stores our JSON files at their bare filename (e.g. "products.json").
  // In R2 they live under nexatel-data/.
  const filename = blobPathname.split("/").pop();
  if (JSON_FILES.has(filename)) {
    return `${DATA_PREFIX}/${filename}`;
  }
  // Images and other assets keep their original pathname.
  return blobPathname;
}

async function streamToBuffer(readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

async function migrate() {
  console.log("Listing Vercel Blob store…\n");

  let cursor;
  let totalListed = 0;
  let totalMigrated = 0;
  let totalFailed = 0;

  do {
    const page = await list({ cursor, limit: 100 });
    totalListed += page.blobs.length;

    for (const blob of page.blobs) {
      const destKey = r2KeyFor(blob.pathname);
      process.stdout.write(`  ${blob.pathname} → r2://${destKey} … `);

      try {
        // Download from Vercel Blob (the URL is always public).
        const res = await fetch(blob.url);
        if (!res.ok) throw new Error(`HTTP ${res.status} from Blob`);

        const body = await streamToBuffer(res.body);
        const contentType = res.headers.get("content-type") || "application/octet-stream";

        await r2.send(
          new PutObjectCommand({
            Bucket: process.env.R2_BUCKET,
            Key: destKey,
            Body: body,
            ContentType: contentType,
            // Preserve cache-control for JSON files.
            CacheControl: JSON_FILES.has(blob.pathname.split("/").pop())
              ? "no-cache, no-store"
              : "public, max-age=31536000, immutable",
          }),
        );

        console.log("✓");
        totalMigrated++;
      } catch (err) {
        console.log(`✗  ${err.message}`);
        totalFailed++;
      }
    }

    cursor = page.cursor;
  } while (cursor);

  console.log(`\n──────────────────────────────`);
  console.log(`Listed : ${totalListed}`);
  console.log(`Migrated: ${totalMigrated}`);
  console.log(`Failed  : ${totalFailed}`);

  if (totalFailed > 0) {
    console.log("\nSome files failed. Re-run to retry — the script is idempotent.");
    process.exit(1);
  } else {
    console.log("\nAll done. You can now remove BLOB_* env vars from Vercel.");
  }
}

migrate().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
