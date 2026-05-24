import Link from "next/link";
import { AdminShell } from "@/components/AdminShell";
import { ProductsTable } from "@/components/admin/ProductsTable";
import { getProducts, isFsWritable } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await getProducts();
  const writable = isFsWritable();
  return (
    <AdminShell
      title="Products"
      subtitle={`${products.length} item(s) · drag to reorder`}
      actions={<Link href="/admin/products/new" className="btn-primary">Add product</Link>}
    >
      {!writable && (
        <div
          className="mb-6 rounded-lg p-4 text-sm text-amber-200"
          style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.30)" }}
        >
          <strong className="text-amber-100">Read-only environment:</strong> writes won&rsquo;t persist on Vercel&rsquo;s
          serverless filesystem. Use this admin locally to update <code className="font-mono text-amber-100">data/products.json</code>,
          commit the change, and redeploy.
        </div>
      )}
      <ProductsTable products={products} />
    </AdminShell>
  );
}
