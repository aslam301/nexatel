import { Icon } from "./Icon";
import type { PartnerCompany } from "@/lib/types";

export function PartnerStrip({ partner }: { partner: PartnerCompany }) {
  return (
    <section className="container-wide">
      <div
        className="relative overflow-hidden rounded-2xl border border-[var(--border)]"
        style={{
          background:
            "linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(19,29,54,0.95) 100%)",
        }}
      >
        <div
          className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full opacity-50 blur-3xl"
          aria-hidden
          style={{ background: "radial-gradient(closest-side, rgba(124,58,237,0.40), transparent)" }}
        />
        <div
          className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full opacity-40 blur-3xl"
          aria-hidden
          style={{ background: "radial-gradient(closest-side, rgba(6,182,212,0.30), transparent)" }}
        />
        <div className="relative grid lg:grid-cols-[1fr_auto] gap-8 items-center p-8 md:p-12">
          <div>
            <div className="badge">
              <span className="text-slate-300"><Icon name="partner" size={12} /></span>
              <span>Sister company · {partner.country}</span>
            </div>
            <h2 className="section-title mt-4">
              Operating in Kuwait? Meet our partner, <span style={{ background: "linear-gradient(90deg, #a78bfa, #67e8f9)", backgroundClip: "text", color: "transparent" }}>{partner.name}</span>.
            </h2>
            {partner.note && (
              <p className="lead mt-4">{partner.note}</p>
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
