import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import ProductCard from "@/components/store/ProductCard";
import ShopFilters from "@/components/store/ShopFilters";
import { apiGet } from "@/lib/api";
import type { ProductsResponse } from "@/lib/types";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const qs = new URLSearchParams();
  const setIf = (k: string) => {
    const v = searchParams[k];
    const val = Array.isArray(v) ? v[0] : v;
    if (val) qs.set(k, val);
  };

  setIf("q");
  setIf("category");
  setIf("minPrice");
  setIf("maxPrice");
  setIf("inStock");
  setIf("page");
  qs.set("limit", "12");

  const data = await apiGet<ProductsResponse>(`/api/product?${qs.toString()}`);
  const page = data.page || 1;

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold">Shop</h1>
          <p className="mt-1 text-sm text-slate-500">Search and filter products.</p>
        </div>

        <ShopFilters />

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {data.items.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>

        <Pagination page={page} totalPages={data.totalPages} searchParams={searchParams} />
      </main>
      <Footer />
    </div>
  );
}

function Pagination({
  page,
  totalPages,
  searchParams,
}: {
  page: number;
  totalPages: number;
  searchParams: Record<string, string | string[] | undefined>;
}) {
  if (!totalPages || totalPages <= 1) return null;

  const mk = (p: number) => {
    const qs = new URLSearchParams();
    Object.entries(searchParams).forEach(([k, v]) => {
      const val = Array.isArray(v) ? v[0] : v;
      if (val && k !== "page") qs.set(k, val);
    });
    qs.set("page", String(p));
    return `/shop?${qs.toString()}`;
  };

  return (
    <div className="mt-10 flex items-center justify-center gap-3">
      <a className={`rounded-xl px-4 py-2 font-bold ${page <= 1 ? "pointer-events-none bg-slate-200 text-slate-500" : "bg-white hover:bg-slate-100"}`} href={mk(page - 1)}>Prev</a>
      <div className="text-sm text-slate-600">Page <span className="font-bold">{page}</span> / {totalPages}</div>
      <a className={`rounded-xl px-4 py-2 font-bold ${page >= totalPages ? "pointer-events-none bg-slate-200 text-slate-500" : "bg-white hover:bg-slate-100"}`} href={mk(page + 1)}>Next</a>
    </div>
  );
}