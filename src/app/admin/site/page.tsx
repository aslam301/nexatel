import { AdminShell } from "@/components/AdminShell";
import { SiteEditor } from "@/components/admin/SiteEditor";
import { getSite, isFsWritable } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminSitePage() {
  const site = await getSite();
  const writable = isFsWritable();
  return (
    <AdminShell title="Site content" subtitle="Hero, About, Contact, page heroes and footer">
      {!writable && (
        <div
          className="mb-6 rounded-lg p-4 text-sm text-amber-200"
          style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.30)" }}
        >
          <strong className="text-amber-100">Read-only environment:</strong> writes won&rsquo;t persist on Vercel&rsquo;s
          serverless filesystem. Run this admin locally to update <code className="font-mono text-amber-100">data/site.json</code>,
          commit the change, and redeploy.
        </div>
      )}
      <SiteEditor initial={site} />
    </AdminShell>
  );
}
