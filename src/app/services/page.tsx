import Link from "next/link";
import { Hero } from "@/components/Hero";
import { ServiceCard } from "@/components/ServiceCard";
import { Icon } from "@/components/Icon";
import { getServices } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Services",
  description:
    "Fiber optic projects, telecom infrastructure, network cabling, CCTV systems and IT hardware supply from Nexatel Private Limited.",
  path: "/services",
  image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=630&fit=crop&q=70&auto=format",
  keywords: [
    "fiber optic installation India",
    "FTTH GPON deployment Kerala",
    "structured cabling Kochi",
    "CCTV installation India",
    "IT hardware supply India",
    "telecom infrastructure ROW liaison",
  ],
});

export default async function ServicesPage() {
  const services = await getServices();
  return (
    <>
      <Hero
        eyebrow="Services"
        title="End-to-end engineering, under one roof."
        subtitle="Five specialised practices covering everything from fiber optic backbones and last-mile FTTH to CCTV systems and tier-1 IT hardware supply."
        size="compact"
        showStatus={false}
        backgroundImage="https://images.unsplash.com/photo-1518770660439-4636190af475?w=2000&q=70&auto=format&fit=crop"
      />
      <section className="container-wide py-24 md:py-28 section-glow">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <ServiceCard key={s.slug} service={s} />
          ))}
        </div>

        <div className="mt-16 card p-8 md:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div className="max-w-2xl">
            <span className="eyebrow">Going deeper</span>
            <h2 className="text-xl md:text-2xl font-semibold text-white mt-3 tracking-tight">
              Explore the field capabilities behind every project.
            </h2>
            <p className="text-slate-400 mt-3 text-[15px] leading-relaxed">
              HDD, manual trenching, manhole &amp; pole erection, DIT testing, fiber cable blowing
              and splicing &amp; termination — see how the work gets done.
            </p>
          </div>
          <Link href="/capabilities" className="btn-primary self-start md:self-auto">
            View capabilities <Icon name="arrow" size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
