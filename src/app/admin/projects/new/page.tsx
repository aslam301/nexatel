import { AdminShell } from "@/components/AdminShell";
import { ProjectForm } from "@/components/ProjectForm";

export default function NewProjectPage() {
  return (
    <AdminShell title="Add project" subtitle="Fields marked with * are required">
      <div className="card p-6 md:p-8 max-w-3xl">
        <ProjectForm mode="create" />
      </div>
    </AdminShell>
  );
}
