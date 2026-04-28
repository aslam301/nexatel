import Link from "next/link";
import { AdminShell } from "@/components/AdminShell";
import { getProducts, getSettings, getSubmissions, isFsWritable } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [products, submissions, settings] = await Promise.all([
    getProducts(),
    getSubmissions(),
    getSettings(),
  ]);
  const writable = isFsWritable();
  const contactCount = submissions.filter((s) => s.kind === "contact").length;
  const quoteCount = submissions.filter((s) => s.kind === "quote").length;
  const recent = submissions.slice(0, 5);
  const last7 = submissions.filter((s) => Date.now() - new Date(s.createdAt).getTime() < 7 * 86400_000).length;
  const failed = submissions.filter((s) => !s.emailDelivered).length;

  const stats = [
    { label: "Products", value: products.length, href: "/admin/products", tint: "var(--primary)" },
    { label: "Contact enquiries", value: contactCount, href: "/admin/submissions?kind=contact", tint: "#0284c7" },
    { label: "Quote requests", value: quoteCount, href: "/admin/submissions?kind=quote", tint: "#059669" },
    { label: "Last 7 days", value: last7, href: "/admin/submissions", tint: "#d97706" },
  ];

  return (
    <AdminShell title="Dashboard" subtitle={`Welcome back · Notifications go to ${settings.notificationEmail}`}>
      {!writable && (
        <div className="mb-5 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          <strong>Read-only environment.</strong> Submissions and product edits made on the deployed
          site won&rsquo;t persist. Run the admin locally for data changes, or wire a Marketplace
          database. Email delivery still works in production if <code>RESEND_API_KEY</code> is set.
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="card p-5 hover:border-slate-300 transition-colors"
          >
            <div className="text-xs uppercase tracking-wider font-semibold text-slate-500">{s.label}</div>
            <div className="mt-2 text-3xl font-bold tabular-nums" style={{ color: s.tint }}>
              {s.value}
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-[var(--primary)]">Recent submissions</h2>
            <Link href="/admin/submissions" className="text-sm font-semibold text-[var(--primary)] hover:underline">
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
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                        s.kind === "quote" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-sky-50 text-sky-700 border border-sky-200"
                      }`}>
                        {s.kind}
                      </span>
                      <span className="font-medium text-[var(--primary)] truncate">{s.name}</span>
                    </div>
                    <div className="text-xs text-slate-500 truncate mt-0.5">{s.email}</div>
                    <div className="text-sm text-slate-600 mt-1 line-clamp-1">{s.message}</div>
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
          <div className="card p-5">
            <h2 className="font-semibold text-[var(--primary)]">Email delivery</h2>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Notifications to</span>
                <span className="font-mono text-xs">{settings.notificationEmail}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Provider</span>
                <span className="font-mono text-xs">
                  {process.env.RESEND_API_KEY ? "Resend" : "Console (no key)"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Failed deliveries</span>
                <span className={`font-mono text-xs ${failed > 0 ? "text-red-700" : "text-slate-700"}`}>{failed}</span>
              </div>
            </div>
            <Link href="/admin/settings" className="mt-4 block text-sm font-semibold text-[var(--primary)] hover:underline">
              Edit email settings →
            </Link>
          </div>

          <div className="card p-5">
            <h2 className="font-semibold text-[var(--primary)]">Quick actions</h2>
            <div className="mt-3 flex flex-col gap-2">
              <Link href="/admin/products/new" className="btn-primary w-full justify-center">Add product</Link>
              <Link href="/admin/submissions" className="btn-outline w-full justify-center">View submissions</Link>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
