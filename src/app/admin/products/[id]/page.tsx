import { notFound } from "next/navigation";
import { AdminBar } from "@/components/AdminBar";
import { ProductForm } from "@/components/ProductForm";
import { getProductById } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // Avoid swallowing the /new route here — Next will route /new to /new/page.tsx,
  // but defensively guard:
  if (id === "new") notFound();
  const product = await getProductById(id);
  if (!product) notFound();
  return (
    <>
      <AdminBar />
      <div className="card p-6 md:p-8 max-w-3xl">
        <h1 className="text-2xl font-bold text-[var(--primary)]">Edit product</h1>
        <p className="text-sm text-slate-600 mt-1.5">{product.name}</p>
        <div className="mt-6"><ProductForm mode="edit" product={product} /></div>
      </div>
    </>
  );
}
