import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import ProductCard from "@/components/store/ProductCard";
import ShopFilters from "@/components/store/ShopFilters";
import SkeletonCard from "@/components/store/SkeletonCard";
import { apiGet } from "@/lib/api";
import type { ProductsResponse } from "@/lib/types";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams; // ✅ IMPORTANT

  const qs = new URLSearchParams();

  const setIf = (k: string) => {
    const v = sp[k];
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

  let data: ProductsResponse | null = null;
  let errorMsg = "";

  try {
    data = await apiGet<ProductsResponse>(`/api/products?${qs.toString()}`);
  } catch (e: any) {
    errorMsg = e?.message || "Failed to load products";
  }

  const page = data?.page || 1;

  return (
    <div className="min-h-screen bg-[#f6f7f8] text-slate-900">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-black">Shop</h1>
            <p className="mt-1 text-sm text-slate-500">
              Search and filter products across all categories.
            </p>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-extrabold text-sky-600 hover:underline"
          >
            Back to Home <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Filters */}
        <ShopFilters />

        {/* Body */}
        {errorMsg ? (
          <ErrBlock msg={errorMsg} />
        ) : !data ? (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : data.items.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-8">
            <div className="text-lg font-black">No products found</div>
            <div className="mt-1 text-sm text-slate-500">
              Try changing your search or clearing filters.
            </div>
            <Link
              href="/shop"
              className="mt-5 inline-flex rounded-2xl bg-sky-600 px-5 py-3 text-sm font-extrabold text-white hover:opacity-90"
            >
              Clear filters
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {data.items.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>

            <Pagination page={page} totalPages={data.totalPages} searchParams={sp} />
          </>
        )}
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
      <a
        className={[
          "rounded-2xl px-4 py-2 text-sm font-extrabold border transition",
          page <= 1
            ? "pointer-events-none bg-slate-200 text-slate-500 border-slate-200"
            : "bg-white hover:bg-slate-50 border-slate-200",
        ].join(" ")}
        href={mk(page - 1)}
      >
        Prev
      </a>

      <div className="text-sm text-slate-600">
        Page <span className="font-black">{page}</span> / {totalPages}
      </div>

      <a
        className={[
          "rounded-2xl px-4 py-2 text-sm font-extrabold border transition",
          page >= totalPages
            ? "pointer-events-none bg-slate-200 text-slate-500 border-slate-200"
            : "bg-white hover:bg-slate-50 border-slate-200",
        ].join(" ")}
        href={mk(page + 1)}
      >
        Next
      </a>
    </div>
  );
}

function ErrBlock({ msg }: { msg: string }) {
  return (
    <div className="mt-8 rounded-3xl border border-rose-200 bg-rose-50 p-6 text-rose-700">
      <div className="font-black">Couldn’t load products</div>
      <div className="mt-1 text-sm">{msg}</div>
      <div className="mt-4 text-sm text-rose-600">
        Check <code className="rounded bg-white px-2 py-1">NEXT_PUBLIC_API_URL</code> and backend CORS.
      </div>
    </div>
  );
}