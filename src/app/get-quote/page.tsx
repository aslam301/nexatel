import { Hero } from "@/components/Hero";
import { GetQuoteForm } from "@/components/GetQuoteForm";
import { Icon } from "@/components/Icon";
import { getCompany } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Get a quote",
  description:
    "Request a project quote from Nexatel Private Limited — fiber optic, telecom infrastructure, network cabling, CCTV and IT hardware projects across India.",
  path: "/get-quote",
  image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&h=630&fit=crop&q=70&auto=format",
  keywords: ["request quote", "Nexatel quotation", "fiber optic project India", "FTTH quote Kerala"],
});

interface SearchParams {
  service?: string;
  capability?: string;
}

export default async function GetQuotePage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;
  const company = await getCompany();
  return (
    <>
      <Hero
        eyebrow="Get a quote"
        title="Tell us about your project."
        subtitle="A few quick details so we can route your request to the right team and reply with a scoped proposal."
        size="compact"
        showStatus={false}
        backgroundImage="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=2000&q=70&auto=format&fit=crop"
      />
      <section className="container-wide py-20 md:py-24 grid lg:grid-cols-5 gap-12">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <span className="eyebrow">Why request through this form</span>
            <h2 className="mt-3 text-2xl font-semibold text-white tracking-tight">Faster, scoped responses.</h2>
          </div>
          <ul className="space-y-3.5 text-sm text-slate-300">
            {[
              "Routed directly to the right team lead",
              "Indicative ballpark within one business day",
              "NDA available on request before disclosing site details",
              "No obligation — quotes are free and detailed",
            ].map((p) => (
              <li key={p} className="flex items-start gap-2.5">
                <span className="mt-0.5" style={{ color: "var(--tech)" }}><Icon name="check" size={18} /></span>
                {p}
              </li>
            ))}
          </ul>

          {sp?.capability && (
            <div
              className="rounded-lg p-4"
              style={{
                background: "rgba(6,182,212,0.06)",
                border: "1px solid rgba(6,182,212,0.25)",
              }}
            >
              <div className="text-xs font-mono uppercase tracking-[0.18em]" style={{ color: "var(--tech)" }}>Pre-filled</div>
              <div className="text-sm text-slate-200 mt-1.5">
                Capability of interest: <span className="font-semibold">{sp.capability.replace(/-/g, " ")}</span>
              </div>
            </div>
          )}

          <div className="card p-6">
            <div className="text-xs font-semibold tracking-[0.18em] uppercase text-slate-400">Prefer a call?</div>
            <a href={`tel:${company.supportPhone}`} className="mt-3 flex items-center gap-2 text-white font-semibold hover:text-cyan-300 transition-colors">
              <Icon name="phone" size={16} /> {company.supportPhone}
            </a>
            <a href={`mailto:${company.supportEmail}`} className="mt-2 flex items-center gap-2 text-white font-semibold hover:text-cyan-300 transition-colors">
              <Icon name="mail" size={16} /> {company.supportEmail}
            </a>
          </div>
        </div>

        <div className="lg:col-span-3 card p-6 md:p-10">
          <GetQuoteForm defaultServiceArea={sp?.service} />
        </div>
      </section>
    </>
  );
}
