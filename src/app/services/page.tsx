import { Hero } from "@/components/Hero";
import { ServiceCard } from "@/components/ServiceCard";
import { getServices } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Services",
  description:
    "IT services, fiber optics, structured cabling, telecom infrastructure and clean-energy installations from Nexatel.",
  path: "/services",
});

export default async function ServicesPage() {
  const services = await getServices();
  return (
    <>
      <Hero
        eyebrow="Services"
        title="End-to-end engineering, under one roof."
        subtitle="Five specialised divisions, each led by domain experts and backed by Nexatel's regional support footprint."
      />
      <section className="container-wide py-20">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <ServiceCard key={s.slug} service={s} />
          ))}
        </div>
      </section>
    </>
  );
}
