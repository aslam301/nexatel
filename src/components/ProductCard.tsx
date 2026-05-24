import Link from "next/link";
import Image from "next/image";
import { Icon } from "./Icon";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group relative card flex flex-col overflow-hidden"
    >
      {/* Image area — bright surface to mimic studio product photography */}
      <div className="relative aspect-[4/3] overflow-hidden" style={{ background: "linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 100%)" }}>
        {product.image ? (
          <>
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
            />
            {/* Subtle blue tint to brand the image */}
            <div
              className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-40"
              aria-hidden
              style={{ background: "linear-gradient(135deg, rgba(59,130,246,0.15), rgba(124,58,237,0.10))" }}
            />
            {/* Top-right category chip */}
            <span
              className="absolute top-3 right-3 text-[10px] font-mono uppercase tracking-[0.16em] px-2 py-1 rounded-full backdrop-blur-md"
              style={{
                background: "rgba(255,255,255,0.85)",
                color: "var(--foreground)",
                border: "1px solid rgba(15,23,42,0.10)",
              }}
            >
              {product.category}
            </span>
            {/* Hover overlay with quick CTA */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <div
                className="rounded-lg px-3.5 py-2 text-xs font-semibold inline-flex items-center gap-1.5"
                style={{
                  background: "linear-gradient(135deg, rgba(124,58,237,0.95), rgba(79,70,229,0.95))",
                  color: "#fff",
                  boxShadow: "0 12px 30px -10px rgba(124,58,237,0.7)",
                }}
              >
                Quick view <Icon name="arrow" size={12} />
              </div>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted-2 text-sm">No image</div>
        )}
      </div>
      <div className="p-5 flex flex-col gap-2 flex-1">
        <h3 className="text-base font-semibold text-foreground-strong leading-snug line-clamp-2 min-h-[2.6em]">
          {product.name}
        </h3>
        <p className="text-sm text-muted leading-relaxed line-clamp-2">{product.shortDescription}</p>

        <div className="mt-3 pt-3 border-t border-[var(--border)] flex items-center justify-between">
          <span className="text-xs text-muted-2 font-mono uppercase tracking-[0.14em]">
            SKU · {product.id.replace(/^nx-/, "").toUpperCase()}
          </span>
          <span className="inline-flex items-center gap-1 text-sm font-semibold">
            <span style={{ background: "linear-gradient(90deg, var(--violet), var(--tech))", backgroundClip: "text", color: "transparent" }}>
              View
            </span>
            <Icon name="arrow" size={14} className="text-muted group-hover:text-foreground-strong transition-colors" />
          </span>
        </div>
      </div>
    </Link>
  );
}
