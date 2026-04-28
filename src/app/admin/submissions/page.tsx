import Link from "next/link";
import { AdminShell } from "@/components/AdminShell";
import { getSubmissions } from "@/lib/data";
import { SubmissionsClient } from "./SubmissionsClient";

export const dynamic = "force-dynamic";

interface SearchParams { kind?: string; q?: string }

export default async function SubmissionsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;
  const all = await getSubmissions();
  const kindFilter = sp.kind === "contact" || sp.kind === "quote" ? sp.kind : undefined;
  const q = (sp.q || "").trim().toLowerCase();
  const filtered = all
    .filter((s) => !kindFilter || s.kind === kindFilter)
    .filter((s) => !q || [s.name, s.email, s.organisation, s.message, s.scope].some((v) => v?.toLowerCase().includes(q)));

  return (
    <AdminShell title="Submissions" subtitle={`${filtered.length} of ${all.length} record(s) · read-only`}>
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <Link href="/admin/submissions" className={`text-sm px-3 py-1.5 rounded-full border ${!kindFilter ? "bg-[var(--primary)] text-white border-[var(--primary)]" : "border-[var(--border)] text-slate-700 hover:bg-slate-100"}`}>All</Link>
        <Link href="/admin/submissions?kind=contact" className={`text-sm px-3 py-1.5 rounded-full border ${kindFilter === "contact" ? "bg-sky-600 text-white border-sky-600" : "border-[var(--border)] text-slate-700 hover:bg-slate-100"}`}>Contact</Link>
        <Link href="/admin/submissions?kind=quote" className={`text-sm px-3 py-1.5 rounded-full border ${kindFilter === "quote" ? "bg-emerald-600 text-white border-emerald-600" : "border-[var(--border)] text-slate-700 hover:bg-slate-100"}`}>Quotes</Link>
        <div className="ml-auto text-xs text-slate-500">Submissions are stored in <code>data/submissions.json</code> and emailed to the address in Settings.</div>
      </div>

      <SubmissionsClient submissions={filtered} />
    </AdminShell>
  );
}
