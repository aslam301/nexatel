import Link from "next/link";
import { Icon } from "./Icon";
import type { Service } from "@/lib/types";

const ICON_MAP: Record<string, "cpu" | "fiber" | "tower" | "bolt" | "box"> = {
  cpu: "cpu",
  fiber: "fiber",
  tower: "tower",
  bolt: "bolt",
  box: "box",
};

export function ServiceCard({ service }: { service: Service }) {
  const iconName = ICON_MAP[service.icon] ?? "cpu";
  return (
    <Link href={`/services/${service.slug}`} className="card p-6 flex flex-col gap-4 group">
      <div
        className="inline-flex h-11 w-11 items-center justify-center rounded-lg"
        style={{ background: "rgba(245, 158, 11, 0.12)", color: "var(--accent-strong)" }}
      >
        <Icon name={iconName} size={22} />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-[var(--primary)]">{service.title}</h3>
        <p className="text-sm text-slate-600 mt-2 leading-relaxed">{service.summary}</p>
      </div>
      <div className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--primary)] group-hover:gap-2.5 transition-all">
        Learn more
        <Icon name="arrow" size={16} />
      </div>
    </Link>
  );
}
