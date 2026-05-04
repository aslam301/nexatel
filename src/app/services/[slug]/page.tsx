import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCompany, getServices, getServiceBySlug, getCapabilitiesByService } from "@/lib/data";
import { Icon } from "@/components/Icon";
import { CapabilityCard } from "@/components/CapabilityCard";
import { breadcrumbsJsonLd, buildMetadata, serviceJsonLd } from "@/lib/seo";

export async function generateStaticParams() {
  const services = await getServices();
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return buildMetadata({ title: "Service", description: "Nexatel service", path: `/services/${slug}` });
  return buildMetadata({
    title: service.title,
    description: service.summary,
    path: `/services/${slug}`,
    image: { url: service.image, alt: service.title },
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
          className="pointer-events-none absolute -top-24 right-[-10%] h-[420px] w-[420px] rounded-full opacity-50 blur-3xl"
          aria-hidden
          style={{ background: "radial-gradient(closest-side, rgba(6,182,212,0.40), transparent)" }}
        />
        <div className="container-wide relative py-16 md:py-20">
          <Link href="/services" className="text-sm text-slate-300 hover:text-white inline-flex items-center gap-1 mb-6">
            ← All services
          </Link>
          <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-[var(--accent)]">Service</span>
          <h1 className="mt-3 text-4xl md:text-5xl lg:text-6xl font-semibold tracking-[-0.03em] max-w-3xl leading-[1.05]">{service.title}</h1>
          <p className="mt-5 text-lg text-slate-200/90 max-w-2xl">{service.summary}</p>
        </div>
      </section>

      <section className="container-wide py-16 md:py-20 grid lg:grid-cols-5 gap-12">
        <div className="lg:col-span-3 space-y-6">
          <h2 className="text-2xl font-semibold text-[var(--primary)] tracking-tight">What we deliver</h2>
          <p className="lead">{service.details}</p>
          <ul className="grid sm:grid-cols-2 gap-3 mt-4">
            {service.highlights.map((h) => (
              <li key={h} className="flex items-start gap-2 text-sm text-slate-700">
                <span className="text-[var(--accent-strong)] mt-0.5"><Icon name="check" size={18} /></span>
                {h}
              </li>
            ))}
          </ul>
          <div className="pt-2 flex flex-wrap gap-3">
            <Link href={`/get-quote?service=${service.slug}`} className="btn-primary">Get a quote <Icon name="arrow" size={16} /></Link>
            <Link href="/contact" className="btn-outline">Talk to our team</Link>
          </div>
        </div>
        <div className="lg:col-span-2 relative aspect-[4/3] rounded-2xl overflow-hidden ring-1 ring-[var(--border)]">
          <Image src={service.image} alt={service.title} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
        </div>
      </section>

      {capabilities.length > 0 && (
        <section className="bg-[var(--surface)] border-y border-[var(--border)]">
          <div className="container-wide py-16 md:py-20">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
              <div className="max-w-2xl">
                <span className="eyebrow">Field capabilities</span>
                <h2 className="section-title mt-2">Inside this service</h2>
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
