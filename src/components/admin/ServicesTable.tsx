"use client";

import Link from "next/link";
import { SortableList } from "./SortableList";
import type { Service } from "@/lib/types";

export function ServicesTable({ services }: { services: Service[] }) {
  // SortableList needs a stable `id` field; for services we use slug.
  const items = services.map((s) => ({ ...s, id: s.slug }));
  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead style={{ background: "rgba(255,255,255,0.02)" }}>
            <tr className="text-left text-[11px] font-mono uppercase tracking-[0.16em] text-slate-400">
              <th className="py-3.5 pl-4 pr-2 w-8" aria-label="Drag" />
              <th className="py-3.5 px-5 font-semibold">Title</th>
              <th className="py-3.5 px-5 font-semibold">Slug</th>
              <th className="py-3.5 px-5 font-semibold">Icon</th>
              <th className="py-3.5 px-5 font-semibold">Featured</th>
              <th className="py-3.5 px-5 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <SortableList
            items={items}
            reorderUrl="/api/admin/services/reorder"
            payloadKey="slugs"
            columns={6}
            emptyLabel="No services yet."
            renderRow={(s) => (
              <>
                <td className="py-3.5 px-5 font-medium text-white">{s.title}</td>
                <td className="py-3.5 px-5 text-slate-500 font-mono text-xs">{s.slug}</td>
                <td className="py-3.5 px-5 text-slate-300">{s.icon}</td>
                <td className="py-3.5 px-5">
                  {s.featured ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold" style={{ color: "var(--tech)" }}>
                      <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: "var(--tech)" }} /> On
                    </span>
                  ) : (
                    <span className="text-xs text-slate-500">Off</span>
                  )}
                </td>
                <td className="py-3.5 px-5 text-right">
                  <Link
                    href={`/admin/services/${s.slug}`}
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
