import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import ProductCard from "@/components/store/ProductCard";
import { apiGet } from "@/lib/api";
import type { ProductCategory, ProductsResponse } from "@/lib/types";
import { notFound } from "next/navigation";

const allowed: ProductCategory[] = ["electronics", "home-appliances", "fashion-beauty"];

function titleOf(slug: ProductCategory) {
  if (slug === "electronics") return "Electronics";
  if (slug === "home-appliances") return "Home Appliances";
  return "Fashion & Beauty";
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const slug = params.slug as ProductCategory;
  if (!allowed.includes(slug)) return notFound();

  const data = await apiGet<ProductsResponse>(`/api/products?category=${slug}&limit=12`);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold">{titleOf(slug)}</h1>
        <p className="mt-1 text-sm text-slate-500">Explore our {titleOf(slug)} collection.</p>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {data.items.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      </main>
      <Footer />
    </div>
  );
}