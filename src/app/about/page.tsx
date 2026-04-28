import Image from "next/image";
import { Hero } from "@/components/Hero";
import { Icon } from "@/components/Icon";
import { getCompany } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata() {
  const company = await getCompany();
  return buildMetadata({
    title: "About",
    description: `${company.name} is a multi-vertical engineering and technology group with deep roots in Kerala and operations across Kuwait.`,
    path: "/about",
  });
}

export default async function AboutPage() {
  const company = await getCompany();
  return (
    <>
      <Hero
        eyebrow="About Nexatel"
        title="Quiet engineering. Loud results."
        subtitle="We build and maintain the physical and digital infrastructure that powers ambitious organisations across Kuwait and India."
      />

      <section className="container-wide py-20 grid lg:grid-cols-5 gap-12">
        <div className="lg:col-span-3 space-y-6">
          <span className="eyebrow">Our story</span>
          <h2 className="section-title">Founded in Kerala. Battle-tested in Kuwait.</h2>
          <p className="lead">
            Nexatel began in {company.founded} as a small fiber-splicing crew in Kochi.
            Sixteen years on, we are a multi-vertical engineering group with full-service
            offices in Kuwait City and Kochi, and a delivery footprint that spans the GCC and
            South Asia. We&rsquo;ve never tried to be the loudest player &mdash; just the most
            reliable one.
          </p>
          <p className="lead">
            Our engineers are certified with leading OEMs across optical networking, LV/MV
            electrical, and PV installation. Our project managers carry PMP, PRINCE2 and
            BICSI credentials. And our after-sales teams are on-call 24x7 for every contract
            we sign.
          </p>
        </div>
        <div className="lg:col-span-2 relative aspect-[4/5] rounded-2xl overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=70&auto=format&fit=crop"
            alt="Nexatel project review"
            fill
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="object-cover"
          />
        </div>
      </section>

      {/* Values */}
      <section className="bg-[var(--surface)] border-y border-[var(--border)]">
        <div className="container-wide py-20">
          <span className="eyebrow">What we stand for</span>
          <h2 className="section-title mt-2 max-w-3xl">Four principles, applied on every site.</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-10">
            {[
              { icon: "shield" as const, title: "Safety first", body: "Zero-incident sites are non-negotiable. Every crew is trained, certified and insured." },
              { icon: "check" as const, title: "Build to last", body: "We over-engineer for harsh GCC environments — heat, dust, salt and humidity." },
              { icon: "globe" as const, title: "Local + global", body: "Kerala engineering depth combined with Kuwait project execution discipline." },
              { icon: "phone" as const, title: "Always on", body: "24x7 on-call response and predictable maintenance windows for every contract." },
            ].map((v) => (
              <div key={v.title} className="card p-6">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg" style={{ background: "rgba(10,37,64,0.08)", color: "var(--primary)" }}>
                  <Icon name={v.icon} size={22} />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-[var(--primary)]">{v.title}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Offices */}
      <section className="container-wide py-20">
        <span className="eyebrow">Where to find us</span>
        <h2 className="section-title mt-2">Two offices. One standard.</h2>
        <div className="grid md:grid-cols-2 gap-5 mt-10">
          {company.offices.map((o) => (
            <div key={o.city} className="card p-7">
              <div className="flex items-center gap-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg" style={{ background: "rgba(245,158,11,0.12)", color: "var(--accent-strong)" }}>
                  <Icon name="pin" size={20} />
                </div>
                <h3 className="text-xl font-semibold text-[var(--primary)]">
                  {o.city}, {o.country}
                  {o.isHeadquarters && (
                    <span className="ml-2 align-middle text-[10px] uppercase tracking-wider text-[var(--accent-strong)] bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">HQ</span>
                  )}
                </h3>
              </div>
              <p className="mt-4 text-sm text-slate-600 leading-relaxed">{o.address}</p>
              <div className="mt-4 flex flex-col gap-1.5 text-sm text-slate-700">
                <span className="inline-flex items-center gap-2"><Icon name="phone" size={16} /> {o.phone}</span>
                <a href={`mailto:${o.email}`} className="inline-flex items-center gap-2 hover:text-[var(--primary)]"><Icon name="mail" size={16} /> {o.email}</a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
