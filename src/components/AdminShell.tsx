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
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      <div className="flex">
        {/* Sidebar — desktop */}
        <aside
          className="hidden lg:flex flex-col w-64 shrink-0 border-r border-[var(--border)] min-h-screen sticky top-0"
          style={{ background: "var(--background-2)" }}
        >
          <div className="px-5 py-5 border-b border-[var(--border)] flex items-center justify-between">
            <Logo size={26} />
            <span
              className="text-[10px] tracking-widest uppercase font-semibold px-2 py-0.5 rounded"
              style={{
                color: "var(--violet)",
                background: "rgba(124,58,237,0.10)",
                border: "1px solid rgba(124,58,237,0.30)",
              }}
            >
              Admin
            </span>
          </div>
          <nav className="flex-1 px-3 py-4 space-y-1">
            {NAV.map((item) => {
              const active = isActive(item);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active ? "text-white" : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                  style={
                    active
                      ? {
                          background: "linear-gradient(135deg, rgba(124,58,237,0.95), rgba(79,70,229,0.95))",
                          boxShadow: "0 8px 24px -10px rgba(124,58,237,0.55)",
                        }
                      : undefined
                  }
                >
                  <span className={active ? "text-white" : "text-slate-400"}>{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="p-3 border-t border-[var(--border)] space-y-1">
            <Link href="/" className="flex items-center gap-2 text-sm text-slate-400 hover:text-white px-3 py-1.5 transition-colors">
              <ExternalIcon /> View site
            </Link>
            <button onClick={logout} className="w-full flex items-center gap-2 text-sm text-slate-400 hover:text-red-300 px-3 py-1.5 transition-colors">
              <LogoutIcon /> Sign out
            </button>
          </div>
        </aside>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)}>
            <aside
              className="w-64 h-full p-4 border-r border-[var(--border)]"
              style={{ background: "var(--background-2)" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-5">
                <Logo size={24} />
                <button onClick={() => setMobileOpen(false)} className="p-2 text-slate-400"><CloseIcon /></button>
              </div>
              <nav className="space-y-1">
                {NAV.map((item) => {
                  const active = isActive(item);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${
                        active ? "text-white" : "text-slate-300"
                      }`}
                      style={
                        active
                          ? {
                              background: "linear-gradient(135deg, rgba(124,58,237,0.95), rgba(79,70,229,0.95))",
                            }
                          : undefined
                      }
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
              <div className="mt-6 pt-4 border-t border-[var(--border)]">
                <button onClick={logout} className="text-sm text-slate-400 hover:text-red-300 px-3 py-1.5 transition-colors">Sign out</button>
              </div>
            </aside>
          </div>
        )}

        {/* Main */}
        <div className="flex-1 min-w-0">
          <div
            className="border-b border-[var(--border)] sticky top-0 z-20 backdrop-blur-md"
            style={{ background: "rgba(10,15,31,0.78)" }}
          >
            <div className="px-5 md:px-8 py-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <button
                  className="lg:hidden p-2 rounded-md border border-[var(--border-strong)] text-slate-200"
                  onClick={() => setMobileOpen(true)}
                  aria-label="Open menu"
                >
                  <MenuIcon />
                </button>
                <div className="min-w-0">
                  <h1 className="text-xl md:text-2xl font-semibold text-white tracking-tight truncate">{title}</h1>
                  {subtitle && <p className="text-sm text-slate-400 mt-0.5 truncate">{subtitle}</p>}
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
