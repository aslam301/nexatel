import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.slug}`} className="card flex flex-col group">
      <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm">No image</div>
        )}
      </div>
      <div className="p-5 flex flex-col gap-2 flex-1">
        <span className="eyebrow">{product.category}</span>
        <h3 className="text-base font-semibold text-[var(--primary)] leading-snug">{product.name}</h3>
        <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">{product.shortDescription}</p>
        <div className="mt-2 inline-flex items-center text-sm font-semibold text-[var(--primary)]">
          View details →
        </div>
      </div>
    </Link>
  );
}
