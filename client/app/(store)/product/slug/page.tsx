import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import ProductGallery from "@/components/store/ProductGallery";
import AddToCartPanel from "@/components/store/AddToCartPanel";
import { apiGet } from "@/lib/api";
import type { Product } from "@/lib/types";

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await apiGet<Product>(`/api/products/slug/${params.slug}`);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <ProductGallery images={product.images || []} name={product.name} />
          <div>
            <h1 className="text-4xl font-extrabold">{product.name}</h1>
            <p className="mt-3 text-slate-600">{product.description}</p>
            <div className="mt-6"><AddToCartPanel product={product} /></div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}