import { AdminShell } from "@/components/AdminShell";
import { ServiceForm } from "@/components/ServiceForm";

export default function NewServicePage() {
  return (
    <AdminShell title="Add service" subtitle="Fields marked with * are required">
      <div className="card p-6 md:p-8 max-w-3xl">
        <ServiceForm mode="create" />
      </div>
    </AdminShell>
  );
}
