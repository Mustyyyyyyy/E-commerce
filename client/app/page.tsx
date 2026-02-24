import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import CategoryCard from "@/components/store/CategoryCard";
import ProductCard from "@/components/store/ProductCard";
import SkeletonCard from "@/components/store/SkeletonCard";
import { apiGet } from "@/lib/api";
import type { Product, ProductsResponse } from "@/lib/types";
import { ArrowRight, Truck, ShieldCheck, RotateCcw, Sparkles, Plus } from "lucide-react";

async function getFeatured(): Promise<Product[]> {
  const res = await apiGet<ProductsResponse>("/api/products?featured=true&limit=8");
  return res.items || [];
}

async function getNewArrivals(): Promise<Product[]> {
  const res = await apiGet<ProductsResponse>("/api/products?limit=8");
  return res.items || [];
}

export default async function HomePage() {
  let featured: Product[] = [];
  let newArrivals: Product[] = [];
  let errorMsg = "";

  try {
    [featured, newArrivals] = await Promise.all([getFeatured(), getNewArrivals()]);
  } catch (e: any) {
    errorMsg = e?.message || "Failed to load products";
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f6f7f8] text-slate-900">
      <Navbar />

      {/* HERO */}
      <section className="relative bg-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-[#f6f7f8]" />
        <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-sky-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-indigo-200/40 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="flex flex-col items-center text-center">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-600/20 bg-sky-600/5 px-4 py-2 text-xs font-extrabold text-sky-700">
                <Sparkles className="h-4 w-4" />
                Premium picks • Fast delivery across Nigeria
              </div>

              <h1 className="mt-6 text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight">
                Shop Quality Products, <span className="text-sky-600">Delivered Fast</span>
              </h1>

              <p className="mt-6 text-base sm:text-lg lg:text-xl text-slate-600">
                Experience premium electronics, home appliances, and fashion & beauty curated for your modern lifestyle.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="/shop"
                  className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-sky-600 text-white font-extrabold shadow-lg shadow-sky-600/25 hover:opacity-90 hover:scale-[1.02] active:scale-[0.99] transition"
                >
                  Shop Now
                </a>
                <a
                  href="#categories"
                  className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-sky-600/10 text-sky-700 font-extrabold border border-sky-600/20 hover:bg-sky-600/15 hover:scale-[1.02] active:scale-[0.99] transition"
                >
                  Browse Categories
                </a>
              </div>
            </div>

            <div className="mt-12 w-full max-w-5xl overflow-hidden rounded-3xl shadow-2xl bg-slate-200">
              <div className="relative aspect-[21/9]">
                <img
                  className="absolute inset-0 h-full w-full object-cover"
                  alt="Modern product showcase"
                  src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1800&q=80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/10 to-transparent" />

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

      {/* CATEGORIES */}
      <section id="categories" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <SectionHeader
          title="Shop by Category"
          subtitle="Curated collections for every part of your life"
          ctaHref="/shop"
          ctaText="View all"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <CategoryCard
            title="Electronics"
            description="Latest gadgets and tech"
            href="/category/electronics"
            image="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80"
          />
          <CategoryCard
            title="Home Appliances"
            description="Modern home solutions"
            href="/category/home-appliances"
            image="https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=1200&q=80"
          />
          <CategoryCard
            title="Fashion & Beauty"
            description="Style and elegance"
            href="/category/fashion-beauty"
            image="https://images.unsplash.com/photo-1521334884684-d80222895322?auto=format&fit=crop&w=1200&q=80"
          />
        </div>
      </section>

      {/* VALUE PROPS */}
      <section className="bg-sky-600/5 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Value icon={<Truck className="h-6 w-6 text-sky-600" />} title="Fast Delivery" desc="Same day shipping on all orders placed before 2 PM." />
          <Value icon={<ShieldCheck className="h-6 w-6 text-sky-600" />} title="Secure Payment" desc="Industry-leading encryption protecting your data." />
          <Value icon={<RotateCcw className="h-6 w-6 text-sky-600" />} title="Easy Returns" desc="30-day no-questions-asked return policy." />
        </div>
      </section>

      {/* FEATURED */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <SectionHeader title="Featured Products" subtitle="Hand-picked items people love right now" ctaHref="/shop" ctaText="View all" />

        {errorMsg ? (
          <ErrBlock msg={errorMsg} />
        ) : featured.length === 0 ? (
          <EmptyProducts
            title="No featured products yet"
            desc="Add products from Admin and mark them as Featured."
          />
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* NEW ARRIVALS */}
      <section className="bg-[#f6f7f8] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader title="New Arrivals" subtitle="Fresh drops added recently — don’t miss out" ctaHref="/shop" ctaText="See what’s new" />

          {errorMsg ? (
            <ErrBlock msg={errorMsg} />
          ) : newArrivals.length === 0 ? (
            <EmptyProducts
              title="No products yet"
              desc="Upload your first products from Admin → Products."
            />
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {newArrivals.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}

          <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-lg font-black">Ready to shop?</div>
              <div className="text-sm text-slate-500">
                Browse everything in one place — filters, categories, and more.
              </div>
            </div>
            <a
              href="/shop"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-600 px-6 py-3 font-extrabold text-white hover:opacity-90 transition"
            >
              Go to Shop <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function EmptyProducts({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8">
      <div className="text-lg font-black">{title}</div>
      <div className="mt-1 text-sm text-slate-500">{desc}</div>
      <a
        href="/admin/products/new"
        className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-sky-600 px-5 py-3 text-sm font-extrabold text-white hover:opacity-90"
      >
        <Plus className="h-4 w-4" />
        Add a product
      </a>
    </div>
  );
}

function SectionHeader({
  title,
  subtitle,
  ctaHref,
  ctaText,
}: {
  title: string;
  subtitle: string;
  ctaHref: string;
  ctaText: string;
}) {
  return (
    <div className="flex items-end justify-between gap-4 mb-10">
      <div>
        <h2 className="text-3xl font-black">{title}</h2>
        <p className="text-slate-500 mt-2">{subtitle}</p>
      </div>
      <a className="hidden sm:flex items-center gap-2 text-sky-600 font-extrabold hover:gap-3 transition-all" href={ctaHref}>
        {ctaText} <ArrowRight className="h-4 w-4" />
      </a>
    </div>
  );
}

function Value({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col items-center text-center gap-3">
      <div className="w-14 h-14 rounded-full bg-sky-600/5 flex items-center justify-center">{icon}</div>
      <h4 className="font-black">{title}</h4>
      <p className="text-sm text-slate-500 max-w-xs">{desc}</p>
    </div>
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

function ErrBlock({ msg }: { msg: string }) {
  return (
    <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-rose-700">
      <div className="font-black">Couldn’t load products</div>
      <div className="mt-1 text-sm">{msg}</div>
      <div className="mt-4 text-sm text-rose-600">
        Check <code className="rounded bg-white px-2 py-1">NEXT_PUBLIC_API_URL</code> and backend CORS.
      </div>
    </div>
  );
}