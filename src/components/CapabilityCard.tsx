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
      className="group relative card flex flex-col gap-4 p-7"
    >
      {/* Cyan corner glow on hover */}
      <div
        className="pointer-events-none absolute -top-20 -right-20 h-56 w-56 rounded-full opacity-0 group-hover:opacity-100 blur-3xl transition-opacity"
        aria-hidden
        style={{ background: "radial-gradient(closest-side, rgba(6,182,212,0.35), transparent)" }}
      />

      <div className="relative flex items-center justify-between">
        <span className="icon-tile">
          <Icon name={iconName} size={22} />
        </span>
        <span className="badge">Capability</span>
      </div>

      <div className="relative">
        <h3 className="text-base md:text-lg font-semibold text-white tracking-tight">
          {capability.title}
        </h3>
        {variant !== "compact" && (
          <p className="text-sm text-slate-400 mt-2 leading-relaxed">
            {capability.summary}
          </p>
        )}
      </div>

      <div className="relative mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-white group-hover:gap-2.5 transition-all">
        <span style={{ background: "linear-gradient(90deg, #67e8f9, #a78bfa)", backgroundClip: "text", color: "transparent" }}>
          View process
        </span>
        <Icon name="arrow" size={16} className="text-slate-300 group-hover:text-white" />
      </div>
    </Link>
  );
}
