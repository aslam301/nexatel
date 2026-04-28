import Link from "next/link";
import { Logo } from "./Logo";
import type { Company } from "@/lib/types";

export function Footer({ company }: { company: Company }) {
  return (
    <footer className="mt-24 bg-[var(--primary-strong)] text-slate-300">
      <div className="container-wide py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-1">
          <Logo variant="light" />
          <p className="mt-4 text-sm leading-relaxed text-slate-400 max-w-xs">
            {company.shortDescription}
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold text-sm tracking-wide uppercase mb-4">Company</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
            <li><Link href="/services" className="hover:text-white transition-colors">Services</Link></li>
            <li><Link href="/projects" className="hover:text-white transition-colors">Projects</Link></li>
            <li><Link href="/products" className="hover:text-white transition-colors">Products</Link></li>
            <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold text-sm tracking-wide uppercase mb-4">Verticals</h4>
          <ul className="space-y-2 text-sm">
            {company.verticals.map((v) => (
              <li key={v} className="text-slate-400">{v}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold text-sm tracking-wide uppercase mb-4">Offices</h4>
          <ul className="space-y-4 text-sm">
            {company.offices.map((o) => (
              <li key={o.city}>
                <div className="text-white font-medium">
                  {o.city}, {o.country}
                  {o.isHeadquarters && (
                    <span className="ml-2 text-[10px] uppercase tracking-wider text-[var(--accent)]">HQ</span>
                  )}
                </div>
                <div className="text-slate-400 text-xs leading-relaxed mt-1">{o.address}</div>
                <div className="text-slate-400 text-xs mt-1">{o.phone}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-wide py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div>© {new Date().getFullYear()} {company.legalName}. All rights reserved.</div>
          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/terms" className="hover:text-white">Terms</Link>
            <Link href="/admin/login" className="hover:text-white">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
