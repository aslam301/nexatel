import { Icon, type IconName } from "./Icon";
import type { FocusArea } from "@/lib/types";

const ICON_FALLBACK: Record<string, IconName> = {
  building: "box",
  fiber: "fiber",
  bolt: "bolt",
  tower: "tower",
  cabling: "cabling",
};

export function AreasOfFocus({ areas }: { areas: FocusArea[] }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {areas.map((a) => {
        const icon = (a.icon ? ICON_FALLBACK[a.icon] : undefined) ?? "box";
        return (
          <article key={a.title} className="card p-7 flex flex-col gap-4">
            <span className="icon-tile">
              <Icon name={icon} size={20} />
            </span>
            <div>
              <h3 className="text-base md:text-lg font-semibold text-foreground-strong tracking-tight">
                {a.title}
              </h3>
              <p className="text-sm text-muted mt-2 leading-relaxed">{a.description}</p>
            </div>
          </article>
        );
      })}
    </div>
  );
}
