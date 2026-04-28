import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, getProducts } from "@/lib/data";
import { Icon } from "@/components/Icon";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-static";
export const revalidate = 60;

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  if (!p) return buildMetadata({ title: "Product", description: "Nexatel product", path: `/products/${slug}` });
  return buildMetadata({
    title: p.name,
    description: p.shortDescription,
    path: `/products/${slug}`,
    image: p.image,
  });
}

export default async function ProductDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  return (
    <section className="container-wide py-12 md:py-16">
      <Link href="/products" className="text-sm text-slate-500 hover:text-[var(--primary)] inline-flex items-center gap-1 mb-6">
        ← All products
      </Link>
      <div className="grid lg:grid-cols-2 gap-10">
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100">
          {product.image && (
            <Image src={product.image} alt={product.name} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" priority />
          )}
        </div>
        <div>
          <span className="eyebrow">{product.category}</span>
          <h1 className="mt-2 text-3xl md:text-4xl font-bold text-[var(--primary)] tracking-tight">{product.name}</h1>
          <p className="mt-4 text-lg text-slate-600">{product.shortDescription}</p>
          <p className="mt-4 text-slate-700 leading-relaxed">{product.description}</p>

          {product.features?.length > 0 && (
            <>
              <h2 className="mt-8 text-lg font-semibold text-[var(--primary)]">Key features</h2>
              <ul className="mt-3 grid sm:grid-cols-2 gap-2.5">
                {product.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="text-[var(--accent-strong)] mt-0.5"><Icon name="check" size={18} /></span>
                    {f}
                  </li>
                ))}
              </ul>
            </>
          )}

          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/contact" className="btn-primary">Request quotation <Icon name="arrow" size={16} /></Link>
            {product.datasheetUrl && (
              <a href={product.datasheetUrl} className="btn-outline" target="_blank" rel="noreferrer">
                Datasheet
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
