import { Hero } from "@/components/Hero";
import { Icon } from "@/components/Icon";
import { ContactForm } from "@/components/ContactForm";
import { getCompany } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Contact",
  description:
    "Talk to Nexatel about IT services, fiber optics, telecom infrastructure, structured cabling and solar installations across Kuwait and Kerala.",
  path: "/contact",
});

export default async function ContactPage() {
  const company = await getCompany();
  return (
    <>
      <Hero
        eyebrow="Contact"
        title="Let's scope your next deployment."
        subtitle="Tell us about your project — we usually reply within one business day."
        size="compact"
        showStatus={false}
        backgroundImage="https://images.unsplash.com/photo-1497366216548-37526070297c?w=2000&q=70&auto=format&fit=crop"
      />
      <section className="container-wide py-16 grid lg:grid-cols-5 gap-12">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-semibold text-[var(--primary)]">Reach us directly</h2>
          <div className="space-y-5">
            {company.offices.map((o) => (
              <div key={o.city} className="card p-5">
                <div className="flex items-center gap-2 text-[var(--primary)] font-semibold">
                  <Icon name="pin" size={18} />
                  {o.city}, {o.country}
                  {o.isHeadquarters && (
                    <span className="ml-1 text-[10px] uppercase tracking-wider text-[var(--accent-strong)]">HQ</span>
                  )}
                </div>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{o.address}</p>
                <div className="mt-3 flex flex-col gap-1.5 text-sm text-slate-700">
                  <span className="inline-flex items-center gap-2"><Icon name="phone" size={16} /> {o.phone}</span>
                  <a href={`mailto:${o.email}`} className="inline-flex items-center gap-2 hover:text-[var(--primary)]"><Icon name="mail" size={16} /> {o.email}</a>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="lg:col-span-3 card p-6 md:p-8">
          <h2 className="text-xl font-semibold text-[var(--primary)]">Send us a message</h2>
          <p className="text-sm text-slate-600 mt-1.5">All fields marked with * are required.</p>
          <div className="mt-6"><ContactForm /></div>
        </div>
      </section>
    </>
  );
}
