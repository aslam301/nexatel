import Link from "next/link";
import { AdminShell } from "@/components/AdminShell";
import { getProducts, getServices, getProjects, getSettings, getSubmissions, isFsWritable } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [products, services, projects, submissions, settings] = await Promise.all([
    getProducts(),
    getServices(),
    getProjects(),
    getSubmissions(),
    getSettings(),
  ]);
  const writable = isFsWritable();
  const contactCount = submissions.filter((s) => s.kind === "contact").length;
  const quoteCount = submissions.filter((s) => s.kind === "quote").length;
  const recent = submissions.slice(0, 5);
  const failed = submissions.filter((s) => !s.emailDelivered).length;

  const stats = [
    { label: "Services", value: services.length, href: "/admin/services", tint: "#67e8f9" },
    { label: "Products", value: products.length, href: "/admin/products", tint: "#a78bfa" },
    { label: "Projects", value: projects.length, href: "/admin/projects", tint: "#6ee7b7" },
    { label: "Submissions", value: contactCount + quoteCount, href: "/admin/submissions", tint: "#fbbf24" },
  ];

  return (
    <AdminShell title="Dashboard" subtitle={`Welcome back · Notifications go to ${settings.notificationEmail}`}>
      {!writable && (
        <div
          className="mb-6 rounded-lg p-4 text-sm text-amber-200"
          style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.30)" }}
        >
          <strong className="text-amber-100">Read-only environment.</strong> Submissions and product edits made on the deployed
          site won&rsquo;t persist. Run the admin locally for data changes, or wire a Marketplace
          database. Email delivery still works in production if <code className="font-mono text-amber-100">RESEND_API_KEY</code> is set.
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="card p-5"
          >
            <div className="text-xs uppercase tracking-[0.16em] font-semibold text-slate-400">{s.label}</div>
            <div className="mt-3 text-3xl font-semibold tabular-nums" style={{ color: s.tint }}>
              {s.value}
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-white">Recent submissions</h2>
            <Link href="/admin/submissions" className="text-sm font-semibold hover:opacity-80" style={{ color: "var(--violet)" }}>
              View all →
            </Link>
          </div>
          {recent.length === 0 ? (
            <div className="py-12 text-center text-sm text-slate-500">No submissions yet.</div>
          ) : (
            <ul className="divide-y divide-[var(--border)]">
              {recent.map((s) => (
                <li key={s.id} className="py-3 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className="text-[10px] font-mono font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded"
                        style={{
                          background: s.kind === "quote" ? "rgba(16,185,129,0.10)" : "rgba(56,189,248,0.10)",
                          color: s.kind === "quote" ? "#6ee7b7" : "#7dd3fc",
                          border: `1px solid ${s.kind === "quote" ? "rgba(16,185,129,0.30)" : "rgba(56,189,248,0.30)"}`,
                        }}
                      >
                        {s.kind}
                      </span>
                      <span className="font-medium text-white truncate">{s.name}</span>
                    </div>
                    <div className="text-xs text-slate-500 truncate mt-1">{s.email}</div>
                    <div className="text-sm text-slate-400 mt-1 line-clamp-1">{s.message}</div>
                  </div>
                  <div className="text-xs text-slate-500 whitespace-nowrap shrink-0">
                    {new Date(s.createdAt).toLocaleDateString()}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="space-y-5">
          <div className="card p-6">
            <h2 className="font-semibold text-white">Email delivery</h2>
            <div className="mt-4 space-y-2.5 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-400">Notifications to</span>
                <span className="font-mono text-xs text-slate-200 truncate">{settings.notificationEmail}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Provider</span>
                <span className="font-mono text-xs text-slate-200">
                  {process.env.RESEND_API_KEY ? "Resend" : "Console (no key)"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Failed deliveries</span>
                <span
                  className="font-mono text-xs"
                  style={{ color: failed > 0 ? "#fca5a5" : "#cbd5e1" }}
                >
                  {failed}
                </span>
              </div>
            </div>
            <Link href="/admin/settings" className="mt-5 block text-sm font-semibold hover:opacity-80" style={{ color: "var(--violet)" }}>
              Edit email settings →
            </Link>
          </div>

          <div className="card p-6">
            <h2 className="font-semibold text-white">Quick actions</h2>
            <div className="mt-4 flex flex-col gap-2">
              <Link href="/admin/products/new" className="btn-primary w-full justify-center">Add product</Link>
              <Link href="/admin/submissions" className="btn-outline w-full justify-center">View submissions</Link>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
