import Link from "next/link";
import { AdminShell } from "@/components/AdminShell";
import { ServicesTable } from "@/components/admin/ServicesTable";
import { getServices, isFsWritable } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminServicesPage() {
  const services = await getServices();
  const writable = isFsWritable();
  return (
    <AdminShell
      title="Services"
      subtitle={`${services.length} service(s) · drag to reorder`}
      actions={<Link href="/admin/services/new" className="btn-primary">Add service</Link>}
    >
      {!writable && (
        <div
          className="mb-6 rounded-lg p-4 text-sm text-amber-200"
          style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.30)" }}
        >
          <strong className="text-amber-100">Read-only environment:</strong> writes won&rsquo;t persist on Vercel&rsquo;s
          serverless filesystem. Run this admin locally to update <code className="font-mono text-amber-100">data/services.json</code>,
          commit the change, and redeploy.
        </div>
      )}
      <ServicesTable services={services} />
    </AdminShell>
  );
}
