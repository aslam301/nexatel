import { Hero } from "@/components/Hero";
import { ProductsCatalog } from "@/components/ProductsCatalog";
import { getProducts, getSite } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata() {
  const site = await getSite();
  return buildMetadata({
    title: "Products",
    description: site.pages.products.subtitle,
    path: "/products",
    image: site.pages.products.image,
    keywords: [
      "fibre optic products India",
      "structured cabling accessories",
      "network switch router firewall India",
      "CCTV access control supplier",
      "online UPS supplier Kerala",
      "rooftop solar Kerala",
    ],
  });
}

export const revalidate = 60;

const CATEGORY_ORDER = [
  "Fibre Optics Products",
  "Network Cabling Accessories",
  "IT Hardware & Software",
  "Security System Products",
  "IT Network Products",
  "Electrical UPS and Batteries",
  "Renewable Energy Solutions",
];

export default async function ProductsPage() {
  const [products, site] = await Promise.all([getProducts(), getSite()]);
  return (
    <>
      <Hero
        eyebrow={site.pages.products.eyebrow}
        title={site.pages.products.title}
        subtitle={site.pages.products.subtitle}
        size="compact"
        showStatus={false}
        backgroundImage={site.pages.products.image}
      />
      <section className="container-wide py-20 md:py-24 section-glow">
        <ProductsCatalog products={products} categoryOrder={CATEGORY_ORDER} />
      </section>
    </>
  );
}
