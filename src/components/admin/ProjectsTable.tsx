"use client";

import Link from "next/link";
import { SortableList } from "./SortableList";
import type { Project } from "@/lib/types";

export function ProjectsTable({ projects }: { projects: Project[] }) {
  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead style={{ background: "rgba(255,255,255,0.02)" }}>
            <tr className="text-left text-[11px] font-mono uppercase tracking-[0.16em] text-slate-400">
              <th className="py-3.5 pl-4 pr-2 w-8" aria-label="Drag" />
              <th className="py-3.5 px-5 font-semibold">Title</th>
              <th className="py-3.5 px-5 font-semibold">Client</th>
              <th className="py-3.5 px-5 font-semibold">Category</th>
              <th className="py-3.5 px-5 font-semibold">Year</th>
              <th className="py-3.5 px-5 font-semibold">Featured</th>
              <th className="py-3.5 px-5 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <SortableList
            items={projects}
            reorderUrl="/api/admin/projects/reorder"
            payloadKey="ids"
            columns={7}
            emptyLabel="No projects yet."
            renderRow={(p) => (
              <>
                <td className="py-3.5 px-5 font-medium text-white">{p.title}</td>
                <td className="py-3.5 px-5 text-slate-300">{p.client}</td>
                <td className="py-3.5 px-5 text-slate-300">{p.category}</td>
                <td className="py-3.5 px-5 text-slate-400">{p.year}</td>
                <td className="py-3.5 px-5">
                  {p.featured ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold" style={{ color: "var(--tech)" }}>
                      <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: "var(--tech)" }} /> On
                    </span>
                  ) : (
                    <span className="text-xs text-slate-500">Off</span>
                  )}
                </td>
                <td className="py-3.5 px-5 text-right">
                  <Link
                    href={`/admin/projects/${p.id}`}
                    className="text-sm font-semibold hover:opacity-80"
                    style={{ color: "var(--violet)" }}
                  >
                    Edit
                  </Link>
                </td>
              </>
            )}
          />
        </table>
      </div>
    </div>
  );
}
