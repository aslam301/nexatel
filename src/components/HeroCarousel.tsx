"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Icon } from "./Icon";
import type { HeroSlide } from "@/lib/types";

interface Props {
  slides: HeroSlide[];
  intervalMs?: number;
}

export function HeroCarousel({ slides, intervalMs = 6000 }: Props) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (slides.length <= 1 || paused) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, intervalMs);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [slides.length, paused, intervalMs]);

  const goTo = (i: number) => setIndex(i % slides.length);
  const active = slides[index] ?? slides[0];

  if (!active) return null;

  return (
    <section
      className="relative overflow-hidden text-white isolate min-h-[640px] md:min-h-[720px] flex"
      aria-roledescription="carousel"
      aria-label="Nexatel services"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((s, i) => (
        <div
          key={s.image + i}
          className={`absolute inset-0 transition-opacity duration-[900ms] ease-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden={i !== index}
        >
          <Image
            src={s.image}
            alt=""
            fill
            sizes="100vw"
            priority={i === 0}
            quality={75}
            className="object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(105deg, rgba(5,8,22,0.78) 0%, rgba(5,8,22,0.55) 45%, rgba(5,8,22,0.35) 100%)",
            }}
          />
        </div>
      ))}

      <div className="absolute inset-0 grid-pattern opacity-15" aria-hidden />

      <div className="container-wide relative py-28 md:py-36 flex flex-col justify-center w-full">
        <div className="max-w-3xl">
          {slides.map((s, i) => (
            <div
              key={s.title + i}
              className={`transition-all duration-[700ms] ease-out ${
                i === index ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none absolute"
              }`}
              aria-hidden={i !== index}
            >
              {s.eyebrow && <span className="eyebrow text-cyan-300">{s.eyebrow}</span>}
              <h1
                className={`font-semibold leading-[1.06] tracking-[-0.03em] text-[2.4rem] sm:text-5xl md:text-[4.25rem] xl:text-[4.75rem] ${
                  s.eyebrow ? "mt-4" : "mt-0"
                }`}
              >
                {s.title}
              </h1>
              <p className="mt-6 max-w-2xl text-base md:text-lg text-slate-200/90 leading-relaxed">
                {s.subtitle}
              </p>
              {(s.primaryCta || s.secondaryCta) && (
                <div className="mt-9 flex flex-wrap gap-3">
                  {s.primaryCta && (
                    <Link href={s.primaryCta.href} className="btn-primary">
                      {s.primaryCta.label}
                      <Icon name="arrow" size={16} />
                    </Link>
                  )}
                  {s.secondaryCta && (
                    <Link
                      href={s.secondaryCta.href}
                      className="inline-flex items-center gap-2 rounded-[0.625rem] border border-white/30 px-5 py-[0.65rem] text-sm font-semibold text-white hover:bg-white/10 transition-colors"
                    >
                      {s.secondaryCta.label}
                    </Link>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {slides.length > 1 && (
          <div className="relative mt-12 flex items-center gap-3" role="tablist" aria-label="Carousel slides">
            {slides.map((s, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === index}
                aria-label={`Slide ${i + 1}: ${s.title}`}
                onClick={() => goTo(i)}
                className="group h-1 flex-1 max-w-[100px] rounded-full overflow-hidden bg-white/20 hover:bg-white/30 transition-colors"
              >
                <span
                  className={`block h-full rounded-full transition-all duration-300 ${
                    i === index
                      ? "w-full"
                      : "w-0"
                  }`}
                  style={{
                    background: "linear-gradient(90deg, var(--violet), var(--tech))",
                  }}
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
