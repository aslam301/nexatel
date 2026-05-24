import { notFound } from "next/navigation";
import { AdminShell } from "@/components/AdminShell";
import { ServiceForm } from "@/components/ServiceForm";
import { getServiceBySlug } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function EditServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (slug === "new") notFound();
  const service = await getServiceBySlug(slug);
  if (!service) notFound();
  return (
    <AdminShell title="Edit service" subtitle={service.title}>
      <div className="card p-6 md:p-8 max-w-3xl">
        <ServiceForm mode="edit" service={service} />
      </div>
    </AdminShell>
  );
}
