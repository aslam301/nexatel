import { Hero } from "@/components/Hero";
import { ProductCard } from "@/components/ProductCard";
import { getProducts } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Products",
  description:
    "Browse Nexatel's catalogue of fiber optic cables, structured cabling, test equipment, solar panels, telecom and data-centre hardware.",
  path: "/products",
  image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=630&fit=crop&q=70&auto=format",
  keywords: [
    "fiber optic cable Kuwait",
    "Cat6A cable",
    "OTDR test equipment",
    "solar panel Kuwait",
    "data centre rack",
    "IP phone GCC",
  ],
});

export const revalidate = 60;

export default async function ProductsPage() {
  const products = await getProducts();
  const categories = Array.from(new Set(products.map((p) => p.category))).sort();
  return (
    <>
      <Hero
        eyebrow="Catalogue"
        title="Engineered hardware, sourced and supplied."
        subtitle="Tier-1 OEM hardware backed by Nexatel warranty registration, asset tagging and on-site delivery across Kuwait and India."
        size="compact"
        showStatus={false}
        backgroundImage="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=2000&q=70&auto=format&fit=crop"
      />
      <section className="container-wide py-20">
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((c) => (
            <span key={c} className="text-xs font-semibold tracking-wide uppercase text-slate-600 bg-white border border-[var(--border)] rounded-full px-3 py-1.5">
              {c}
            </span>
          ))}
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </>
  );
}
