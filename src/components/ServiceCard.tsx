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
      className="group relative card p-7 flex flex-col gap-5"
    >
      {/* Hover violet glow */}
      <div
        className="pointer-events-none absolute -top-20 -right-20 h-56 w-56 rounded-full opacity-0 group-hover:opacity-100 blur-3xl transition-opacity"
        aria-hidden
        style={{ background: "radial-gradient(closest-side, rgba(124,58,237,0.35), transparent)" }}
      />
      <div className="icon-tile relative">
        <Icon name={iconName} size={22} />
      </div>
      <div className="relative">
        <h3 className="text-lg font-semibold text-white tracking-tight">{service.title}</h3>
        <p className="text-sm text-slate-400 mt-2 leading-relaxed">{service.summary}</p>
      </div>
      <div className="relative mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-white group-hover:gap-2.5 transition-all">
        <span style={{ background: "linear-gradient(90deg, #a78bfa, #67e8f9)", backgroundClip: "text", color: "transparent" }}>
          Learn more
        </span>
        <Icon name="arrow" size={16} className="text-slate-300 group-hover:text-white" />
      </div>
    </Link>
  );
}
