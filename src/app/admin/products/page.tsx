import Link from "next/link";
import { AdminShell } from "@/components/AdminShell";
import { getProducts, isFsWritable } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await getProducts();
  const writable = isFsWritable();
  return (
    <AdminShell
      title="Products"
      subtitle={`${products.length} item(s) in catalogue`}
      actions={<Link href="/admin/products/new" className="btn-primary">Add product</Link>}
    >
      {!writable && (
        <div className="mb-6 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          <strong>Read-only environment:</strong> writes won&rsquo;t persist on Vercel&rsquo;s
          serverless filesystem. Use this admin locally to update <code>data/products.json</code>,
          commit the change, and redeploy.
        </div>
      )}

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr className="text-left text-xs uppercase tracking-wider text-slate-500">
                <th className="py-3 px-5">Name</th>
                <th className="py-3 px-5">Category</th>
                <th className="py-3 px-5">Slug</th>
                <th className="py-3 px-5">Created</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-t border-[var(--border)] hover:bg-slate-50/60">
                  <td className="py-3 px-5 font-medium text-[var(--primary)]">{p.name}</td>
                  <td className="py-3 px-5 text-slate-600">{p.category}</td>
                  <td className="py-3 px-5 text-slate-500 font-mono text-xs">{p.slug}</td>
                  <td className="py-3 px-5 text-slate-500">{new Date(p.createdAt).toLocaleDateString()}</td>
                  <td className="py-3 px-5 text-right">
                    <Link href={`/admin/products/${p.id}`} className="text-sm font-semibold text-[var(--primary)] hover:underline">Edit</Link>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr><td colSpan={5} className="py-12 text-center text-slate-500">No products yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}
