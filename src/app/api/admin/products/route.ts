import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getProducts, isFsWritable, saveProducts } from "@/lib/data";
import { toProduct, validateProductInput } from "@/lib/validate";

export const runtime = "nodejs";

export async function GET() {
  const products = await getProducts();
  return NextResponse.json({ ok: true, products });
}

export async function POST(req: Request) {
  if (!isFsWritable()) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "The deployment filesystem is read-only. Run the admin locally, commit data/products.json, and redeploy.",
      },
      { status: 503 },
    );
  }
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
  // Ensure unique slug
  let slug = result.value.slug!;
  if (products.some((p) => p.slug === slug)) {
    let n = 2;
    while (products.some((p) => p.slug === `${slug}-${n}`)) n += 1;
    slug = `${slug}-${n}`;
  }
  const product = toProduct({ ...result.value, slug });
  products.push(product);
  await saveProducts(products);
  revalidatePath("/products");
  revalidatePath("/");
  return NextResponse.json({ ok: true, product }, { status: 201 });
}
