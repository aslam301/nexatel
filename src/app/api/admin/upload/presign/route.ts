import { NextResponse } from "next/server";
import { buildObjectKey, presignUpload, safeExtension } from "@/lib/r2";

export const runtime = "nodejs";

const ALLOWED_SCOPES = new Set(["services", "products", "projects", "misc"]);
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB upper bound enforced client-side too.

export async function POST(req: Request) {
  let body: { filename?: unknown; contentType?: unknown; scope?: unknown; slugHint?: unknown; size?: unknown };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const contentType = typeof body.contentType === "string" ? body.contentType.toLowerCase() : "";
  const ext = safeExtension(contentType);
  if (!ext) {
    return NextResponse.json(
      { ok: false, error: "Unsupported content type. Use jpg, png, webp, gif, avif or svg." },
      { status: 400 },
    );
  }

  const size = typeof body.size === "number" ? body.size : 0;
  if (size > 0 && size > MAX_BYTES) {
    return NextResponse.json({ ok: false, error: `File too large. Max ${MAX_BYTES / 1024 / 1024} MB.` }, { status: 400 });
  }

  const rawScope = typeof body.scope === "string" ? body.scope : "misc";
  const scope = ALLOWED_SCOPES.has(rawScope) ? rawScope : "misc";
  const slugHint = typeof body.slugHint === "string" ? body.slugHint : undefined;

  const key = buildObjectKey({ scope, slugHint, ext });

  try {
    const result = await presignUpload({ key, contentType });
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to presign";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
