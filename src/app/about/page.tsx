import Image from "next/image";
import Link from "next/link";
import { Hero } from "@/components/Hero";
import { Icon } from "@/components/Icon";
import { getCompany } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata() {
  const company = await getCompany();
  return buildMetadata({
    title: "About",
    description: `${company.name} Private Limited is a specialised telecom infrastructure company headquartered in Kerala, India.`,
    path: "/about",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&h=630&fit=crop&q=70&auto=format",
    keywords: [
      "about Nexatel",
      "telecom infrastructure India",
      "fiber optic Kerala",
      "FTTH provider Kochi",
      "ROW liaison India",
    ],
  });
}

export default async function AboutPage() {
  const company = await getCompany();
  return (
    <>
      <Hero
        eyebrow="About Nexatel"
        title="Quiet engineering. Loud results."
        subtitle="We build and maintain the telecom infrastructure that powers ambitious operators, enterprises and public projects across India — under engineering leadership with 25+ years in fiber optics."
        size="compact"
        showStatus={false}
        backgroundImage="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=2000&q=75&auto=format&fit=crop"
      />

      {/* Who we are */}
      <section className="container-wide py-24 md:py-28 grid lg:grid-cols-5 gap-12">
        <div className="lg:col-span-3 space-y-6">
          <span className="eyebrow">Who we are</span>
          <h2 className="section-title">Engineering depth, delivered on the ground.</h2>
          <p className="lead">
            {company.legalName} is a specialised company in telecom systems, electrical project
            installations, network cabling and IT hardware supply &amp; installation in India,
            currently running major projects across Kerala. We are engaged in diverse business
            activities headed by a well-experienced management team and technocrats in their
            relevant fields.
          </p>
          <p className="lead">
            Our genuine strength is derived from the excellent support we get from prominent
            manufacturers and export houses around the world. Our philosophy is straightforward:
            save your time and money while ensuring that your operation runs smoothly &mdash; and
            go the extra mile to make sure your requirements are met with top-notch quality and
            reliability, backed by exceptional service from dedicated professionals who feel like
            part of your extended team.
          </p>
        </div>
        <div className="lg:col-span-2 relative aspect-[4/5] rounded-2xl overflow-hidden ring-1 ring-[var(--border-strong)]">
          <Image
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=70&auto=format&fit=crop"
            alt="Nexatel project review"
            fill
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="object-cover"
          />
          <div
            className="absolute inset-0"
            aria-hidden
            style={{ background: "linear-gradient(180deg, transparent 40%, rgba(5,8,22,0.6))" }}
          />
        </div>
      </section>

      {/* Mission / Vision */}
      <section className="border-y border-[var(--border)] section-glow" style={{ background: "var(--background-2)" }}>
        <div className="container-wide py-24 md:py-28">
          <span className="eyebrow">Direction</span>
          <h2 className="section-title mt-3 max-w-3xl">Mission &amp; vision.</h2>
          <div className="mt-12 grid lg:grid-cols-2 gap-5">
            {company.mission && (
              <div className="card p-8 lg:p-10">
                <div className="icon-tile icon-tile-lg">
                  <Icon name="globe" size={26} />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-white">Our mission</h3>
                <p className="mt-3 text-[15px] text-slate-400 leading-relaxed">{company.mission}</p>
              </div>
            )}
            {company.vision && (
              <div className="card p-8 lg:p-10">
                <div className="icon-tile icon-tile-lg">
                  <Icon name="sparkle" size={26} />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-white">Our vision</h3>
                <p className="mt-3 text-[15px] text-slate-400 leading-relaxed">{company.vision}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Values */}
      {company.values && company.values.length > 0 && (
        <section className="container-wide py-24 md:py-28">
          <span className="eyebrow">What we stand for</span>
          <h2 className="section-title mt-3 max-w-3xl">Our values.</h2>
          <p className="lead mt-4">
            Excel with integrity, expertise, teamwork and client focus.
          </p>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {company.values.map((v) => (
              <div key={v} className="card p-6 flex items-center gap-4">
                <div className="icon-tile shrink-0">
                  <Icon name="check" size={20} />
                </div>
                <h3 className="text-base font-semibold text-white">{v}</h3>
              </div>
            ))}
          </div>
        </section>
      )}

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
                  <h3 className="text-xl font-semibold text-white">
                    {o.city}, {o.country}
                    {o.isHeadquarters && (
                      <span
                        className="ml-2 align-middle text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded"
                        style={{ color: "var(--tech)", background: "rgba(6,182,212,0.10)", border: "1px solid rgba(6,182,212,0.25)" }}
                      >HQ</span>
                    )}
                  </h3>
                </div>
                <p className="mt-5 text-sm text-slate-400 leading-relaxed">{o.address}</p>
                <div className="mt-5 flex flex-col gap-2 text-sm text-slate-300">
                  <span className="inline-flex items-center gap-2"><Icon name="phone" size={16} /> {o.phone}</span>
                  <a href={`mailto:${o.email}`} className="inline-flex items-center gap-2 hover:text-white transition-colors"><Icon name="mail" size={16} /> {o.email}</a>
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
                  <h3 className="text-xl font-semibold text-white">
                    {company.partner.name}, {company.partner.country}
                    <span
                      className="ml-2 align-middle text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded"
                      style={{ color: "var(--violet)", background: "rgba(124,58,237,0.10)", border: "1px solid rgba(124,58,237,0.25)" }}
                    >Sister</span>
                  </h3>
                </div>
                <p className="mt-5 text-sm text-slate-400 leading-relaxed">{company.partner.note}</p>
                <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-white group-hover:gap-2.5 transition-all">
                  <span style={{ background: "linear-gradient(90deg, #a78bfa, #67e8f9)", backgroundClip: "text", color: "transparent" }}>
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
            <h3 className="text-xl md:text-2xl font-semibold text-white tracking-tight">Plan your project with us.</h3>
            <p className="text-slate-400 mt-2">Tell us about scope, location and timeline — we&rsquo;ll come back with a clear proposal.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/get-quote" className="btn-primary">Request a quote <Icon name="arrow" size={16} /></Link>
            <Link href="/contact" className="btn-outline">Contact us</Link>
          </div>
        </div>
      </section>
    </>
  );
}
