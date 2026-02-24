"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

export default function ShopFilters() {
  const router = useRouter();
  const sp = useSearchParams();

  const initial = useMemo(() => {
    const get = (k: string) => sp.get(k) || "";
    return {
      q: get("q"),
      category: get("category"),
      minPrice: get("minPrice"),
      maxPrice: get("maxPrice"),
      inStock: get("inStock") || "",
    };
  }, [sp]);

  const [q, setQ] = useState(initial.q);
  const [category, setCategory] = useState(initial.category);
  const [minPrice, setMinPrice] = useState(initial.minPrice);
  const [maxPrice, setMaxPrice] = useState(initial.maxPrice);
  const [inStock, setInStock] = useState(initial.inStock);

  function apply() {
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (category) params.set("category", category);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (inStock) params.set("inStock", inStock);
    router.push(`/shop?${params.toString()}`);
  }

  function reset() {
    router.push("/shop");
  }

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
        <input
          className="rounded-xl bg-slate-100 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-sky-500"
          placeholder="Search products..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />

        <select
          className="rounded-xl bg-slate-100 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-sky-500"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All categories</option>
          <option value="electronics">Electronics</option>
          <option value="home-appliances">Home Appliances</option>
          <option value="fashion-beauty">Fashion & Beauty</option>
        </select>

        <input
          className="rounded-xl bg-slate-100 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-sky-500"
          placeholder="Min price"
          inputMode="numeric"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <input
          className="rounded-xl bg-slate-100 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-sky-500"
          placeholder="Max price"
          inputMode="numeric"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />

        <select
          className="rounded-xl bg-slate-100 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-sky-500"
          value={inStock}
          onChange={(e) => setInStock(e.target.value)}
        >
          <option value="">All</option>
          <option value="true">In stock</option>
        </select>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button onClick={apply} className="rounded-xl bg-sky-600 px-5 py-2.5 font-bold text-white hover:opacity-90">
          Apply
        </button>
        <button onClick={reset} className="rounded-xl bg-slate-100 px-5 py-2.5 font-bold hover:bg-slate-200">
          Reset
        </button>
      </div>
    </div>
  );
}