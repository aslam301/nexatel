import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getProjects, isFsWritable, saveProjects } from "@/lib/data";
import { toProject, validateProjectInput } from "@/lib/validate";

export const runtime = "nodejs";

function readOnlyResponse() {
  return NextResponse.json(
    {
      ok: false,
      error:
        "The deployment filesystem is read-only. Run the admin locally, commit data/projects.json, and redeploy.",
    },
    { status: 503 },
  );
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const projects = await getProjects();
  const project = projects.find((p) => p.id === id);
  if (!project) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true, project });
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isFsWritable()) return readOnlyResponse();
  const { id } = await params;
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }
  const result = validateProjectInput(body);
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: "Validation failed", issues: result.issues }, { status: 400 });
  }
  const projects = await getProjects();
  const idx = projects.findIndex((p) => p.id === id);
  if (idx === -1) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });

  let slug = result.value.slug;
  if (slug && projects.some((p, i) => i !== idx && p.slug === slug)) {
    let n = 2;
    while (projects.some((p, i) => i !== idx && p.slug === `${slug}-${n}`)) n += 1;
    slug = `${slug}-${n}`;
  }
  const updated = toProject({ ...result.value, id, slug }, projects[idx]);
  const previousSlug = projects[idx].slug;
  projects[idx] = updated;
  await saveProjects(projects);
  revalidatePath("/projects");
  if (previousSlug) revalidatePath(`/projects/${previousSlug}`);
  if (updated.slug) revalidatePath(`/projects/${updated.slug}`);
  revalidatePath("/");
  return NextResponse.json({ ok: true, project: updated });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isFsWritable()) return readOnlyResponse();
  const { id } = await params;
  const projects = await getProjects();
  const idx = projects.findIndex((p) => p.id === id);
  if (idx === -1) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  const [removed] = projects.splice(idx, 1);
  await saveProjects(projects);
  revalidatePath("/projects");
  if (removed.slug) revalidatePath(`/projects/${removed.slug}`);
  revalidatePath("/");
  return NextResponse.json({ ok: true });
}
