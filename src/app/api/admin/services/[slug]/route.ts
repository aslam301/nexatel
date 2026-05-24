import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getServices, isFsWritable, saveServices } from "@/lib/data";
import { toService, validateServiceInput } from "@/lib/validate";

export const runtime = "nodejs";

function readOnlyResponse() {
  return NextResponse.json(
    {
      ok: false,
      error:
        "The deployment filesystem is read-only. Run the admin locally, commit data/services.json, and redeploy.",
    },
    { status: 503 },
  );
}

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const services = await getServices();
  const service = services.find((s) => s.slug === slug);
  if (!service) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true, service });
}

export async function PUT(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  if (!isFsWritable()) return readOnlyResponse();
  const { slug: currentSlug } = await params;
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }
  const result = validateServiceInput(body);
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: "Validation failed", issues: result.issues }, { status: 400 });
  }
  const services = await getServices();
  const idx = services.findIndex((s) => s.slug === currentSlug);
  if (idx === -1) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });

  let slug = result.value.slug!;
  if (services.some((s, i) => i !== idx && s.slug === slug)) {
    let n = 2;
    while (services.some((s, i) => i !== idx && s.slug === `${slug}-${n}`)) n += 1;
    slug = `${slug}-${n}`;
  }
  const updated = toService({ ...result.value, slug });
  services[idx] = updated;
  await saveServices(services);
  revalidatePath("/services");
  revalidatePath(`/services/${currentSlug}`);
  if (slug !== currentSlug) revalidatePath(`/services/${slug}`);
  revalidatePath("/");
  return NextResponse.json({ ok: true, service: updated });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  if (!isFsWritable()) return readOnlyResponse();
  const { slug } = await params;
  const services = await getServices();
  const idx = services.findIndex((s) => s.slug === slug);
  if (idx === -1) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  services.splice(idx, 1);
  await saveServices(services);
  revalidatePath("/services");
  revalidatePath(`/services/${slug}`);
  revalidatePath("/");
  return NextResponse.json({ ok: true });
}
