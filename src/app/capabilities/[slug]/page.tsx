import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCapabilities, getCapabilityBySlug, getServiceBySlug, getCompany, getSettings } from "@/lib/data";
import { Icon } from "@/components/Icon";
import { ProcessTimeline } from "@/components/ProcessTimeline";
import {
  breadcrumbsJsonLd,
  buildMetadata,
  capabilityJsonLd,
  resolveDescription,
  resolveOgImage,
} from "@/lib/seo";

export async function generateStaticParams() {
  const capabilities = await getCapabilities();
  return capabilities.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [capability, settings] = await Promise.all([getCapabilityBySlug(slug), getSettings()]);
  if (!capability) {
    return buildMetadata({ title: "Capability", description: "Nexatel capability", path: `/capabilities/${slug}` });
  }
  const description = resolveDescription(undefined, capability.description, capability.summary, settings);
  const ogImage = resolveOgImage(undefined, capability.image, settings);
  return buildMetadata({
    title: capability.title,
    description,
    path: `/capabilities/${slug}`,
    image: ogImage ? { url: ogImage, alt: capability.title } : undefined,
    ogType: "article",
  });
}

export default async function CapabilityDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const capability = await getCapabilityBySlug(slug);
  if (!capability) notFound();

  const [parentService, company] = await Promise.all([
    getServiceBySlug(capability.parentService),
    getCompany(),
  ]);

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      capabilityJsonLd(capability, company),
      breadcrumbsJsonLd([
        { name: "Home", path: "/" },
        { name: "Capabilities", path: "/capabilities" },
        { name: capability.title, path: `/capabilities/${capability.slug}` },
      ]),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
      />

      {/* Hero */}
      <section className="hero-gradient text-white relative overflow-hidden">
        <div
          className="pointer-events-none absolute -top-32 right-[-15%] h-[520px] w-[520px] rounded-full opacity-50 blur-3xl"
          aria-hidden
          style={{ background: "radial-gradient(closest-side, rgba(124,58,237,0.55), transparent)" }}
        />
        <div className="container-wide relative py-20 md:py-24">
          <div className="mb-6">
            <Link href="/capabilities" className="text-sm text-slate-400 hover:text-white inline-flex items-center gap-1 transition-colors">
              ← All capabilities
            </Link>
          </div>
          <div>
            <span className="eyebrow">Capability</span>
          </div>
          <h1 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-semibold tracking-[-0.03em] max-w-3xl leading-[1.05]">
            {capability.title}
          </h1>
          <p className="mt-5 text-lg text-slate-300/90 max-w-2xl leading-relaxed">{capability.summary}</p>
          {parentService && (
            <Link
              href={`/services/${parentService.slug}`}
              className="mt-7 inline-flex badge hover:border-[rgba(124,58,237,0.4)] hover:text-white transition-colors"
            >
              <span className="text-slate-400">Service</span>
              <span className="text-white normal-case tracking-normal font-sans font-medium text-xs">{parentService.title}</span>
              <Icon name="arrow" size={12} />
            </Link>
          )}
        </div>
      </section>

      {/* Description + image */}
      <section className="container-wide py-20 md:py-24 grid lg:grid-cols-5 gap-12">
        <div className="lg:col-span-3">
          <span className="eyebrow">Overview</span>
          <h2 className="section-title mt-3">What this involves</h2>
          <p className="lead mt-5">{capability.description}</p>
        </div>
        <div className="lg:col-span-2 relative aspect-[4/3] rounded-2xl overflow-hidden ring-1 ring-[var(--border-strong)]">
          <Image src={capability.image} alt={capability.title} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
          <div className="absolute inset-0" aria-hidden style={{ background: "linear-gradient(180deg, transparent 50%, rgba(5,8,22,0.5))" }} />
        </div>
      </section>

      {/* Process timeline */}
      <section className="border-y border-[var(--border)] section-glow" style={{ background: "var(--background-2)" }}>
        <div className="container-wide py-20 md:py-24">
          <span className="eyebrow">Execution</span>
          <h2 className="section-title mt-3 max-w-3xl">Our process, step by step.</h2>
          <p className="lead mt-4 max-w-2xl">
            Every site is unique — but our methodology stays disciplined and documented from
            survey to handover.
          </p>
          <div className="mt-14 max-w-3xl">
            <ProcessTimeline steps={capability.processSteps} />
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="container-wide py-20 md:py-24">
        <span className="eyebrow">Why it matters</span>
        <h2 className="section-title mt-3 max-w-3xl">Key benefits.</h2>
        <ul className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {capability.benefits.map((b) => (
            <li key={b} className="card p-6 flex items-start gap-3">
              <span className="icon-tile shrink-0" style={{ height: "2rem", width: "2rem" }}>
                <Icon name="check" size={16} />
              </span>
              <span className="text-sm md:text-[15px] text-slate-300 leading-relaxed">{b}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* CTA */}
      <section className="container-wide pb-24">
        <div
          className="rounded-2xl p-8 md:p-12 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(124,58,237,0.18) 0%, rgba(15,23,42,1) 50%, rgba(6,182,212,0.16) 100%)",
            border: "1px solid var(--border-strong)",
          }}
        >
          <div className="absolute inset-0 grid-pattern opacity-30" aria-hidden />
          <div
            className="pointer-events-none absolute -top-16 -right-16 h-64 w-64 rounded-full opacity-60 blur-3xl"
            aria-hidden
            style={{ background: "radial-gradient(closest-side, rgba(124,58,237,0.45), transparent)" }}
          />
          <div className="relative max-w-2xl">
            <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">Need {capability.shortTitle ?? capability.title} on your project?</h2>
            <p className="mt-4 text-slate-300 leading-relaxed">
              Tell us about scope, location and timeline — we&rsquo;ll route your request to the
              right field engineer and respond with a scoped proposal.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href={`/get-quote?service=${capability.parentService}&capability=${capability.slug}`}
                className="btn-primary"
              >
                Request a quote <Icon name="arrow" size={16} />
              </Link>
              <Link href="/capabilities" className="btn-outline">
                All capabilities
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
