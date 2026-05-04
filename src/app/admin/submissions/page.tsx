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

  function pillClass(active: boolean) {
    return `text-xs font-semibold uppercase tracking-wide px-3.5 py-1.5 rounded-full transition-colors ${
      active ? "text-white" : "text-slate-300 hover:text-white"
    }`;
  }
  function pillStyle(active: boolean, kind: "all" | "contact" | "quote") {
    if (active) {
      const map = {
        all: "linear-gradient(135deg, rgba(124,58,237,0.95), rgba(79,70,229,0.95))",
        contact: "linear-gradient(135deg, rgba(56,189,248,0.95), rgba(2,132,199,0.95))",
        quote: "linear-gradient(135deg, rgba(16,185,129,0.95), rgba(5,150,105,0.95))",
      } as const;
      return { background: map[kind], border: "1px solid transparent" };
    }
    return { background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-strong)" };
  }

  return (
    <AdminShell title="Submissions" subtitle={`${filtered.length} of ${all.length} record(s) · read-only`}>
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <Link href="/admin/submissions" className={pillClass(!kindFilter)} style={pillStyle(!kindFilter, "all")}>All</Link>
        <Link href="/admin/submissions?kind=contact" className={pillClass(kindFilter === "contact")} style={pillStyle(kindFilter === "contact", "contact")}>Contact</Link>
        <Link href="/admin/submissions?kind=quote" className={pillClass(kindFilter === "quote")} style={pillStyle(kindFilter === "quote", "quote")}>Quotes</Link>
        <div className="ml-auto text-xs text-slate-500">
          Stored in <code className="font-mono text-slate-400">data/submissions.json</code> and emailed to the address in Settings.
        </div>
      </div>

      <SubmissionsClient submissions={filtered} />
    </AdminShell>
  );
}
