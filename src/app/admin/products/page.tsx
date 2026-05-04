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
        <div
          className="mb-6 rounded-lg p-4 text-sm text-amber-200"
          style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.30)" }}
        >
          <strong className="text-amber-100">Read-only environment:</strong> writes won&rsquo;t persist on Vercel&rsquo;s
          serverless filesystem. Use this admin locally to update <code className="font-mono text-amber-100">data/products.json</code>,
          commit the change, and redeploy.
        </div>
      )}

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead style={{ background: "rgba(255,255,255,0.02)" }}>
              <tr className="text-left text-[11px] font-mono uppercase tracking-[0.16em] text-slate-400">
                <th className="py-3.5 px-5 font-semibold">Name</th>
                <th className="py-3.5 px-5 font-semibold">Category</th>
                <th className="py-3.5 px-5 font-semibold">Slug</th>
                <th className="py-3.5 px-5 font-semibold">Created</th>
                <th className="py-3.5 px-5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-t border-[var(--border)] hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-5 font-medium text-white">{p.name}</td>
                  <td className="py-3.5 px-5 text-slate-300">{p.category}</td>
                  <td className="py-3.5 px-5 text-slate-500 font-mono text-xs">{p.slug}</td>
                  <td className="py-3.5 px-5 text-slate-400">{new Date(p.createdAt).toLocaleDateString()}</td>
                  <td className="py-3.5 px-5 text-right">
                    <Link
                      href={`/admin/products/${p.id}`}
                      className="text-sm font-semibold hover:opacity-80"
                      style={{ color: "var(--violet)" }}
                    >
                      Edit
                    </Link>
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
