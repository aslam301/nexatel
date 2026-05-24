"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export interface SortableItem {
  id: string;
}

interface Props<T extends SortableItem> {
  items: T[];
  /** Endpoint to PUT the new order to. */
  reorderUrl: string;
  /** Key in the PUT payload: "ids" for products/projects, "slugs" for services. */
  payloadKey: "ids" | "slugs";
  /** Render a single row. The drag handle is rendered for you on the left. */
  renderRow: (item: T) => React.ReactNode;
  /** Column count for the empty state colspan. */
  columns: number;
  /** Empty state message. */
  emptyLabel?: string;
}

export function SortableList<T extends SortableItem>({
  items: initial,
  reorderUrl,
  payloadKey,
  renderRow,
  columns,
  emptyLabel = "No items yet.",
}: Props<T>) {
  const [items, setItems] = useState<T[]>(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  async function onDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIdx = items.findIndex((i) => i.id === active.id);
    const newIdx = items.findIndex((i) => i.id === over.id);
    if (oldIdx === -1 || newIdx === -1) return;
    const next = arrayMove(items, oldIdx, newIdx);
    setItems(next);
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(reorderUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [payloadKey]: next.map((i) => i.id) }),
      });
      const body = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !body.ok) {
        setItems(initial);
        throw new Error(body.error || "Reorder failed");
      }
    } catch (err) {
      setItems(initial);
      setError(err instanceof Error ? err.message : "Reorder failed");
    } finally {
      setBusy(false);
    }
  }

  if (items.length === 0) {
    return (
      <tbody>
        <tr><td colSpan={columns} className="py-12 text-center text-slate-500">{emptyLabel}</td></tr>
      </tbody>
    );
  }

  return (
    <>
      {error && (
        <tbody><tr><td colSpan={columns} className="p-3 text-sm text-red-200" style={{ background: "rgba(239,68,68,0.10)" }}>{error}</td></tr></tbody>
      )}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          <tbody style={{ opacity: busy ? 0.6 : 1, transition: "opacity 0.15s" }}>
            {items.map((item) => (
              <SortableRow key={item.id} id={item.id}>
                {renderRow(item)}
              </SortableRow>
            ))}
          </tbody>
        </SortableContext>
      </DndContext>
    </>
  );
}

function SortableRow({ id, children }: { id: string; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    background: isDragging ? "rgba(124,58,237,0.10)" : undefined,
  };
  return (
    <tr ref={setNodeRef} style={style} className="border-t border-[var(--border)] hover:bg-white/[0.02] transition-colors">
      <td className="py-3.5 pl-4 pr-2 w-8">
        <button
          type="button"
          aria-label="Drag to reorder"
          className="text-slate-500 hover:text-slate-200 cursor-grab active:cursor-grabbing touch-none p-1"
          {...attributes}
          {...listeners}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="9" cy="6" r="1" /><circle cx="9" cy="12" r="1" /><circle cx="9" cy="18" r="1" />
            <circle cx="15" cy="6" r="1" /><circle cx="15" cy="12" r="1" /><circle cx="15" cy="18" r="1" />
          </svg>
        </button>
      </td>
      {children}
    </tr>
  );
}
