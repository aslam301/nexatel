"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { Icon } from "@/components/Icon";
import type { Product } from "@/lib/types";

const ALL = "All";

export function ProductsCatalog({
  products,
  categoryOrder,
}: {
  products: Product[];
  /** Optional preferred ordering for category pills; anything missing is appended. */
  categoryOrder?: string[];
}) {
  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category));
    if (categoryOrder && categoryOrder.length > 0) {
      const ordered = categoryOrder.filter((c) => set.has(c));
      const rest = Array.from(set).filter((c) => !categoryOrder.includes(c)).sort();
      return [ALL, ...ordered, ...rest];
    }
    return [ALL, ...Array.from(set).sort()];
  }, [products, categoryOrder]);

  const counts = useMemo(() => {
    const map: Record<string, number> = { [ALL]: products.length };
    for (const p of products) map[p.category] = (map[p.category] ?? 0) + 1;
    return map;
  }, [products]);

  const [active, setActive] = useState<string>(ALL);
  const [query, setQuery] = useState<string>("");

  const filtered = useMemo(() => {
    let list = active === ALL ? products : products.filter((p) => p.category === active);
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }
    return list;
  }, [active, query, products]);

  return (
    <div className="space-y-8">
      {/* Toolbar: search + result count */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative w-full md:max-w-sm">
          <span
            className="pointer-events-none absolute left-3.5 top-0 bottom-0 flex items-center text-muted-2"
            aria-hidden
          >
            <Icon name="search" size={16} />
          </span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="input"
            style={{ paddingLeft: "2.75rem", paddingRight: "2.5rem" }}
            aria-label="Search products"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-0 bottom-0 flex items-center text-muted-2 hover:text-foreground-strong transition-colors"
              aria-label="Clear search"
              type="button"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>
        <div className="text-sm text-muted">
          Showing <span className="text-foreground-strong font-semibold">{filtered.length}</span> of {products.length} products
        </div>
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2">
        {categories.map((c) => {
          const isActive = c === active;
          return (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`text-xs font-semibold tracking-wide uppercase rounded-full px-3.5 py-1.5 transition-all ${
                isActive ? "text-white" : "text-muted hover:text-foreground-strong"
              }`}
              style={{
                background: isActive
                  ? "linear-gradient(135deg, rgba(124,58,237,0.95), rgba(79,70,229,0.95))"
                  : "rgba(15,23,42,0.03)",
                border: isActive
                  ? "1px solid rgba(124,58,237,0.55)"
                  : "1px solid var(--border-strong)",
                boxShadow: isActive
                  ? "0 8px 24px -10px rgba(124,58,237,0.55)"
                  : "none",
              }}
            >
              {c} <span className="opacity-70 ml-1">{counts[c]}</span>
            </button>
          );
        })}
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center">
          <h3 className="text-lg font-semibold text-foreground-strong">No products match your search</h3>
          <p className="text-muted mt-2 text-sm">Try a different keyword or category.</p>
          <button
            onClick={() => {
              setActive(ALL);
              setQuery("");
            }}
            className="btn-outline mt-6"
          >
            Reset filters
          </button>
        </div>
      )}
    </div>
  );
}
