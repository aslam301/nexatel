import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getServices, getServiceBySlug } from "@/lib/data";
import { Icon } from "@/components/Icon";
import { buildMetadata } from "@/lib/seo";

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
    image: service.image,
  });
}

export default async function ServiceDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) notFound();
  return (
    <>
      <section className="hero-gradient text-white">
        <div className="container-wide py-16 md:py-20">
          <Link href="/services" className="text-sm text-slate-300 hover:text-white inline-flex items-center gap-1 mb-6">
            ← All services
          </Link>
          <span className="eyebrow text-[var(--accent)]">Service</span>
          <h1 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight max-w-3xl">{service.title}</h1>
          <p className="mt-5 text-lg text-slate-200 max-w-2xl">{service.summary}</p>
        </div>
      </section>

      <section className="container-wide py-16 grid lg:grid-cols-5 gap-12">
        <div className="lg:col-span-3 space-y-6">
          <h2 className="text-2xl font-semibold text-[var(--primary)]">What we deliver</h2>
          <p className="lead">{service.details}</p>
          <ul className="grid sm:grid-cols-2 gap-3 mt-4">
            {service.highlights.map((h) => (
              <li key={h} className="flex items-start gap-2 text-sm text-slate-700">
                <span className="text-[var(--accent-strong)] mt-0.5"><Icon name="check" size={18} /></span>
                {h}
              </li>
            ))}
          </ul>
          <div className="pt-2">
            <Link href="/contact" className="btn-primary">Discuss your requirement <Icon name="arrow" size={16} /></Link>
          </div>
        </div>
        <div className="lg:col-span-2 relative aspect-[4/3] rounded-2xl overflow-hidden">
          <Image src={service.image} alt={service.title} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
        </div>
      </section>
    </>
  );
}
