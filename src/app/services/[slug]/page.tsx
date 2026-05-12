import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCompany, getServices, getServiceBySlug, getCapabilitiesByService, getSettings } from "@/lib/data";
import { Icon } from "@/components/Icon";
import { CapabilityCard } from "@/components/CapabilityCard";
import {
  breadcrumbsJsonLd,
  buildMetadata,
  serviceJsonLd,
  resolveDescription,
  resolveOgImage,
} from "@/lib/seo";

export async function generateStaticParams() {
  const services = await getServices();
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [service, settings] = await Promise.all([getServiceBySlug(slug), getSettings()]);
  if (!service) return buildMetadata({ title: "Service", description: "Nexatel service", path: `/services/${slug}` });
  const description = resolveDescription(undefined, service.details, service.summary, settings);
  const ogImage = resolveOgImage(undefined, service.image, settings);
  return buildMetadata({
    title: service.title,
    description,
    path: `/services/${slug}`,
    image: ogImage ? { url: ogImage, alt: service.title } : undefined,
    ogType: "article",
  });
}

export default async function ServiceDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [service, company, capabilities] = await Promise.all([
    getServiceBySlug(slug),
    getCompany(),
    getCapabilitiesByService(slug),
  ]);
  if (!service) notFound();
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      serviceJsonLd(service, company),
      breadcrumbsJsonLd([
        { name: "Home", path: "/" },
        { name: "Services", path: "/services" },
        { name: service.title, path: `/services/${service.slug}` },
      ]),
    ],
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
      />
      <section className="hero-gradient text-white relative overflow-hidden">
        <div
          className="pointer-events-none absolute -top-32 right-[-15%] h-[520px] w-[520px] rounded-full opacity-50 blur-3xl"
          aria-hidden
          style={{ background: "radial-gradient(closest-side, rgba(124,58,237,0.55), transparent)" }}
        />
        <div className="container-wide relative py-20 md:py-24">
          <div className="mb-6">
            <Link href="/services" className="text-sm text-slate-400 hover:text-white inline-flex items-center gap-1 transition-colors">
              ← All services
            </Link>
          </div>
          <div>
            <span className="eyebrow">Service</span>
          </div>
          <h1 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-semibold tracking-[-0.03em] max-w-3xl leading-[1.05]">{service.title}</h1>
          <p className="mt-5 text-lg text-slate-300/90 max-w-2xl leading-relaxed">{service.summary}</p>
        </div>
      </section>

      <section className="container-wide py-20 md:py-24 grid lg:grid-cols-5 gap-12">
        <div className="lg:col-span-3 space-y-6">
          <h2 className="text-2xl font-semibold text-white tracking-tight">What we deliver</h2>
          <p className="lead">{service.details}</p>
          <ul className="grid sm:grid-cols-2 gap-3 mt-4">
            {service.highlights.map((h) => (
              <li key={h} className="flex items-start gap-2.5 text-sm text-slate-300">
                <span className="mt-0.5" style={{ color: "var(--tech)" }}><Icon name="check" size={18} /></span>
                {h}
              </li>
            ))}
          </ul>
          <div className="pt-4 flex flex-wrap gap-3">
            <Link href="/contact" className="btn-primary">Get a quote <Icon name="arrow" size={16} /></Link>
          </div>
        </div>
        <div className="lg:col-span-2 relative aspect-[4/3] rounded-2xl overflow-hidden ring-1 ring-[var(--border-strong)]">
          <Image src={service.image} alt={service.title} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
          <div className="absolute inset-0" aria-hidden style={{ background: "linear-gradient(180deg, transparent 50%, rgba(5,8,22,0.5))" }} />
        </div>
      </section>

      {capabilities.length > 0 && (
        <section className="border-y border-[var(--border)] section-glow" style={{ background: "var(--background-2)" }}>
          <div className="container-wide py-20 md:py-24">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
              <div className="max-w-2xl">
                <span className="eyebrow">Field capabilities</span>
                <h2 className="section-title mt-3">Inside this service</h2>
              </div>
              <Link href="/capabilities" className="btn-outline w-fit">All capabilities <Icon name="arrow" size={16} /></Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {capabilities.map((c) => (
                <CapabilityCard key={c.slug} capability={c} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
