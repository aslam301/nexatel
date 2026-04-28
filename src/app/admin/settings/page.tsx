import { AdminShell } from "@/components/AdminShell";
import { SettingsForm } from "./SettingsForm";
import { getSettings, isFsWritable } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const settings = await getSettings();
  const writable = isFsWritable();
  const hasResend = !!process.env.RESEND_API_KEY;
  return (
    <AdminShell title="Settings" subtitle="Email notifications and delivery">
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 card p-6 md:p-8">
          <h2 className="text-lg font-semibold text-[var(--primary)]">Notification email</h2>
          <p className="text-sm text-slate-600 mt-1.5">
            Where contact and quote submissions are emailed. You can also CC additional addresses.
          </p>
          <div className="mt-6">
            <SettingsForm initial={settings} writable={writable} />
          </div>
        </div>

        <div className="space-y-5">
          <div className="card p-5">
            <h3 className="font-semibold text-[var(--primary)]">Email provider</h3>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Status</span>
                <span className={`text-xs font-mono ${hasResend ? "text-emerald-700" : "text-amber-700"}`}>
                  {hasResend ? "Resend connected" : "Not configured"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">From</span>
                <span className="font-mono text-xs">{process.env.EMAIL_FROM || "onboarding@resend.dev"}</span>
              </div>
            </div>
            {!hasResend && (
              <p className="mt-3 text-xs text-slate-500">
                Set <code>RESEND_API_KEY</code> and (optionally) <code>EMAIL_FROM</code> in your environment to enable email delivery. Submissions will still be saved and visible here without it.
              </p>
            )}
          </div>

          <div className="card p-5">
            <h3 className="font-semibold text-[var(--primary)]">Storage</h3>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Filesystem</span>
                <span className={`text-xs font-mono ${writable ? "text-emerald-700" : "text-amber-700"}`}>
                  {writable ? "Writable" : "Read-only"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Submissions stored in</span>
                <span className="font-mono text-xs">data/submissions.json</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
