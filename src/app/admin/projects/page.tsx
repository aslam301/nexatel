import Link from "next/link";
import { AdminShell } from "@/components/AdminShell";
import { ProjectsTable } from "@/components/admin/ProjectsTable";
import { getProjects, isFsWritable } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const projects = await getProjects();
  const writable = isFsWritable();
  return (
    <AdminShell
      title="Projects"
      subtitle={`${projects.length} project(s) · drag to reorder`}
      actions={<Link href="/admin/projects/new" className="btn-primary">Add project</Link>}
    >
      {!writable && (
        <div
          className="mb-6 rounded-lg p-4 text-sm text-amber-200"
          style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.30)" }}
        >
          <strong className="text-amber-100">Read-only environment:</strong> writes won&rsquo;t persist on Vercel&rsquo;s
          serverless filesystem. Run this admin locally to update <code className="font-mono text-amber-100">data/projects.json</code>,
          commit the change, and redeploy.
        </div>
      )}
      <ProjectsTable projects={projects} />
    </AdminShell>
  );
}
