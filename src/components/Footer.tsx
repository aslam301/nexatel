import Link from "next/link";
import { Logo } from "./Logo";
import type { Company } from "@/lib/types";

export function Footer({ company }: { company: Company }) {
  return (
    <footer className="relative mt-32">
      {/* Top gradient hairline */}
      <div
        className="absolute top-0 inset-x-0 h-px"
        aria-hidden
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(124,58,237,0.5), rgba(6,182,212,0.5), transparent)",
        }}
      />
      {/* Background glow */}
      <div className="absolute inset-0 -z-10" aria-hidden>
        <div
          className="absolute -top-40 left-1/2 -translate-x-1/2 h-[400px] w-[800px] rounded-full opacity-30 blur-3xl"
          style={{ background: "radial-gradient(closest-side, rgba(124,58,237,0.45), transparent)" }}
        />
      </div>
      <div className="bg-[var(--background-2)] border-t border-[var(--border)]">
        <div className="container-wide py-16 grid gap-12 md:grid-cols-4">
          <div className="md:col-span-1">
            <Logo />
            <p className="mt-5 text-sm leading-relaxed text-slate-400 max-w-xs">
              {company.shortDescription}
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm tracking-wide uppercase mb-5">Company</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/about" className="text-slate-400 hover:text-white transition-colors">About</Link></li>
              <li><Link href="/services" className="text-slate-400 hover:text-white transition-colors">Services</Link></li>
              <li><Link href="/projects" className="text-slate-400 hover:text-white transition-colors">Projects</Link></li>
              <li><Link href="/products" className="text-slate-400 hover:text-white transition-colors">Products</Link></li>
              <li><Link href="/contact" className="text-slate-400 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm tracking-wide uppercase mb-5">Verticals</h4>
            <ul className="space-y-3 text-sm">
              {company.verticals.map((v) => (
                <li key={v} className="text-slate-400">{v}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm tracking-wide uppercase mb-5">Office</h4>
            <ul className="space-y-5 text-sm">
              {company.offices.map((o) => (
                <li key={o.city}>
                  <div className="text-white font-medium">
                    {o.city}, {o.country}
                    {o.isHeadquarters && (
                      <span
                        className="ml-2 text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded"
                        style={{ color: "var(--tech)", background: "rgba(6,182,212,0.10)", border: "1px solid rgba(6,182,212,0.25)" }}
                      >HQ</span>
                    )}
                  </div>
                  <div className="text-slate-400 text-xs leading-relaxed mt-1.5">{o.address}</div>
                  <div className="text-slate-400 text-xs mt-1">{o.phone}</div>
                </li>
              ))}
              {company.partner && (
                <li>
                  <div className="text-white font-medium">
                    {company.partner.name}, {company.partner.country}
                    <span
                      className="ml-2 text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded"
                      style={{ color: "var(--violet)", background: "rgba(124,58,237,0.10)", border: "1px solid rgba(124,58,237,0.25)" }}
                    >Sister</span>
                  </div>
                  <a href={company.partner.url} target="_blank" rel="noopener noreferrer" className="text-slate-400 text-xs mt-1 hover:text-white transition-colors block">
                    {company.partner.url.replace(/^https?:\/\//, "")}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
        <div className="border-t border-[var(--border)]">
          <div className="container-wide py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <div>© {new Date().getFullYear()} {company.legalName}. All rights reserved.</div>
            <div className="flex gap-6">
              <Link href="/admin/login" className="hover:text-white transition-colors">Admin</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
