"use client";

import { useEffect, useState, ReactNode, useCallback } from "react";
import Link from "next/link";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import CategoryCard from "@/components/store/CategoryCard";
import ProductCard from "@/components/store/ProductCard";
import SkeletonCard from "@/components/store/SkeletonCard";
import { apiGet } from "@/lib/api";
import type { Product, ProductsResponse } from "@/lib/types";
import { Truck, ShieldCheck, Headphones, RotateCcw, ArrowRight, Sparkles } from "lucide-react";

export default function HomePage() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setErrorMsg("");

    try {
      const [featuredRes, newArrivalsRes] = await Promise.all([
        apiGet<ProductsResponse>("/api/products?featured=true&limit=8"),
        apiGet<ProductsResponse>("/api/products?limit=8"),
      ]);

      setFeatured(featuredRes.items || []);
      setNewArrivals(newArrivalsRes.items || []);
    } catch (e: any) {
      setErrorMsg(e?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="min-h-screen bg-[#f6f7f8]">
      <Navbar />

      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-100 via-white to-[#f6f7f8]" />
          <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-sky-200/40 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-indigo-200/40 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
              <div className="space-y-7 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-xs font-bold text-slate-700 shadow-sm">
                  <Sparkles className="h-4 w-4 text-sky-600" />
                  Premium picks • Fast delivery across Nigeria
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight leading-[1.08]">
                  Shop Quality Products,{" "}
                  <span className="text-sky-600">Delivered Fast.</span>
                </h1>

                <p className="mx-auto lg:mx-0 max-w-xl text-base sm:text-lg text-slate-600">
                  Electronics, Home Appliances, and Fashion & Beauty — curated for
                  your lifestyle. Clean shopping experience, trusted quality.
                </p>

                <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                  <Link
                    href="/shop"
                    className="rounded-xl bg-sky-600 px-7 py-3.5 font-extrabold text-white shadow-lg shadow-sky-600/20 hover:opacity-90 active:scale-[0.99] transition"
                  >
                    Shop Now
                  </Link>
                  <a
                    href="#categories"
                    className="rounded-xl border border-slate-200 bg-white px-7 py-3.5 font-extrabold text-slate-900 hover:bg-slate-50 active:scale-[0.99] transition"
                  >
                    Browse Categories
                  </a>
                </div>

                <div className="flex flex-wrap justify-center lg:justify-start gap-2 pt-2">
                  <Chip>Secure checkout</Chip>
                  <Chip>Quality guaranteed</Chip>
                  <Chip>Easy returns</Chip>
                </div>
              </div>

              <div className="w-full">
                <div className="relative overflow-hidden rounded-3xl bg-slate-200 shadow-2xl">
                  <div className="aspect-[4/3] sm:aspect-square">
                    <img
                      className="h-full w-full object-cover"
                      alt="Premium shopping lifestyle"
                      src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1400&q=80"
                    />
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 grid grid-cols-3 gap-2">
                    <MiniStat label="Fast" value="Delivery" />
                    <MiniStat label="Verified" value="Quality" />
                    <MiniStat label="24/7" value="Support" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Value props */}
        <section className="border-y border-slate-100 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
              <VP icon={<Truck className="h-6 w-6 text-sky-600" />} title="Fast Delivery" desc="Across Nigeria" />
              <VP icon={<ShieldCheck className="h-6 w-6 text-sky-600" />} title="Secure Payments" desc="Protected checkout" />
              <VP icon={<Headphones className="h-6 w-6 text-sky-600" />} title="24/7 Support" desc="We’re here to help" />
              <VP icon={<RotateCcw className="h-6 w-6 text-sky-600" />} title="Easy Returns" desc="7-day policy" />
            </div>
          </div>
        </section>

        {/* Categories */}
        <section id="categories" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold">Shop by Category</h2>
              <p className="mt-1 text-sm text-slate-500">
                Explore our top collections — updated regularly.
              </p>
            </div>
            <Link
              href="/shop"
              className="inline-flex items-center gap-1 text-sm font-extrabold text-sky-600 hover:underline"
            >
              Browse all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            <CategoryCard
              title="Electronics"
              description="The latest tech for you"
              href="/category/electronics"
              image="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80"
            />
            <CategoryCard
              title="Home Appliances"
              description="Elevate your living space"
              href="/category/home-appliances"
              image="https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=1200&q=80"
            />
            <CategoryCard
              title="Fashion & Beauty"
              description="Define your unique style"
              href="/category/fashion-beauty"
              image="https://images.unsplash.com/photo-1520975958225-95f2c1c8e46b?auto=format&fit=crop&w=1200&q=80"
            />
          </div>
        </section>

        {/* Featured */}
        <section className="relative py-14 sm:py-16">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-50 to-[#f6f7f8]" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader title="Featured Products" subtitle="Hand-picked items people love right now." />

            {errorMsg ? (
              <ErrBlock msg={errorMsg} onRetry={fetchData} />
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {loading
                  ? Array.from({ length: 8 }).map((_, idx) => <SkeletonCard key={idx} />)
                  : featured.length
                  ? featured.map((p) => <ProductCard key={p._id} product={p} />)
                  : <EmptyGrid text="No featured products yet." />
                }
              </div>
            )}
          </div>
        </section>

        {/* New arrivals */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
          <SectionHeader title="New Arrivals" subtitle="Fresh drops added recently — don’t miss out." />

          {errorMsg ? (
            <ErrBlock msg={errorMsg} onRetry={fetchData} />
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {loading
                ? Array.from({ length: 8 }).map((_, idx) => <SkeletonCard key={idx} />)
                : newArrivals.length
                ? newArrivals.map((p) => <ProductCard key={p._id} product={p} />)
                : <EmptyGrid text="No new arrivals yet." />
              }
            </div>
          )}

          <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-lg font-extrabold">Ready to shop?</div>
              <div className="text-sm text-slate-500">
                Browse everything in one place — filters, categories, and more.
              </div>
            </div>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-6 py-3 font-extrabold text-white hover:opacity-90"
            >
              Go to Shop <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

/* helpers */
function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold">{title}</h2>
        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      </div>
      <Link className="hidden sm:flex items-center gap-1 font-extrabold text-sky-600 hover:underline" href="/shop">
        View all <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

function EmptyGrid({ text }: { text: string }) {
  return (
    <div className="col-span-full rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
      {text}
    </div>
  );
}

function VP({ icon, title, desc }: { icon: ReactNode; title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 sm:p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
          {icon}
        </div>
        <div>
          <h3 className="text-sm font-extrabold">{title}</h3>
          <p className="text-xs text-slate-500">{desc}</p>
        </div>
      </div>
    </div>
  );
}

function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs font-bold text-slate-700">
      {children}
    </span>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/85 backdrop-blur border border-white/60 p-3 shadow-sm">
      <div className="text-[11px] font-bold text-slate-600">{label}</div>
      <div className="text-sm font-extrabold text-slate-900">{value}</div>
    </div>
  );
}

function ErrBlock({ msg, onRetry }: { msg: string; onRetry: () => void }) {
  return (
    <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-700">
      <div className="font-extrabold">Couldn’t load products</div>
      <div className="mt-1 text-sm">{msg}</div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          onClick={onRetry}
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-extrabold text-white"
        >
          Retry
        </button>
        <div className="text-sm text-rose-600">
          Check <code className="rounded bg-white px-2 py-1">NEXT_PUBLIC_API_URL</code> and backend CORS.
        </div>
      </div>
    </div>
  );
}