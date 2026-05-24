import { AdminShell } from "@/components/AdminShell";
import { CompanyEditor } from "@/components/admin/CompanyEditor";
import { getCompany, isFsWritable } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminCompanyPage() {
  const company = await getCompany();
  const writable = isFsWritable();
  return (
    <AdminShell title="Company" subtitle="Identity, mission, offices, focus areas and partner">
      {!writable && (
        <div
          className="mb-6 rounded-lg p-4 text-sm text-amber-200"
          style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.30)" }}
        >
          <strong className="text-amber-100">Read-only environment:</strong> writes won&rsquo;t persist on Vercel&rsquo;s
          serverless filesystem. Run this admin locally to update <code className="font-mono text-amber-100">data/company.json</code>,
          commit the change, and redeploy.
        </div>
      )}
      <CompanyEditor initial={company} />
    </AdminShell>
  );
}
