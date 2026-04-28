import { notFound } from "next/navigation";
import { AdminShell } from "@/components/AdminShell";
import { ProductForm } from "@/components/ProductForm";
import { getProductById } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (id === "new") notFound();
  const product = await getProductById(id);
  if (!product) notFound();
  return (
    <AdminShell title="Edit product" subtitle={product.name}>
      <div className="card p-6 md:p-8 max-w-3xl">
        <ProductForm mode="edit" product={product} />
      </div>
    </AdminShell>
  );
}
