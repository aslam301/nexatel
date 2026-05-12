import { Hero } from "@/components/Hero";
import { Icon } from "@/components/Icon";
import { ContactForm } from "@/components/ContactForm";
import { getCompany } from "@/lib/data";
import { buildMetadata, localBusinessJsonLd } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Contact",
  description:
    "Talk to Nexatel Private Limited about fiber optic, telecom infrastructure, network cabling, CCTV and IT hardware projects across India.",
  path: "/contact",
  image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=630&fit=crop&q=70&auto=format",
});

export default async function ContactPage() {
  const company = await getCompany();
  const businesses = localBusinessJsonLd(company);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": businesses }) }}
      />
      <Hero
        eyebrow="Contact"
        title="Let's scope your next deployment."
        subtitle="Tell us about your project — we usually reply within one business day."
        size="compact"
        showStatus={false}
        backgroundImage="https://images.unsplash.com/photo-1497366216548-37526070297c?w=2000&q=70&auto=format&fit=crop"
      />
      <section className="container-wide py-20 md:py-24 grid lg:grid-cols-5 gap-12">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-white">Reach us directly</h2>
            <p className="text-sm text-slate-400 mt-2">India HQ + Kuwait via our sister company.</p>
          </div>
          <div className="space-y-5">
            {company.offices.map((o) => (
              <div key={o.city} className="card p-6">
                <div className="flex items-center gap-2 text-white font-semibold">
                  <span style={{ color: "var(--tech)" }}><Icon name="pin" size={18} /></span>
                  {o.city}, {o.country}
                  {o.isHeadquarters && (
                    <span
                      className="ml-1 text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded"
                      style={{ color: "var(--tech)", background: "rgba(6,182,212,0.10)", border: "1px solid rgba(6,182,212,0.25)" }}
                    >HQ</span>
                  )}
                </div>
                <p className="mt-3 text-sm text-slate-400 leading-relaxed">{o.address}</p>
                <div className="mt-4 flex flex-col gap-2 text-sm text-slate-300">
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
                className="card p-6 block group"
              >
                <div className="flex items-center gap-2 text-white font-semibold">
                  <span style={{ color: "var(--violet)" }}><Icon name="partner" size={18} /></span>
                  {company.partner.name}, {company.partner.country}
                  <span
                    className="ml-1 text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded"
                    style={{ color: "var(--violet)", background: "rgba(124,58,237,0.10)", border: "1px solid rgba(124,58,237,0.25)" }}
                  >Sister</span>
                </div>
                <p className="mt-3 text-sm text-slate-400 leading-relaxed">{company.partner.note}</p>
                <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-white group-hover:gap-2.5 transition-all">
                  <span style={{ background: "linear-gradient(90deg, #a78bfa, #67e8f9)", backgroundClip: "text", color: "transparent" }}>
                    Visit {company.partner.name}
                  </span>
                  <Icon name="arrow" size={14} />
                </div>
              </a>
            )}
          </div>
        </div>
        <div className="lg:col-span-3 card p-6 md:p-10">
          <h2 className="text-xl font-semibold text-white">Send us a message</h2>
          <p className="text-sm text-slate-400 mt-2">All fields marked with * are required.</p>
          <div className="mt-6"><ContactForm /></div>
        </div>
      </section>
    </>
  );
}
