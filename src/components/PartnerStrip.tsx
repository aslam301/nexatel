import { Icon } from "./Icon";
import type { PartnerCompany } from "@/lib/types";

export function PartnerStrip({ partner }: { partner: PartnerCompany }) {
  return (
    <section className="container-wide">
      <div className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-gradient-to-br from-white to-[var(--surface)]">
        <div
          className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full opacity-60 blur-3xl"
          aria-hidden
          style={{ background: "radial-gradient(closest-side, rgba(6,182,212,0.18), transparent)" }}
        />
        <div className="relative grid lg:grid-cols-[1fr_auto] gap-8 items-center p-8 md:p-10">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white/80 px-3 py-1">
              <span className="text-[var(--primary)]"><Icon name="partner" size={14} /></span>
              <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-slate-500">
                Sister company · {partner.country}
              </span>
            </div>
            <h2 className="section-title mt-3">
              Operating in Kuwait? Meet our partner, {partner.name}.
            </h2>
            {partner.note && (
              <p className="lead mt-3">{partner.note}</p>
            )}
          </div>
          <a
            href={partner.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary self-start lg:self-center"
          >
            Visit {partner.name} <Icon name="arrow" size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}
