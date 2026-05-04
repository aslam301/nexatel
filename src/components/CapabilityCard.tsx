import Link from "next/link";
import { Icon } from "./Icon";
import type { Capability } from "@/lib/types";

const CAPABILITY_ICONS: Record<string, "drill" | "trench" | "manhole" | "gauge" | "wind" | "splice" | "fiber"> = {
  drill: "drill",
  trench: "trench",
  manhole: "manhole",
  gauge: "gauge",
  wind: "wind",
  splice: "splice",
  fiber: "fiber",
};

export function CapabilityCard({
  capability,
  variant = "default",
}: {
  capability: Capability;
  variant?: "default" | "compact" | "wide";
}) {
  const iconName = CAPABILITY_ICONS[capability.icon] ?? "fiber";

  return (
    <Link
      href={`/capabilities/${capability.slug}`}
      className="group relative flex flex-col gap-4 rounded-2xl border border-[var(--border)] bg-white p-6 overflow-hidden transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_18px_40px_-22px_rgba(10,37,64,0.25)]"
    >
      {/* Cyan corner glow on hover */}
      <div
        className="pointer-events-none absolute -top-12 -right-12 h-40 w-40 rounded-full opacity-0 group-hover:opacity-100 blur-2xl transition-opacity"
        aria-hidden
        style={{ background: "radial-gradient(closest-side, rgba(6,182,212,0.35), transparent)" }}
      />

      <div className="relative flex items-center justify-between">
        <span
          className="inline-flex h-11 w-11 items-center justify-center rounded-lg ring-1 ring-[var(--border)] text-[var(--primary)]"
          style={{ background: "linear-gradient(135deg, rgba(6,182,212,0.10), rgba(245,158,11,0.10))" }}
        >
          <Icon name={iconName} size={22} />
        </span>
        <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-slate-400">
          Capability
        </span>
      </div>

      <div className="relative">
        <h3 className="text-base md:text-lg font-semibold text-[var(--primary)] tracking-tight">
          {capability.title}
        </h3>
        {variant !== "compact" && (
          <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
            {capability.summary}
          </p>
        )}
      </div>

      <div className="relative mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--primary)] group-hover:gap-2.5 transition-all">
        View process
        <Icon name="arrow" size={16} />
      </div>
    </Link>
  );
}
