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
      <section className="container-wide py-16 md:py-20 grid lg:grid-cols-5 gap-12">
        <div className="lg:col-span-2 space-y-5">
          <div>
            <span className="eyebrow">Why request through this form</span>
            <h2 className="mt-2 text-2xl font-semibold text-[var(--primary)] tracking-tight">Faster, scoped responses.</h2>
          </div>
          <ul className="space-y-3 text-sm text-slate-700">
            {[
              "Routed directly to the right team lead",
              "Indicative ballpark within one business day",
              "NDA available on request before disclosing site details",
              "No obligation — quotes are free and detailed",
            ].map((p) => (
              <li key={p} className="flex items-start gap-2.5">
                <span className="text-[var(--accent-strong)] mt-0.5"><Icon name="check" size={18} /></span>
                {p}
              </li>
            ))}
          </ul>

          {sp?.capability && (
            <div className="rounded-lg border border-cyan-100 bg-cyan-50 p-4">
              <div className="text-xs font-mono uppercase tracking-[0.16em] text-cyan-700">Pre-filled</div>
              <div className="text-sm text-slate-800 mt-1">
                Capability of interest: <span className="font-semibold">{sp.capability.replace(/-/g, " ")}</span>
              </div>
            </div>
          )}

          <div className="mt-6 card p-5">
            <div className="text-xs font-semibold tracking-wider uppercase text-slate-500">Prefer a call?</div>
            <a href={`tel:${company.supportPhone}`} className="mt-2 inline-flex items-center gap-2 text-[var(--primary)] font-semibold">
              <Icon name="phone" size={16} /> {company.supportPhone}
            </a>
            <a href={`mailto:${company.supportEmail}`} className="mt-2 inline-flex items-center gap-2 text-[var(--primary)] font-semibold">
              <Icon name="mail" size={16} /> {company.supportEmail}
            </a>
          </div>
        </div>

        <div className="lg:col-span-3 card p-6 md:p-8">
          <GetQuoteForm defaultServiceArea={sp?.service} />
        </div>
      </section>
    </>
  );
}
