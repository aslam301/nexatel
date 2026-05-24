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
  /** Status pill text (override default). */
  statusText?: string;
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
  statusText = "Live · Kerala, IN",
}: HeroProps) {
  const padding = size === "compact" ? "py-20 md:py-24" : "py-28 md:py-36";
  return (
    <section className="relative overflow-hidden text-foreground-strong isolate">
      {/* Layer 0 — soft gradient on white */}
      <div className="absolute inset-0 hero-gradient" aria-hidden />

      {/* Layer 1 — optional background image, lightly faded so it doesn't dominate */}
      {backgroundImage && (
        <Image
          src={backgroundImage}
          alt=""
          aria-hidden
          fill
          sizes="100vw"
          priority
          quality={75}
          className="absolute inset-0 object-cover opacity-10"
        />
      )}

      {/* Layer 3 — grid pattern (subtle) */}
      <div className="absolute inset-0 grid-pattern opacity-40" aria-hidden />

      {/* Layer 4 — animated scan line */}
      <div className="hero-scan" aria-hidden />

      {/* Layer 5 — corner brackets */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <span className="hero-bracket hero-bracket--tl" />
        <span className="hero-bracket hero-bracket--tr" />
        <span className="hero-bracket hero-bracket--bl" />
        <span className="hero-bracket hero-bracket--br" />
      </div>

      <div className={`container-wide relative ${padding}`}>
        <div className="max-w-4xl">
          {showStatus && (
            <div className="badge">
              <span className="relative inline-flex h-2 w-2">
                <span className="absolute inset-0 rounded-full bg-cyan-400 animate-ping opacity-75" />
                <span className="relative inline-block h-2 w-2 rounded-full bg-cyan-400" />
              </span>
              <span className="text-muted">{statusText}</span>
            </div>
          )}

          {eyebrow && (
            <div className={showStatus ? "mt-8" : ""}>
              <span className="eyebrow">{eyebrow}</span>
            </div>
          )}

          <h1
            className={`font-semibold leading-[1.04] tracking-[-0.035em] text-[2.6rem] sm:text-5xl md:text-[5rem] xl:text-[5.5rem] ${
              eyebrow ? "mt-3" : showStatus ? "mt-7" : "mt-0"
            }`}
          >
            {title}
          </h1>

          <p className="mt-7 max-w-2xl text-base md:text-lg text-muted leading-relaxed">
            {subtitle}
          </p>

          {(primaryCta || secondaryCta) && (
            <div className="mt-9 flex flex-wrap gap-3">
              {primaryCta && (
                <Link href={primaryCta.href} className="btn-primary">
                  {primaryCta.label}
                  <Icon name="arrow" size={16} />
                </Link>
              )}
              {secondaryCta && (
                <Link href={secondaryCta.href} className="btn-outline">
                  {secondaryCta.label}
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Layer 6 — bottom hairline */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        aria-hidden
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(124,58,237,0.25), rgba(6,182,212,0.25), transparent)",
        }}
      />
    </section>
  );
}
