import type { Company } from "@/lib/types";

export function MissionVisionValues({ company }: { company: Company }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <article className="card p-7 md:p-8 flex flex-col gap-3">
        <span className="eyebrow">Our mission</span>
        <p className="text-[15px] md:text-base text-foreground leading-relaxed">
          {company.mission}
        </p>
      </article>

      <article className="card p-7 md:p-8 flex flex-col gap-3">
        <span className="eyebrow">Our vision</span>
        <p className="text-[15px] md:text-base text-foreground leading-relaxed">
          {company.vision}
        </p>
      </article>

      <article className="card p-7 md:p-8 flex flex-col gap-3 lg:col-span-1 md:col-span-2">
        <span className="eyebrow">Our values</span>
        <ul className="grid grid-cols-2 gap-x-4 gap-y-3 mt-1">
          {company.values.map((v) => (
            <li key={v.title}>
              <div className="text-sm font-semibold text-foreground-strong">{v.title}</div>
              <div className="text-xs text-muted leading-snug mt-1">{v.description}</div>
            </li>
          ))}
        </ul>
      </article>
    </div>
  );
}
