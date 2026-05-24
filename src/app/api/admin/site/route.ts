import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getSite, isFsWritable, saveSite } from "@/lib/data";
import { validateSite } from "@/lib/validate";

export const runtime = "nodejs";

function readOnlyResponse() {
  return NextResponse.json(
    {
      ok: false,
      error:
        "The deployment filesystem is read-only. Run the admin locally, commit data/site.json, and redeploy.",
    },
    { status: 503 },
  );
}

export async function GET() {
  const site = await getSite();
  return NextResponse.json({ ok: true, site });
}

export async function PUT(req: Request) {
  if (!isFsWritable()) return readOnlyResponse();
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }
  const result = validateSite(body);
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: "Validation failed", issues: result.issues }, { status: 400 });
  }
  await saveSite(result.value);
  // Site content shows up on every public page, so revalidate everything.
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true, site: result.value });
}
