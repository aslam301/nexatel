import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getCompany, isFsWritable, saveCompany } from "@/lib/data";
import { validateCompany } from "@/lib/validate";

export const runtime = "nodejs";

function readOnlyResponse() {
  return NextResponse.json(
    {
      ok: false,
      error:
        "The deployment filesystem is read-only. Run the admin locally, commit data/company.json, and redeploy.",
    },
    { status: 503 },
  );
}

export async function GET() {
  const company = await getCompany();
  return NextResponse.json({ ok: true, company });
}

export async function PUT(req: Request) {
  if (!isFsWritable()) return readOnlyResponse();
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }
  const result = validateCompany(body);
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: "Validation failed", issues: result.issues }, { status: 400 });
  }
  await saveCompany(result.value);
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true, company: result.value });
}
