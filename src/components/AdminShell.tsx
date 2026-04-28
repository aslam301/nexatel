"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Logo } from "./Logo";

const NAV: { href: string; label: string; icon: React.ReactNode; matchPrefix?: string }[] = [
  { href: "/admin/dashboard", label: "Dashboard", icon: <DashboardIcon /> },
  { href: "/admin/products", label: "Products", icon: <BoxIcon />, matchPrefix: "/admin/products" },
  { href: "/admin/submissions", label: "Submissions", icon: <InboxIcon />, matchPrefix: "/admin/submissions" },
  { href: "/admin/settings", label: "Settings", icon: <CogIcon /> },
];

export function AdminShell({ children, title, subtitle, actions }: { children: React.ReactNode; title: string; subtitle?: string; actions?: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  function isActive(item: (typeof NAV)[number]) {
    if (item.matchPrefix) return pathname?.startsWith(item.matchPrefix);
    return pathname === item.href;
  }

  return (
    <div className="min-h-screen bg-[var(--surface)]">
      <div className="flex">
        {/* Sidebar — desktop */}
        <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-[var(--border)] bg-white min-h-screen sticky top-0">
          <div className="px-5 py-5 border-b border-[var(--border)] flex items-center justify-between">
            <Logo size={24} />
            <span className="text-[10px] tracking-widest uppercase font-semibold text-[var(--accent-strong)] bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
              Admin
            </span>
          </div>
          <nav className="flex-1 px-3 py-4 space-y-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item)
                    ? "bg-[var(--primary)] text-white"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <span className={isActive(item) ? "text-[var(--accent)]" : "text-slate-500"}>{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="p-3 border-t border-[var(--border)] space-y-2">
            <Link href="/" className="flex items-center gap-2 text-sm text-slate-600 hover:text-[var(--primary)] px-3 py-1.5">
              <ExternalIcon /> View site
            </Link>
            <button onClick={logout} className="w-full flex items-center gap-2 text-sm text-slate-600 hover:text-red-700 px-3 py-1.5">
              <LogoutIcon /> Sign out
            </button>
          </div>
        </aside>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-black/40" onClick={() => setMobileOpen(false)}>
            <aside className="bg-white w-64 h-full p-4" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5">
                <Logo size={24} />
                <button onClick={() => setMobileOpen(false)} className="p-2"><CloseIcon /></button>
              </div>
              <nav className="space-y-1">
                {NAV.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${
                      isActive(item) ? "bg-[var(--primary)] text-white" : "text-slate-700"
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-6 pt-4 border-t border-[var(--border)]">
                <button onClick={logout} className="text-sm text-slate-600 hover:text-red-700 px-3 py-1.5">Sign out</button>
              </div>
            </aside>
          </div>
        )}

        {/* Main */}
        <div className="flex-1 min-w-0">
          <div className="border-b border-[var(--border)] bg-white">
            <div className="px-5 md:px-8 py-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <button
                  className="lg:hidden p-2 rounded-md border border-[var(--border)]"
                  onClick={() => setMobileOpen(true)}
                  aria-label="Open menu"
                >
                  <MenuIcon />
                </button>
                <div className="min-w-0">
                  <h1 className="text-xl md:text-2xl font-bold text-[var(--primary)] truncate">{title}</h1>
                  {subtitle && <p className="text-sm text-slate-500 mt-0.5 truncate">{subtitle}</p>}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">{actions}</div>
            </div>
          </div>
          <div className="p-5 md:p-8">{children}</div>
        </div>
      </div>
    </div>
  );
}

function DashboardIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>
  );
}
function BoxIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7l9-4 9 4-9 4-9-4z"/><path d="M3 7v10l9 4 9-4V7"/><path d="M12 11v10"/></svg>
  );
}
function InboxIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.5 5h13a2 2 0 0 1 1.9 1.4L22 12v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-6L3.6 6.4A2 2 0 0 1 5.5 5z"/></svg>
  );
}
function CogIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h.1A1.7 1.7 0 0 0 10 4.6V4a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v.1A1.7 1.7 0 0 0 20.4 11H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>
  );
}
function MenuIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round"/></svg>;
}
function CloseIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M6 18L18 6" strokeLinecap="round"/></svg>;
}
function LogoutIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/></svg>;
}
function ExternalIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6"/><path d="M10 14L21 3"/></svg>;
}
