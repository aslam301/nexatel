import { AdminShell } from "@/components/AdminShell";
import { SettingsForm } from "./SettingsForm";
import { getSettings, isFsWritable } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const settings = await getSettings();
  const writable = isFsWritable();
  const hasResend = !!process.env.RESEND_API_KEY;
  return (
    <AdminShell title="Settings" subtitle="Email notifications, delivery and SEO defaults">
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <SettingsForm initial={settings} writable={writable} />
        </div>

        <div className="space-y-5">
          <div className="card p-6">
            <h3 className="font-semibold text-white">Email provider</h3>
            <div className="mt-4 space-y-2.5 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Status</span>
                <span
                  className="text-xs font-mono"
                  style={{ color: hasResend ? "#6ee7b7" : "#fbbf24" }}
                >
                  {hasResend ? "Resend connected" : "Not configured"}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-400">From</span>
                <span className="font-mono text-xs text-slate-200 truncate">{process.env.EMAIL_FROM || "onboarding@resend.dev"}</span>
              </div>
            </div>
            {!hasResend && (
              <p className="mt-4 text-xs text-slate-500 leading-relaxed">
                Set <code className="font-mono text-slate-300">RESEND_API_KEY</code> and (optionally) <code className="font-mono text-slate-300">EMAIL_FROM</code> in your environment to enable email delivery. Submissions are still saved and visible here without it.
              </p>
            )}
          </div>

          <div className="card p-6">
            <h3 className="font-semibold text-white">Storage</h3>
            <div className="mt-4 space-y-2.5 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Filesystem</span>
                <span
                  className="text-xs font-mono"
                  style={{ color: writable ? "#6ee7b7" : "#fbbf24" }}
                >
                  {writable ? "Writable" : "Read-only"}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-400">Submissions in</span>
                <span className="font-mono text-xs text-slate-200">data/submissions.json</span>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="font-semibold text-white">Quick links</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a href="/sitemap.xml" target="_blank" rel="noreferrer" className="text-slate-300 hover:text-white transition-colors">
                  /sitemap.xml →
                </a>
              </li>
              <li>
                <a href="/robots.txt" target="_blank" rel="noreferrer" className="text-slate-300 hover:text-white transition-colors">
                  /robots.txt →
                </a>
              </li>
              <li>
                <a href="/manifest.webmanifest" target="_blank" rel="noreferrer" className="text-slate-300 hover:text-white transition-colors">
                  /manifest.webmanifest →
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
