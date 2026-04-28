import Image from "next/image";
import Link from "next/link";
import { Icon } from "./Icon";

export interface HeroProps {
  eyebrow?: string;
  title: string;
  subtitle: string;
  primaryCta?: { href: string; label: string };
  secondaryCta?: { href: string; label: string };
  /** Optional background image URL. The hero gradient acts as the placeholder while it loads. */
  backgroundImage?: string;
  /** Show the small live-status pill (default true). */
  showStatus?: boolean;
  /** Vertical padding scale: full hero on landing pages, compact on inner pages. */
  size?: "default" | "compact";
}

export function Hero({
  eyebrow,
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  backgroundImage,
  showStatus = true,
  size = "default",
}: HeroProps) {
  const padding = size === "compact" ? "py-16 md:py-20" : "py-24 md:py-32";
  return (
    <section className="relative overflow-hidden text-white isolate">
      {/* Layer 0 — solid base + gradient placeholder, shown instantly */}
      <div className="absolute inset-0 hero-gradient" aria-hidden />

      {/* Layer 1 — background image fades in over the gradient */}
      {backgroundImage && (
        <Image
          src={backgroundImage}
          alt=""
          aria-hidden
          fill
          sizes="100vw"
          priority
          quality={75}
          className="absolute inset-0 object-cover"
        />
      )}

      {/* Layer 2 — directional gradient overlay: darker on the left/bottom (where copy lives),
         lighter on the right (so the image clearly shows through). */}
      <div
        className="absolute inset-0"
        aria-hidden
        style={{
          background:
            "linear-gradient(105deg, rgba(6,26,46,0.92) 0%, rgba(6,26,46,0.75) 35%, rgba(6,26,46,0.45) 65%, rgba(6,26,46,0.30) 100%)",
        }}
      />
      {/* Subtle bottom fade so the next section doesn't fight the image */}
      <div
        className="absolute inset-x-0 bottom-0 h-24"
        aria-hidden
        style={{ background: "linear-gradient(180deg, transparent, rgba(6,26,46,0.65))" }}
      />

      {/* Layer 3 — grid pattern, very subtle */}
      <div className="absolute inset-0 grid-pattern opacity-40" aria-hidden />

      {/* Layer 4 — animated scan line */}
      <div className="hero-scan" aria-hidden />

      {/* Layer 5 — corner brackets for tech feel */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <span className="hero-bracket hero-bracket--tl" />
        <span className="hero-bracket hero-bracket--tr" />
        <span className="hero-bracket hero-bracket--bl" />
        <span className="hero-bracket hero-bracket--br" />
      </div>

      <div className={`container-wide relative ${padding}`}>
        <div className="max-w-3xl">
          {showStatus && (
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 backdrop-blur-sm">
              <span className="relative inline-flex h-2 w-2">
                <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
                <span className="relative inline-block h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <span className="font-mono text-[11px] tracking-widest uppercase text-slate-200/80">
                Online · KW · IN
              </span>
            </div>
          )}

          {eyebrow && (
            <div className={showStatus ? "mt-8" : ""}>
              <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-[var(--accent)]">
                {eyebrow}
              </span>
            </div>
          )}

          <h1 className={`text-[2.5rem] sm:text-5xl md:text-[4.25rem] font-semibold leading-[1.05] tracking-[-0.03em] ${
            eyebrow ? "mt-3" : showStatus ? "mt-8" : "mt-0"
          }`}>
            {title}
          </h1>

          <p className="mt-6 max-w-2xl text-base md:text-lg text-slate-300/90 leading-relaxed">
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
                  className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
                >
                  {secondaryCta.label}
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Layer 6 — bottom hairline */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" aria-hidden />
    </section>
  );
}
