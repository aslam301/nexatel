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
    <section className="relative overflow-hidden text-white isolate">
      {/* Layer 0 — solid base + gradient placeholder, shown instantly */}
      <div className="absolute inset-0 hero-gradient" aria-hidden />

      {/* Layer 1 — background image fades in over the gradient (heavily darkened) */}
      {backgroundImage && (
        <Image
          src={backgroundImage}
          alt=""
          aria-hidden
          fill
          sizes="100vw"
          priority
          quality={75}
          className="absolute inset-0 object-cover opacity-30 mix-blend-luminosity"
        />
      )}

      {/* Layer 2 — directional gradient overlay */}
      <div
        className="absolute inset-0"
        aria-hidden
        style={{
          background:
            "linear-gradient(105deg, rgba(5,8,22,0.95) 0%, rgba(5,8,22,0.78) 35%, rgba(5,8,22,0.55) 65%, rgba(5,8,22,0.40) 100%)",
        }}
      />

      {/* Layer 3 — grid pattern */}
      <div className="absolute inset-0 grid-pattern opacity-30" aria-hidden />

      {/* Layer 3b — violet glow top-right */}
      <div
        className="pointer-events-none absolute -top-32 right-[-15%] h-[520px] w-[520px] rounded-full opacity-60 blur-3xl"
        aria-hidden
        style={{ background: "radial-gradient(closest-side, rgba(124,58,237,0.55), transparent)" }}
      />
      {/* Layer 3c — cyan glow bottom-left */}
      <div
        className="pointer-events-none absolute -bottom-40 left-[-10%] h-[460px] w-[460px] rounded-full opacity-40 blur-3xl"
        aria-hidden
        style={{ background: "radial-gradient(closest-side, rgba(6,182,212,0.40), transparent)" }}
      />

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
              <span className="text-slate-200/85">{statusText}</span>
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

          <p className="mt-7 max-w-2xl text-base md:text-lg text-slate-300/90 leading-relaxed">
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
            "linear-gradient(90deg, transparent, rgba(124,58,237,0.4), rgba(6,182,212,0.4), transparent)",
        }}
      />
    </section>
  );
}
