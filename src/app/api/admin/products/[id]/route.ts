import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getProducts, isFsWritable, saveProducts } from "@/lib/data";
import { toProduct, validateProductInput } from "@/lib/validate";

export const runtime = "nodejs";

function readOnlyResponse() {
  return NextResponse.json(
    {
      ok: false,
      error:
        "The deployment filesystem is read-only. Run the admin locally, commit data/products.json, and redeploy.",
    },
    { status: 503 },
  );
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const products = await getProducts();
  const product = products.find((p) => p.id === id);
  if (!product) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true, product });
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
  const result = validateProductInput(body);
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: "Validation failed", issues: result.issues }, { status: 400 });
  }
  const products = await getProducts();
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });

  let slug = result.value.slug!;
  if (products.some((p, i) => i !== idx && p.slug === slug)) {
    let n = 2;
    while (products.some((p, i) => i !== idx && p.slug === `${slug}-${n}`)) n += 1;
    slug = `${slug}-${n}`;
  }
  const updated = toProduct({ ...result.value, id, slug }, products[idx]);
  products[idx] = updated;
  await saveProducts(products);
  revalidatePath("/products");
  revalidatePath(`/products/${updated.slug}`);
  revalidatePath("/");
  return NextResponse.json({ ok: true, product: updated });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isFsWritable()) return readOnlyResponse();
  const { id } = await params;
  const products = await getProducts();
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  const [removed] = products.splice(idx, 1);
  await saveProducts(products);
  revalidatePath("/products");
  revalidatePath(`/products/${removed.slug}`);
  revalidatePath("/");
  return NextResponse.json({ ok: true });
}
