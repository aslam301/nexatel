import { Hero } from "@/components/Hero";
import { Icon } from "@/components/Icon";
import { ContactForm } from "@/components/ContactForm";
import { getCompany, getSite } from "@/lib/data";
import { buildMetadata, localBusinessJsonLd } from "@/lib/seo";

export async function generateMetadata() {
  const site = await getSite();
  return buildMetadata({
    title: "Contact",
    description: site.contact.hero.subtitle,
    path: "/contact",
    image: site.contact.hero.image,
  });
}

export default async function ContactPage() {
  const [company, site] = await Promise.all([getCompany(), getSite()]);
  const businesses = localBusinessJsonLd(company);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": businesses }) }}
      />
      <Hero
        eyebrow={site.contact.hero.eyebrow}
        title={site.contact.hero.title}
        subtitle={site.contact.hero.subtitle}
        size="compact"
        showStatus={false}
        backgroundImage={site.contact.hero.image}
      />
      <section className="container-wide py-20 md:py-24 grid lg:grid-cols-5 gap-12">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground-strong">{site.contact.intro.reachHeading}</h2>
            <p className="text-sm text-muted mt-2">{site.contact.intro.reachSubheading}</p>
          </div>
          <div className="space-y-5">
            {company.offices.map((o) => (
              <div key={o.city} className="card p-6">
                <div className="flex items-center gap-2 text-foreground-strong font-semibold">
                  <span style={{ color: "var(--tech)" }}><Icon name="pin" size={18} /></span>
                  {o.city}, {o.country}
                  {o.isHeadquarters && (
                    <span
                      className="ml-1 text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded"
                      style={{ color: "var(--tech)", background: "rgba(6,182,212,0.10)", border: "1px solid rgba(6,182,212,0.25)" }}
                    >HQ</span>
                  )}
                </div>
                <p className="mt-3 text-sm text-muted leading-relaxed">{o.address}</p>
                <div className="mt-4 flex flex-col gap-2 text-sm text-muted">
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
                className="card p-6 block group"
              >
                <div className="flex items-center gap-2 text-foreground-strong font-semibold">
                  <span style={{ color: "var(--violet)" }}><Icon name="partner" size={18} /></span>
                  {company.partner.name}, {company.partner.country}
                  <span
                    className="ml-1 text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded"
                    style={{ color: "var(--violet)", background: "rgba(124,58,237,0.10)", border: "1px solid rgba(124,58,237,0.25)" }}
                  >Sister</span>
                </div>
                <p className="mt-3 text-sm text-muted leading-relaxed">{company.partner.note}</p>
                <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-foreground-strong group-hover:gap-2.5 transition-all">
                  <span style={{ background: "linear-gradient(90deg, var(--violet), var(--tech))", backgroundClip: "text", color: "transparent" }}>
                    Visit {company.partner.name}
                  </span>
                  <Icon name="arrow" size={14} />
                </div>
              </a>
            )}
          </div>
        </div>
        <div className="lg:col-span-3 card p-6 md:p-10">
          <h2 className="text-xl font-semibold text-foreground-strong">{site.contact.intro.formHeading}</h2>
          <p className="text-sm text-muted mt-2">{site.contact.intro.formSubheading}</p>
          <div className="mt-6"><ContactForm /></div>
        </div>
      </section>
    </>
  );
}
