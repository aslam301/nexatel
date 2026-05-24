import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getServices, isFsWritable, saveServices } from "@/lib/data";

export const runtime = "nodejs";

export async function PUT(req: Request) {
  if (!isFsWritable()) {
    return NextResponse.json(
      { ok: false, error: "Filesystem is read-only on this deployment." },
      { status: 503 },
    );
  }
  let body: { slugs?: unknown };
  try {
    body = (await req.json()) as { slugs?: unknown };
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }
  if (!Array.isArray(body.slugs) || body.slugs.some((s) => typeof s !== "string")) {
    return NextResponse.json({ ok: false, error: "slugs must be an array of strings" }, { status: 400 });
  }
  const desired = body.slugs as string[];
  const services = await getServices();
  const bySlug = new Map(services.map((s) => [s.slug, s]));
  // Validate every requested slug exists; reject otherwise to avoid silent data loss.
  for (const slug of desired) {
    if (!bySlug.has(slug)) {
      return NextResponse.json({ ok: false, error: `Unknown slug: ${slug}` }, { status: 400 });
    }
  }
  // Reorder, then append any slugs the client omitted so we never lose entries.
  const seen = new Set(desired);
  const reordered = [
    ...desired.map((slug) => bySlug.get(slug)!),
    ...services.filter((s) => !seen.has(s.slug)),
  ];
  await saveServices(reordered);
  revalidatePath("/services");
  revalidatePath("/");
  return NextResponse.json({ ok: true });
}
