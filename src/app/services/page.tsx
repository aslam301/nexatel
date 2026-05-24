import Link from "next/link";
import { Hero } from "@/components/Hero";
import { ServiceCard } from "@/components/ServiceCard";
import { Icon } from "@/components/Icon";
import { getServices, getSite } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata() {
  const site = await getSite();
  return buildMetadata({
    title: "Services",
    description: site.pages.services.subtitle,
    path: "/services",
    image: site.pages.services.image,
    keywords: [
      "IT networking India",
      "structured cabling Kochi",
      "fibre optic installation Kerala",
      "telecom infrastructure ROW liaison",
      "CCTV and access control India",
      "enterprise IT hardware supply India",
    ],
  });
}

export default async function ServicesPage() {
  const [services, site] = await Promise.all([getServices(), getSite()]);
  return (
    <>
      <Hero
        eyebrow={site.pages.services.eyebrow}
        title={site.pages.services.title}
        subtitle={site.pages.services.subtitle}
        size="compact"
        showStatus={false}
        backgroundImage={site.pages.services.image}
      />
      <section className="container-wide py-24 md:py-28 section-glow">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <ServiceCard key={s.slug} service={s} />
          ))}
        </div>

        <div className="mt-16 card p-8 md:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div className="max-w-2xl">
            <span className="eyebrow">Need a combined proposal?</span>
            <h2 className="text-xl md:text-2xl font-semibold text-foreground-strong mt-3 tracking-tight">
              Most of our projects span two or three of these practices.
            </h2>
            <p className="text-muted mt-3 text-[15px] leading-relaxed">
              Networks, cabling, CCTV and hardware all on a single scope and a single point of contact. Send us the brief and we will come back with a clear proposal.
            </p>
          </div>
          <Link href="/contact" className="btn-primary self-start md:self-auto">
            Request a proposal <Icon name="arrow" size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
