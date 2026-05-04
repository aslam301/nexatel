import Link from "next/link";
import { Icon } from "./Icon";
import type { Service } from "@/lib/types";

const ICON_MAP: Record<string, "cpu" | "fiber" | "tower" | "bolt" | "box" | "cabling" | "cctv"> = {
  cpu: "cpu",
  fiber: "fiber",
  tower: "tower",
  bolt: "bolt",
  box: "box",
  cabling: "cabling",
  cctv: "cctv",
};

export function ServiceCard({ service }: { service: Service }) {
  const iconName = ICON_MAP[service.icon] ?? "cpu";
  return (
    <Link
      href={`/services/${service.slug}`}
      className="group relative card p-6 flex flex-col gap-5 overflow-hidden"
    >
      {/* Subtle hover glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
        aria-hidden
        style={{
          background:
            "radial-gradient(400px 200px at 100% 0%, rgba(6,182,212,0.08), transparent 60%)",
        }}
      />
      <div
        className="relative inline-flex h-12 w-12 items-center justify-center rounded-xl ring-1 ring-[var(--border)]"
        style={{ background: "linear-gradient(135deg, rgba(245,158,11,0.12), rgba(6,182,212,0.10))", color: "var(--primary)" }}
      >
        <Icon name={iconName} size={22} />
      </div>
      <div className="relative">
        <h3 className="text-lg font-semibold text-[var(--primary)] tracking-tight">{service.title}</h3>
        <p className="text-sm text-slate-600 mt-2 leading-relaxed">{service.summary}</p>
      </div>
      <div className="relative mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--primary)] group-hover:gap-2.5 transition-all">
        Learn more
        <Icon name="arrow" size={16} />
      </div>
    </Link>
  );
}
