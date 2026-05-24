import Image from "next/image";
import Link from "next/link";
import { Hero } from "@/components/Hero";
import { Icon } from "@/components/Icon";
import { MissionVisionValues } from "@/components/MissionVisionValues";
import { AreasOfFocus } from "@/components/AreasOfFocus";
import { getCompany, getSite } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata() {
  const [company, site] = await Promise.all([getCompany(), getSite()]);
  return buildMetadata({
    title: "About",
    description: `${company.legalName} is a specialist IT networking and telecom infrastructure company based in Kerala, India.`,
    path: "/about",
    image: site.about.hero.image,
    keywords: [
      "about Nexatel",
      "IT networking India",
      "telecom infrastructure Kerala",
      "structured cabling Kochi",
      "enterprise IT supplier India",
    ],
  });
}

export default async function AboutPage() {
  const [company, site] = await Promise.all([getCompany(), getSite()]);
  return (
    <>
      <Hero
        eyebrow={site.about.hero.eyebrow}
        title={site.about.hero.title}
        subtitle={site.about.hero.subtitle}
        size="compact"
        showStatus={false}
        backgroundImage={site.about.hero.image}
      />

      {/* Who we are */}
      <section className="container-wide py-24 md:py-28 grid lg:grid-cols-5 gap-12">
        <div className="lg:col-span-3 space-y-6">
          <span className="eyebrow">{site.about.body.eyebrow}</span>
          <h2 className="section-title">{site.about.body.title}</h2>
          {site.about.body.paragraphs.map((p, i) => (
            <p key={i} className={i === 0 ? "lead" : "text-muted leading-relaxed"}>{p}</p>
          ))}
        </div>
        <div className="lg:col-span-2 relative aspect-[4/5] rounded-2xl overflow-hidden ring-1 ring-[var(--border-strong)]">
          <Image
            src={site.about.body.image}
            alt="Nexatel team on site"
            fill
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="object-cover"
          />
          <div
            className="absolute inset-0"
            aria-hidden
            style={{ background: "linear-gradient(180deg, transparent 40%, rgba(15,23,42,0.14))" }}
          />
        </div>
      </section>

      {/* Mission / Vision / Values */}
      <section className="border-y border-[var(--border)] section-glow" style={{ background: "var(--background-2)" }}>
        <div className="container-wide py-24 md:py-28">
          <div className="max-w-2xl">
            <span className="eyebrow">Direction</span>
            <h2 className="section-title mt-3">What drives the work.</h2>
          </div>
          <div className="mt-12">
            <MissionVisionValues company={company} />
          </div>
        </div>
      </section>

      {/* Areas of focus */}
      <section className="container-wide py-24 md:py-28">
        <div className="max-w-2xl mb-12">
          <span className="eyebrow">Who we work with</span>
          <h2 className="section-title mt-3">Built for the sectors that cannot afford downtime.</h2>
        </div>
        <AreasOfFocus areas={company.areasOfFocus} />
      </section>

      {/* Office */}
      <section className="border-y border-[var(--border)]" style={{ background: "var(--background-2)" }}>
        <div className="container-wide py-24 md:py-28">
          <span className="eyebrow">Where to find us</span>
          <h2 className="section-title mt-3">Headquartered in Kerala.</h2>
          <div className="grid md:grid-cols-2 gap-5 mt-12">
            {company.offices.map((o) => (
              <div key={o.city} className="card p-8">
                <div className="flex items-center gap-3">
                  <div className="icon-tile">
                    <Icon name="pin" size={20} />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground-strong">
                    {o.city}, {o.country}
                    {o.isHeadquarters && (
                      <span
                        className="ml-2 align-middle text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded"
                        style={{ color: "var(--tech)", background: "rgba(6,182,212,0.10)", border: "1px solid rgba(6,182,212,0.25)" }}
                      >HQ</span>
                    )}
                  </h3>
                </div>
                <p className="mt-5 text-sm text-muted leading-relaxed">{o.address}</p>
                <div className="mt-5 flex flex-col gap-2 text-sm text-muted">
                  <span className="inline-flex items-center gap-2"><Icon name="phone" size={16} /> {o.phone}</span>
                  <a href={`mailto:${o.email}`} className="inline-flex items-center gap-2 hover:text-foreground-strong transition-colors"><Icon name="mail" size={16} /> {o.email}</a>
                </div>
              </div>
            ))}
            {company.partner && (
              <a
                href={company.partner.url}
                target="_blank"
                rel="noopener noreferrer"
                className="card p-8 group"
              >
                <div className="flex items-center gap-3">
                  <div className="icon-tile">
                    <Icon name="partner" size={20} />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground-strong">
                    {company.partner.name}, {company.partner.country}
                    <span
                      className="ml-2 align-middle text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded"
                      style={{ color: "var(--violet)", background: "rgba(124,58,237,0.10)", border: "1px solid rgba(124,58,237,0.25)" }}
                    >Sister</span>
                  </h3>
                </div>
                <p className="mt-5 text-sm text-muted leading-relaxed">{company.partner.note}</p>
                <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-foreground-strong group-hover:gap-2.5 transition-all">
                  <span style={{ background: "linear-gradient(90deg, var(--violet), var(--tech))", backgroundClip: "text", color: "transparent" }}>
                    Visit {company.partner.name}
                  </span>
                  <Icon name="arrow" size={16} />
                </div>
              </a>
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-wide py-20">
        <div className="card p-8 md:p-12 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div>
            <h3 className="text-xl md:text-2xl font-semibold text-foreground-strong tracking-tight">{site.about.cta.title}</h3>
            <p className="text-muted mt-2">{site.about.cta.body}</p>
          </div>
          <div className="flex gap-3">
            <Link href="/contact" className="btn-primary">{site.about.cta.primaryLabel} <Icon name="arrow" size={16} /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
