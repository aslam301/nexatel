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

export async function GET() {
  const projects = await getProjects();
  return NextResponse.json({ ok: true, projects });
}

export async function POST(req: Request) {
  if (!isFsWritable()) return readOnlyResponse();
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
  let slug = result.value.slug;
  if (slug && projects.some((p) => p.slug === slug)) {
    let n = 2;
    while (projects.some((p) => p.slug === `${slug}-${n}`)) n += 1;
    slug = `${slug}-${n}`;
  }
  const project = toProject({ ...result.value, slug });
  projects.unshift(project);
  await saveProjects(projects);
  revalidatePath("/projects");
  revalidatePath("/");
  return NextResponse.json({ ok: true, project }, { status: 201 });
}
