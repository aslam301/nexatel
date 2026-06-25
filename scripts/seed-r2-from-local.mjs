/**
 * Seeds Cloudflare R2 with the local data/*.json files.
 *
 * Run from the repo root:
 *   node --env-file=.env.local scripts/seed-r2-from-local.mjs
 *
 * Idempotent — safe to re-run. Overwrites whatever is already in R2.
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "..", "data");
const DATA_PREFIX = "nexatel-data";

const FILES = [
  "company.json",
  "services.json",
  "products.json",
  "projects.json",
  "settings.json",
  "submissions.json",
  "site.json",
];

const required = ["R2_ACCOUNT_ID", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY", "R2_BUCKET"];
const missing = required.filter((k) => !process.env[k]);
if (missing.length) {
  console.error("Missing env vars:", missing.join(", "));
  process.exit(1);
}

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

async function seed() {
  console.log(`Seeding R2 bucket "${process.env.R2_BUCKET}" from local data/...\n`);

  for (const file of FILES) {
    const localPath = path.join(DATA_DIR, file);
    const r2Key = `${DATA_PREFIX}/${file}`;
    process.stdout.write(`  ${file} → r2://${r2Key} … `);

    try {
      const body = await fs.readFile(localPath, "utf8");
      await r2.send(
        new PutObjectCommand({
          Bucket: process.env.R2_BUCKET,
          Key: r2Key,
          Body: body,
          ContentType: "application/json",
          CacheControl: "no-cache, no-store",
        }),
      );
      console.log("✓");
    } catch (err) {
      if (err.code === "ENOENT") {
        console.log("skipped (file not found locally)");
      } else {
        console.log(`✗  ${err.message}`);
      }
    }
  }

  console.log("\nDone. R2 is now seeded with your local data.");
}

seed().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
