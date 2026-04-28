import Link from "next/link";
import { Icon } from "./Icon";

export function Hero({
  eyebrow,
  title,
  subtitle,
  primaryCta,
  secondaryCta,
}: {
  eyebrow?: string;
  title: string;
  subtitle: string;
  primaryCta?: { href: string; label: string };
  secondaryCta?: { href: string; label: string };
}) {
  return (
    <section className="relative overflow-hidden hero-gradient text-white">
      <div className="absolute inset-0 grid-pattern opacity-60" aria-hidden />
      <div className="container-wide relative py-20 md:py-28">
        <div className="max-w-3xl">
          {eyebrow && (
            <span className="eyebrow text-[var(--accent)]">{eyebrow}</span>
          )}
          <h1 className="mt-3 text-4xl md:text-6xl font-bold leading-[1.05] tracking-tight">
            {title}
          </h1>
          <p className="mt-6 text-lg md:text-xl text-slate-200/90 max-w-2xl leading-relaxed">
            {subtitle}
          </p>
          {(primaryCta || secondaryCta) && (
            <div className="mt-9 flex flex-wrap gap-3">
              {primaryCta && (
                <Link href={primaryCta.href} className="btn-accent">
                  {primaryCta.label}
                  <Icon name="arrow" size={16} />
                </Link>
              )}
              {secondaryCta && (
                <Link
                  href={secondaryCta.href}
                  className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
                >
                  {secondaryCta.label}
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
