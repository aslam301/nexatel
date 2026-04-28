import { AdminBar } from "@/components/AdminBar";
import { ProductForm } from "@/components/ProductForm";

export default function NewProductPage() {
  return (
    <>
      <AdminBar />
      <div className="card p-6 md:p-8 max-w-3xl">
        <h1 className="text-2xl font-bold text-[var(--primary)]">Add product</h1>
        <p className="text-sm text-slate-600 mt-1.5">Fields marked with * are required.</p>
        <div className="mt-6"><ProductForm mode="create" /></div>
      </div>
    </>
  );
}
