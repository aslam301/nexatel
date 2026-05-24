import Link from "next/link";
import { notFound } from "next/navigation";
import { getCompany, getProductBySlug, getProducts, getSettings } from "@/lib/data";
import { Icon } from "@/components/Icon";
import { ProductCard } from "@/components/ProductCard";
import { ProductGallery } from "@/components/ProductGallery";
import {
  breadcrumbsJsonLd,
  buildMetadata,
  productJsonLd,
  resolveDescription,
  resolveOgImage,
} from "@/lib/seo";

export const dynamic = "force-static";
export const revalidate = 60;

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [p, settings] = await Promise.all([getProductBySlug(slug), getSettings()]);
  if (!p) return buildMetadata({ title: "Product", description: "Nexatel product", path: `/products/${slug}` });

  const title = p.seoTitle?.trim() || p.name;
  const description = resolveDescription(p.seoDescription, p.description, p.shortDescription, settings);
  const ogImage = resolveOgImage(p.seoImage, p.image, settings);

  return buildMetadata({
    title,
    description,
    path: `/products/${slug}`,
    image: ogImage ? { url: ogImage, alt: p.name } : undefined,
    ogType: "article",
    keywords: [p.name, p.category, "Nexatel product"],
  });
}

export default async function ProductDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [product, company, allProducts] = await Promise.all([
    getProductBySlug(slug),
    getCompany(),
    getProducts(),
  ]);
  if (!product) notFound();

  const related = allProducts
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 3);

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      productJsonLd(product, company),
      breadcrumbsJsonLd([
        { name: "Home", path: "/" },
        { name: "Products", path: "/products" },
        { name: product.name, path: `/products/${product.slug}` },
      ]),
    ],
  };

  const sku = product.id.replace(/^nx-/, "").toUpperCase();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
      />
      <section className="container-wide pt-10 md:pt-14 pb-16 md:pb-20">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-sm text-muted-2 mb-8 flex flex-wrap items-center gap-2">
          <Link href="/" className="hover:text-foreground-strong transition-colors">Home</Link>
          <span aria-hidden>/</span>
          <Link href="/products" className="hover:text-foreground-strong transition-colors">Products</Link>
          <span aria-hidden>/</span>
          <span className="text-foreground-strong font-medium">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14">
          {/* Gallery */}
          <ProductGallery images={product.image ? [product.image] : []} alt={product.name} />

          {/* Detail panel */}
          <div className="lg:pt-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span
                className="text-[10px] font-mono uppercase tracking-[0.18em] px-2.5 py-1 rounded-full"
                style={{
                  background: "rgba(124,58,237,0.10)",
                  color: "#c4b5fd",
                  border: "1px solid rgba(124,58,237,0.35)",
                }}
              >
                {product.category}
              </span>
              <span
                className="text-[10px] font-mono uppercase tracking-[0.18em] px-2.5 py-1 rounded-full"
                style={{
                  background: "rgba(16,185,129,0.10)",
                  color: "#6ee7b7",
                  border: "1px solid rgba(16,185,129,0.30)",
                }}
              >
                ● In stock
              </span>
            </div>

            <h1 className="mt-5 text-3xl md:text-4xl font-semibold text-foreground-strong tracking-tight leading-tight">
              {product.name}
            </h1>
            <div className="mt-3 text-xs font-mono uppercase tracking-[0.18em] text-muted-2">
              SKU · {sku}
            </div>

            <p className="mt-6 text-lg text-muted leading-relaxed">
              {product.shortDescription}
            </p>
            <p className="mt-4 text-muted leading-relaxed">{product.description}</p>

            {/* CTA row */}
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/contact" className="btn-primary">
                Request quotation <Icon name="arrow" size={16} />
              </Link>
              {product.datasheetUrl && (
                <a href={product.datasheetUrl} className="btn-outline" target="_blank" rel="noreferrer">
                  Download datasheet
                </a>
              )}
              <Link href="/contact" className="btn-outline">
                <Icon name="phone" size={14} /> Talk to sales
              </Link>
            </div>

            {/* Trust strip */}
            <ul className="mt-8 grid sm:grid-cols-3 gap-3">
              {[
                { icon: "shield" as const, label: "Tier-1 OEM" },
                { icon: "check" as const, label: "Warranty registered" },
                { icon: "globe" as const, label: "Pan-India delivery" },
              ].map((item) => (
                <li key={item.label} className="card-flat p-4 flex items-center gap-3">
                  <span className="icon-tile" style={{ height: "2.25rem", width: "2.25rem" }}>
                    <Icon name={item.icon} size={18} />
                  </span>
                  <span className="text-sm font-medium text-foreground">{item.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Specifications */}
      {product.features?.length > 0 && (
        <section className="border-y border-[var(--border)]" style={{ background: "var(--background-2)" }}>
          <div className="container-wide py-16 md:py-20">
            <span className="eyebrow">Specifications</span>
            <h2 className="section-title mt-3">Key features &amp; specs</h2>
            <div className="mt-10 card overflow-hidden">
              <dl>
                {product.features.map((f, idx) => (
                  <div
                    key={f}
                    className={`grid grid-cols-[auto_1fr] gap-4 px-6 py-4 items-start ${
                      idx !== 0 ? "border-t border-[var(--border)]" : ""
                    }`}
                  >
                    <dt className="text-xs font-mono uppercase tracking-[0.16em] text-muted-2 pt-1 min-w-[70px]">
                      Spec {String(idx + 1).padStart(2, "0")}
                    </dt>
                    <dd className="text-[15px] text-foreground leading-relaxed">{f}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>
      )}

      {/* Related products */}
      {related.length > 0 && (
        <section className="container-wide py-16 md:py-20">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
            <div>
              <span className="eyebrow">Related products</span>
              <h2 className="section-title mt-3">More in {product.category}</h2>
            </div>
            <Link href="/products" className="btn-outline w-fit">View all <Icon name="arrow" size={16} /></Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Inquiry CTA */}
      <section className="container-wide pb-20">
        <div
          className="rounded-2xl p-8 md:p-12 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(124,58,237,0.06) 0%, var(--background-2) 50%, rgba(6,182,212,0.06) 100%)",
            border: "1px solid var(--border-strong)",
          }}
        >
          <div className="absolute inset-0 grid-pattern opacity-30" aria-hidden />
          <div className="relative grid md:grid-cols-[1fr_auto] gap-6 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold text-foreground-strong tracking-tight">
                Bulk pricing or rate-contract enquiry?
              </h2>
              <p className="mt-3 text-muted leading-relaxed">
                We supply across India for enterprise, government and service-provider tenders. Tell
                us the quantities and timeline, and we will send a proposal.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row md:flex-col gap-3">
              <Link href="/contact" className="btn-primary">
                Request bulk quote <Icon name="arrow" size={16} />
              </Link>
              <a href={`mailto:${company.supportEmail}`} className="btn-outline">
                <Icon name="mail" size={14} /> {company.supportEmail}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
