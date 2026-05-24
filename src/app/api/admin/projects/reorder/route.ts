import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getProjects, isFsWritable, saveProjects } from "@/lib/data";

export const runtime = "nodejs";

export async function PUT(req: Request) {
  if (!isFsWritable()) {
    return NextResponse.json(
      { ok: false, error: "Filesystem is read-only on this deployment." },
      { status: 503 },
    );
  }
  let body: { ids?: unknown };
  try {
    body = (await req.json()) as { ids?: unknown };
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }
  if (!Array.isArray(body.ids) || body.ids.some((s) => typeof s !== "string")) {
    return NextResponse.json({ ok: false, error: "ids must be an array of strings" }, { status: 400 });
  }
  const desired = body.ids as string[];
  const projects = await getProjects();
  const byId = new Map(projects.map((p) => [p.id, p]));
  for (const id of desired) {
    if (!byId.has(id)) {
      return NextResponse.json({ ok: false, error: `Unknown id: ${id}` }, { status: 400 });
    }
  }
  const seen = new Set(desired);
  const reordered = [
    ...desired.map((id) => byId.get(id)!),
    ...projects.filter((p) => !seen.has(p.id)),
  ];
  await saveProjects(reordered);
  revalidatePath("/projects");
  revalidatePath("/");
  return NextResponse.json({ ok: true });
}
