"use client";

import type { Product } from "@/lib/types";
import { useCartStore } from "@/store/cart.store";
import { formatNaira } from "@/lib/format";
import { useMemo, useState } from "react";

export default function AddToCartPanel({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);

  const hasVariants = Array.isArray(product.variants) && product.variants.length > 0;
  const [variantSku, setVariantSku] = useState<string>(hasVariants ? product.variants![0].sku : "");

  const selectedVariant = useMemo(() => {
    if (!hasVariants) return null;
    return product.variants!.find((v) => v.sku === variantSku) || product.variants![0];
  }, [hasVariants, product, variantSku]);

  const price = selectedVariant?.price ?? product.price;
  const inStock = hasVariants ? (selectedVariant?.stock ?? 0) > 0 : (product.stock ?? 0) > 0;

  function handleAdd() {
    const image = product.images?.[0] || "/placeholders/product.png";
    addItem({
      productId: product._id,
      slug: product.slug,
      name: product.name,
      image,
      unitPrice: price,
      variantSku: hasVariants ? selectedVariant?.sku : undefined,
      variantName: hasVariants ? selectedVariant?.name : undefined,
    });
  }

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="text-2xl font-black text-sky-600">{formatNaira(price)}</div>

      {hasVariants && (
        <div className="mt-4">
          <label className="text-sm font-bold">Choose option</label>
          <select
            className="mt-2 w-full rounded-xl bg-slate-100 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-sky-500"
            value={variantSku}
            onChange={(e) => setVariantSku(e.target.value)}
          >
            {product.variants!.map((v) => (
              <option key={v.sku} value={v.sku}>
                {v.name} — Stock: {v.stock}
              </option>
            ))}
          </select>
        </div>
      )}

      <button
        disabled={!inStock}
        onClick={handleAdd}
        className={`mt-5 w-full rounded-xl px-5 py-3 font-bold text-white ${
          inStock ? "bg-sky-600 hover:opacity-90" : "bg-slate-300 cursor-not-allowed"
        }`}
      >
        {inStock ? "Add to Cart" : "Out of Stock"}
      </button>
    </div>
  );
}