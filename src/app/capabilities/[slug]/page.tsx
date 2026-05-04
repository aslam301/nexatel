import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCapabilities, getCapabilityBySlug, getServiceBySlug, getCompany } from "@/lib/data";
import { Icon } from "@/components/Icon";
import { ProcessTimeline } from "@/components/ProcessTimeline";
import { breadcrumbsJsonLd, buildMetadata, capabilityJsonLd } from "@/lib/seo";

export async function generateStaticParams() {
  const capabilities = await getCapabilities();
  return capabilities.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const capability = await getCapabilityBySlug(slug);
  if (!capability) {
    return buildMetadata({ title: "Capability", description: "Nexatel capability", path: `/capabilities/${slug}` });
  }
  return buildMetadata({
    title: capability.title,
    description: capability.summary,
    path: `/capabilities/${slug}`,
    image: { url: capability.image, alt: capability.title },
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
          className="pointer-events-none absolute -top-24 right-[-10%] h-[420px] w-[420px] rounded-full opacity-50 blur-3xl"
          aria-hidden
          style={{ background: "radial-gradient(closest-side, rgba(6,182,212,0.40), transparent)" }}
        />
        <div className="container-wide relative py-16 md:py-20">
          <Link href="/capabilities" className="text-sm text-slate-300 hover:text-white inline-flex items-center gap-1 mb-6">
            ← All capabilities
          </Link>
          <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-[var(--accent)]">Capability</span>
          <h1 className="mt-3 text-4xl md:text-5xl lg:text-6xl font-semibold tracking-[-0.03em] max-w-3xl leading-[1.05]">
            {capability.title}
          </h1>
          <p className="mt-5 text-lg text-slate-200/90 max-w-2xl">{capability.summary}</p>
          {parentService && (
            <Link
              href={`/services/${parentService.slug}`}
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1 text-xs text-slate-200 hover:bg-white/[0.12] transition-colors"
            >
              <span className="font-mono uppercase tracking-[0.16em] text-[10px]">Service</span>
              <span className="font-medium">{parentService.title}</span>
              <Icon name="arrow" size={12} />
            </Link>
          )}
        </div>
      </section>

      {/* Description + image */}
      <section className="container-wide py-16 md:py-20 grid lg:grid-cols-5 gap-12">
        <div className="lg:col-span-3">
          <span className="eyebrow">Overview</span>
          <h2 className="section-title mt-2">What this involves</h2>
          <p className="lead mt-4">{capability.description}</p>
        </div>
        <div className="lg:col-span-2 relative aspect-[4/3] rounded-2xl overflow-hidden ring-1 ring-[var(--border)]">
          <Image src={capability.image} alt={capability.title} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
        </div>
      </section>

      {/* Process timeline */}
      <section className="bg-[var(--surface)] border-y border-[var(--border)]">
        <div className="container-wide py-16 md:py-20">
          <span className="eyebrow">Execution</span>
          <h2 className="section-title mt-2 max-w-3xl">Our process, step by step.</h2>
          <p className="lead mt-3 max-w-2xl">
            Every site is unique — but our methodology stays disciplined and documented from
            survey to handover.
          </p>
          <div className="mt-12 max-w-3xl">
            <ProcessTimeline steps={capability.processSteps} />
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="container-wide py-16 md:py-20">
        <span className="eyebrow">Why it matters</span>
        <h2 className="section-title mt-2 max-w-3xl">Key benefits.</h2>
        <ul className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {capability.benefits.map((b) => (
            <li
              key={b}
              className="flex items-start gap-3 rounded-xl border border-[var(--border)] bg-white p-5"
            >
              <span
                className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[var(--primary)]"
                style={{ background: "linear-gradient(135deg, rgba(6,182,212,0.14), rgba(245,158,11,0.10))" }}
              >
                <Icon name="check" size={16} />
              </span>
              <span className="text-sm md:text-[15px] text-slate-700 leading-relaxed">{b}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* CTA */}
      <section className="container-wide pb-20 md:pb-24">
        <div className="rounded-2xl hero-gradient text-white p-8 md:p-12 relative overflow-hidden">
          <div className="absolute inset-0 grid-pattern opacity-50" aria-hidden />
          <div
            className="pointer-events-none absolute -top-16 -right-16 h-64 w-64 rounded-full opacity-50 blur-3xl"
            aria-hidden
            style={{ background: "radial-gradient(closest-side, rgba(6,182,212,0.40), transparent)" }}
          />
          <div className="relative max-w-2xl">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Need {capability.shortTitle ?? capability.title} on your project?</h2>
            <p className="mt-3 text-slate-200/90">
              Tell us about scope, location and timeline — we&rsquo;ll route your request to the
              right field engineer and respond with a scoped proposal.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={`/get-quote?service=${capability.parentService}&capability=${capability.slug}`}
                className="btn-accent"
              >
                Request a quote <Icon name="arrow" size={16} />
              </Link>
              <Link
                href="/capabilities"
                className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
              >
                All capabilities
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
