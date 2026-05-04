"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface ProductGalleryProps {
  images: string[];
  alt: string;
  /** Auto-advance interval in ms when there are multiple images. 0 disables. */
  intervalMs?: number;
}

/**
 * Single-image: renders a static framed image with corner brackets.
 * Multiple images: auto-slides every `intervalMs` and exposes navigation dots.
 * Pauses the timer on hover or when the user picks a dot manually.
 */
export function ProductGallery({ images, alt, intervalMs = 4500 }: ProductGalleryProps) {
  const list = images.filter(Boolean);
  const multi = list.length > 1;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!multi) return;
    if (paused) return;
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % list.length);
    }, intervalMs);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [multi, paused, intervalMs, list.length]);

  if (list.length === 0) {
    return (
      <div
        className="relative aspect-[4/3] rounded-2xl overflow-hidden ring-1 ring-[var(--border-strong)] flex items-center justify-center text-sm text-slate-500"
        style={{ background: "linear-gradient(180deg, #1a2440 0%, #131D36 100%)" }}
      >
        No image
      </div>
    );
  }

  return (
    <div
      className="relative aspect-[4/3] rounded-2xl overflow-hidden ring-1 ring-[var(--border-strong)]"
      style={{ background: "linear-gradient(180deg, #1a2440 0%, #131D36 100%)" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {list.map((src, i) => (
        <Image
          key={src + i}
          src={src}
          alt={i === 0 ? alt : `${alt} ${i + 1}`}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          priority={i === 0}
          className={`object-cover transition-opacity duration-700 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <div
        className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-30"
        aria-hidden
        style={{ background: "linear-gradient(135deg, rgba(59,130,246,0.18), rgba(124,58,237,0.10))" }}
      />
      <span className="hero-bracket hero-bracket--tl" />
      <span className="hero-bracket hero-bracket--tr" />
      <span className="hero-bracket hero-bracket--bl" />
      <span className="hero-bracket hero-bracket--br" />

      {multi && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full px-3 py-2 backdrop-blur-md" style={{ background: "rgba(5,8,22,0.55)", border: "1px solid var(--border-strong)" }}>
          {list.map((_, i) => {
            const active = i === index;
            return (
              <button
                key={i}
                type="button"
                aria-label={`Show image ${i + 1} of ${list.length}`}
                onClick={() => {
                  setIndex(i);
                  setPaused(true);
                }}
                className="rounded-full transition-all"
                style={{
                  width: active ? 24 : 8,
                  height: 8,
                  background: active
                    ? "linear-gradient(90deg, #a78bfa, #67e8f9)"
                    : "rgba(255,255,255,0.30)",
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
