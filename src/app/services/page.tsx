import { Hero } from "@/components/Hero";
import { ServiceCard } from "@/components/ServiceCard";
import { getServices } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Services",
  description:
    "IT services, fiber optics, structured cabling, telecom infrastructure and clean-energy installations from Nexatel.",
  path: "/services",
  image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=630&fit=crop&q=70&auto=format",
  keywords: [
    "managed IT services Kuwait",
    "fiber optic installation Kerala",
    "structured cabling GCC",
    "telecom infrastructure Kuwait",
    "rooftop solar Kuwait",
    "BICSI cabling",
  ],
});

export default async function ServicesPage() {
  const services = await getServices();
  return (
    <>
      <Hero
        eyebrow="Services"
        title="End-to-end engineering, under one roof."
        subtitle="Five specialised divisions, each led by domain experts and backed by Nexatel's regional support footprint."
        size="compact"
        showStatus={false}
        backgroundImage="https://images.unsplash.com/photo-1518770660439-4636190af475?w=2000&q=70&auto=format&fit=crop"
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
