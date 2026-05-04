"use client";

import { useEffect, useRef, useState } from "react";

interface StatCounterProps {
  value: string;
  label: string;
  durationMs?: number;
}

function parse(value: string): { prefix: string; number: number | null; suffix: string } {
  const match = value.match(/^(\D*)(\d[\d,]*)(.*)$/);
  if (!match) return { prefix: "", number: null, suffix: value };
  const numeric = Number(match[2].replace(/,/g, ""));
  if (Number.isNaN(numeric)) return { prefix: "", number: null, suffix: value };
  return { prefix: match[1] ?? "", number: numeric, suffix: match[3] ?? "" };
}

function formatNumber(n: number, original: string): string {
  // Preserve "500" vs "1,200" formatting style based on original.
  const hasComma = /,/.test(original);
  if (!hasComma) return Math.round(n).toString();
  return Math.round(n).toLocaleString("en-US");
}

export function StatCounter({ value, label, durationMs = 1400 }: StatCounterProps) {
  const { prefix, number, suffix } = parse(value);
  const [displayed, setDisplayed] = useState<number>(number ?? 0);
  const [animated, setAnimated] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (number === null) return;

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setDisplayed(number);
      setAnimated(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !animated) {
            setAnimated(true);
            const start = performance.now();
            const initial = 0;
            const target = number;

            const tick = (now: number) => {
              const t = Math.min(1, (now - start) / durationMs);
              const eased = 1 - Math.pow(1 - t, 3);
              setDisplayed(initial + (target - initial) * eased);
              if (t < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [number, durationMs, animated]);

  const display =
    number === null ? value : `${prefix}${formatNumber(displayed, value)}${suffix}`;

  return (
    <div ref={ref} className="text-center md:text-left">
      <div
        className="text-3xl md:text-5xl font-semibold tracking-tight tabular-nums"
        style={{
          background: "linear-gradient(135deg, #ffffff 0%, #c7d2fe 60%, #a5f3fc 100%)",
          backgroundClip: "text",
          color: "transparent",
        }}
      >
        {display}
      </div>
      <div className="mt-2 text-[11px] md:text-xs uppercase tracking-[0.18em] text-slate-400 font-medium">
        {label}
      </div>
    </div>
  );
}
