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

export async function GET() {
  const services = await getServices();
  return NextResponse.json({ ok: true, services });
}

export async function POST(req: Request) {
  if (!isFsWritable()) return readOnlyResponse();
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
  let slug = result.value.slug!;
  if (services.some((s) => s.slug === slug)) {
    let n = 2;
    while (services.some((s) => s.slug === `${slug}-${n}`)) n += 1;
    slug = `${slug}-${n}`;
  }
  const service = toService({ ...result.value, slug });
  services.push(service);
  await saveServices(services);
  revalidatePath("/services");
  revalidatePath("/");
  return NextResponse.json({ ok: true, service }, { status: 201 });
}
