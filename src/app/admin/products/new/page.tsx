import { AdminShell } from "@/components/AdminShell";
import { ProductForm } from "@/components/ProductForm";

export default function NewProductPage() {
  return (
    <AdminShell title="Add product" subtitle="Fields marked with * are required">
      <div className="card p-6 md:p-8 max-w-3xl">
        <ProductForm mode="create" />
      </div>
    </AdminShell>
  );
}
