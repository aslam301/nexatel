"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/products", label: "Products" },
  { href: "/projects", label: "Projects" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Admin pages have their own AdminShell chrome — don't double-stack site nav.
  if (pathname?.startsWith("/admin")) return null;

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname?.startsWith(href);
  };

  return (
    <header
      className="sticky top-0 z-40 transition-all"
      style={{
        background: scrolled ? "rgba(255, 255, 255, 0.85)" : "rgba(255, 255, 255, 0.55)",
        backdropFilter: "saturate(180%) blur(14px)",
        WebkitBackdropFilter: "saturate(180%) blur(14px)",
        borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
      }}
    >
      <div className="container-wide flex h-16 items-center justify-between">
        <Link href="/" className="shrink-0" aria-label="Nexatel home">
          <Logo />
        </Link>
        <nav className="hidden lg:flex items-center gap-1" aria-label="Primary">
          {NAV.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-3 py-2 text-sm font-medium transition-colors ${
                  active ? "text-foreground-strong" : "text-muted hover:text-foreground-strong"
                }`}
              >
                {item.label}
                {active && (
                  <span
                    className="pointer-events-none absolute left-3 right-3 -bottom-px h-px"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, rgba(124,58,237,0.85), rgba(6,182,212,0.85), transparent)",
                    }}
                    aria-hidden
                  />
                )}
              </Link>
            );
          })}
        </nav>
        <div className="hidden lg:flex items-center gap-3">
          <Link href="/contact" className="btn-primary text-sm">Contact Us</Link>
        </div>
        <button
          className="lg:hidden inline-flex items-center justify-center rounded-md p-2 border border-[var(--border-strong)] text-foreground hover:bg-foreground/5"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? (
              <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>
      {open && (
        <div
          className="lg:hidden border-t border-[var(--border)]"
          style={{ background: "rgba(255, 255, 255, 0.96)", backdropFilter: "blur(14px)" }}
        >
          <div className="container-wide py-4 flex flex-col gap-1">
            {NAV.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2.5 rounded-md font-medium ${
                    active ? "text-foreground-strong bg-foreground/5" : "text-muted"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link href="/contact" className="btn-primary mt-3 w-fit" onClick={() => setOpen(false)}>
              Contact Us
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
