"use client";

import Link from "next/link";
import Image from "next/image";
import { Eye, ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatNaira, prettyCategory } from "@/lib/format";

export default function ProductCard({ product }: { product: Product }) {
  const img = product.images?.[0] || "/placeholders/product.png";

  return (
    <div className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl">
      <div className="relative aspect-square bg-slate-100">
        <Image
          src={img}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 100vw, 25vw"
        />

        <div className="absolute left-3 top-3 rounded-full bg-white/80 backdrop-blur px-3 py-1 text-[11px] font-extrabold text-slate-800 border border-white/60">
          {prettyCategory(product.category)}
        </div>

        {product.featured && (
          <div className="absolute right-3 top-3 rounded-full bg-sky-600 px-3 py-1 text-[10px] font-extrabold text-white">
            Featured
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-1 font-extrabold text-slate-900">
            {product.name}
          </h3>
          <ShoppingBag className="h-5 w-5 text-slate-300 group-hover:text-sky-600 transition" />
        </div>

        <div className="mt-2 text-lg font-black text-sky-600">
          {formatNaira(product.price)}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <Link
            href={`/product/${product.slug}`}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-extrabold text-slate-900 hover:bg-slate-200 transition"
          >
            <Eye className="h-4 w-4" /> View
          </Link>

          <Link
            href={`/product/${product.slug}`}
            className="inline-flex items-center justify-center rounded-2xl bg-sky-600 px-4 py-3 text-sm font-extrabold text-white shadow-lg shadow-sky-600/20 hover:opacity-90 transition"
          >
            Buy
          </Link>
        </div>
      </div>
    </div>
  );
}