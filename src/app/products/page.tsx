import { Hero } from "@/components/Hero";
import { ProductsCatalog } from "@/components/ProductsCatalog";
import { getProducts } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Products",
  description:
    "Browse Nexatel's catalogue of fiber optic cables, transceivers, patch panels, FTTH FATs, ONUs and structured cabling components.",
  path: "/products",
  image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=630&fit=crop&q=70&auto=format",
  keywords: [
    "fiber optic cable India",
    "Cat6A cable",
    "fiber optic transceiver SFP+",
    "FTTH FAT",
    "fiber patch panel ODF",
    "ONU GPON India",
    "fiber distribution box FDB",
  ],
});

export const revalidate = 60;

export default async function ProductsPage() {
  const products = await getProducts();
  return (
    <>
      <Hero
        eyebrow="Catalogue"
        title="Engineered hardware, sourced and supplied."
        subtitle="Tier-1 OEM fiber-optic and networking hardware backed by Nexatel warranty registration, asset tagging and on-site delivery across India."
        size="compact"
        showStatus={false}
        backgroundImage="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=2000&q=70&auto=format&fit=crop"
      />
      <section className="container-wide py-20 md:py-24 section-glow">
        <ProductsCatalog products={products} />
      </section>
    </>
  );
}
