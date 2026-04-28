import Link from "next/link";
import { getProducts, isFsWritable } from "@/lib/data";
import { AdminBar } from "@/components/AdminBar";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await getProducts();
  const writable = isFsWritable();
  return (
    <>
      <AdminBar />
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[var(--primary)]">Products</h1>
            <p className="text-sm text-slate-600 mt-1">{products.length} item(s) in catalogue</p>
          </div>
          <Link href="/admin/products/new" className="btn-primary">Add product</Link>
        </div>

        {!writable && (
          <div className="mb-6 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
            <strong>Read-only environment:</strong> writes won&rsquo;t persist on Vercel&rsquo;s
            serverless filesystem. Use this admin locally to update <code>data/products.json</code>,
            commit the change, and redeploy.
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-slate-500 border-b border-[var(--border)]">
                <th className="py-3 pr-4">Name</th>
                <th className="py-3 pr-4">Category</th>
                <th className="py-3 pr-4">Slug</th>
                <th className="py-3 pr-4">Created</th>
                <th className="py-3 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-[var(--border)]/60 hover:bg-slate-50/60">
                  <td className="py-3 pr-4 font-medium text-[var(--primary)]">{p.name}</td>
                  <td className="py-3 pr-4 text-slate-600">{p.category}</td>
                  <td className="py-3 pr-4 text-slate-500">{p.slug}</td>
                  <td className="py-3 pr-4 text-slate-500">{new Date(p.createdAt).toLocaleDateString()}</td>
                  <td className="py-3 pr-4 text-right">
                    <Link href={`/admin/products/${p.id}`} className="text-sm font-semibold text-[var(--primary)] hover:underline">Edit</Link>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr><td colSpan={5} className="py-10 text-center text-slate-500">No products yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
