"use client";

import { useState } from "react";
import type { Submission } from "@/lib/types";

export function SubmissionsClient({ submissions }: { submissions: Submission[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const open = submissions.find((s) => s.id === openId) ?? null;

  if (submissions.length === 0) {
    return (
      <div className="card p-12 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <div className="text-slate-500 text-sm">No submissions yet.</div>
        <p className="mt-2 text-xs text-slate-400">When visitors submit the contact or quote forms, they&rsquo;ll appear here.</p>
      </div>
    );
  }

  // Split-pane on lg+ : both columns share a fixed viewport-based height with
  // their own internal scroll. On mobile the layout reverts to normal page flow.
  return (
    <div className="grid gap-5 lg:grid-cols-5 lg:h-[calc(100vh-11rem)]">
      <div className={`${open ? "lg:col-span-3" : "lg:col-span-5"} card overflow-hidden flex flex-col`}>
        <div className="overflow-auto flex-1">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr className="text-left text-xs uppercase tracking-wider text-slate-500">
                <th className="py-3 px-5">Type</th>
                <th className="py-3 px-5">From</th>
                <th className="py-3 px-5 hidden md:table-cell">Subject / scope</th>
                <th className="py-3 px-5">Email</th>
                <th className="py-3 px-5 hidden sm:table-cell">When</th>
                <th className="py-3 px-5"> </th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((s) => (
                <tr
                  key={s.id}
                  onClick={() => setOpenId(s.id)}
                  className={`border-t border-[var(--border)] cursor-pointer hover:bg-slate-50/60 ${openId === s.id ? "bg-slate-100" : ""}`}
                >
                  <td className="py-3 px-5">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                      s.kind === "quote" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-sky-50 text-sky-700 border border-sky-200"
                    }`}>{s.kind}</span>
                  </td>
                  <td className="py-3 px-5">
                    <div className="font-medium text-[var(--primary)]">{s.name}</div>
                    <div className="text-xs text-slate-500">{s.organisation || "—"}</div>
                  </td>
                  <td className="py-3 px-5 hidden md:table-cell text-slate-600 max-w-xs truncate">
                    {s.scope || s.topic || s.message.slice(0, 80)}
                  </td>
                  <td className="py-3 px-5">
                    {s.emailDelivered ? (
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Sent
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-amber-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Not sent
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-5 hidden sm:table-cell text-slate-500 text-xs whitespace-nowrap">
                    {new Date(s.createdAt).toLocaleString()}
                  </td>
                  <td className="py-3 px-5 text-right text-slate-400 text-lg">›</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {open && (
        <div className="lg:col-span-2 card p-5 lg:overflow-y-auto">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="min-w-0">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                open.kind === "quote" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-sky-50 text-sky-700 border border-sky-200"
              }`}>{open.kind}</span>
              <h3 className="mt-2 font-semibold text-[var(--primary)] truncate">{open.name}</h3>
              <a href={`mailto:${open.email}`} className="text-xs text-slate-500 hover:underline truncate block">{open.email}</a>
            </div>
            <button onClick={() => setOpenId(null)} className="text-slate-400 hover:text-slate-700 text-xl leading-none" aria-label="Close">×</button>
          </div>

          <dl className="grid grid-cols-3 gap-y-2 text-sm">
            {open.organisation && (
              <><dt className="col-span-1 text-slate-500 text-xs">Organisation</dt><dd className="col-span-2 text-[var(--primary)]">{open.organisation}</dd></>
            )}
            {open.phone && (
              <><dt className="col-span-1 text-slate-500 text-xs">Phone</dt><dd className="col-span-2">{open.phone}</dd></>
            )}
            {open.topic && (
              <><dt className="col-span-1 text-slate-500 text-xs">Topic</dt><dd className="col-span-2">{open.topic}</dd></>
            )}
            {open.serviceArea && (
              <><dt className="col-span-1 text-slate-500 text-xs">Service</dt><dd className="col-span-2">{open.serviceArea}</dd></>
            )}
            {open.scope && (
              <><dt className="col-span-1 text-slate-500 text-xs">Scope</dt><dd className="col-span-2">{open.scope}</dd></>
            )}
            {open.budget && (
              <><dt className="col-span-1 text-slate-500 text-xs">Budget</dt><dd className="col-span-2">{open.budget}</dd></>
            )}
            {open.timeline && (
              <><dt className="col-span-1 text-slate-500 text-xs">Timeline</dt><dd className="col-span-2">{open.timeline}</dd></>
            )}
            {open.location && (
              <><dt className="col-span-1 text-slate-500 text-xs">Location</dt><dd className="col-span-2">{open.location}</dd></>
            )}
            <dt className="col-span-1 text-slate-500 text-xs">Received</dt>
            <dd className="col-span-2 text-xs">{new Date(open.createdAt).toLocaleString()}</dd>
            <dt className="col-span-1 text-slate-500 text-xs">Email</dt>
            <dd className="col-span-2 text-xs">
              {open.emailDelivered
                ? <span className="text-emerald-700">Delivered</span>
                : <span className="text-amber-700">Not sent {open.emailError ? `· ${open.emailError}` : ""}</span>}
            </dd>
          </dl>

          <div className="mt-4 pt-4 border-t border-[var(--border)]">
            <div className="text-xs uppercase tracking-wider font-semibold text-slate-500 mb-2">Message</div>
            <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{open.message}</p>
          </div>

          <div className="mt-5 flex gap-2">
            <a href={`mailto:${open.email}?subject=Re%3A%20Your%20Nexatel%20enquiry`} className="btn-primary text-sm">Reply</a>
            <button onClick={() => setOpenId(null)} className="btn-outline text-sm">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
