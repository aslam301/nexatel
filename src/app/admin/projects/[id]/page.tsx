import { notFound } from "next/navigation";
import { AdminShell } from "@/components/AdminShell";
import { ProjectForm } from "@/components/ProjectForm";
import { getProjects } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (id === "new") notFound();
  const projects = await getProjects();
  const project = projects.find((p) => p.id === id);
  if (!project) notFound();
  return (
    <AdminShell title="Edit project" subtitle={project.title}>
      <div className="card p-6 md:p-8 max-w-3xl">
        <ProjectForm mode="edit" project={project} />
      </div>
    </AdminShell>
  );
}
