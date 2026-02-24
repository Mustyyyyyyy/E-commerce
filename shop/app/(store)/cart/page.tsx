"use client";

import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import EmptyState from "@/components/shared/EmptyState";
import { useCartStore } from "@/store/cart.store";
import Link from "next/link";
import { formatNaira } from "@/lib/format";

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal());
  const removeItem = useCartStore((s) => s.removeItem);
  const setQty = useCartStore((s) => s.setQty);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold">Cart</h1>

        {items.length === 0 ? (
          <div className="mt-6">
            <EmptyState
              title="Your cart is empty"
              desc="Browse products and add items to cart."
              action={
                <Link href="/shop" className="inline-block rounded-xl bg-sky-600 px-5 py-3 font-bold text-white">
                  Go to Shop
                </Link>
              }
            />
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
              {items.map((i) => (
                <div key={`${i.productId}::${i.variantSku || ""}`} className="rounded-2xl border border-slate-100 bg-white p-4">
                  <div className="flex gap-4">
                    <img src={i.image} className="h-20 w-20 rounded-xl object-cover bg-slate-100" alt={i.name} />
                    <div className="flex-1">
                      <div className="font-bold">{i.name}</div>
                      {i.variantName && <div className="text-xs text-slate-500 mt-1">{i.variantName}</div>}
                      <div className="mt-2 text-sky-600 font-black">{formatNaira(i.unitPrice)}</div>

                      <div className="mt-3 flex items-center gap-3">
                        <input
                          className="w-20 rounded-xl bg-slate-100 px-3 py-2 text-sm outline-none"
                          type="number"
                          min={1}
                          value={i.quantity}
                          onChange={(e) => setQty({ productId: i.productId, variantSku: i.variantSku }, Number(e.target.value))}
                        />
                        <button
                          onClick={() => removeItem({ productId: i.productId, variantSku: i.variantSku })}
                          className="text-sm font-bold text-rose-600 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <div className="font-bold">{formatNaira(i.unitPrice * i.quantity)}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-5 h-fit">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Subtotal</span>
                <span className="font-black">{formatNaira(subtotal)}</span>
              </div>

              <Link
                href="/checkout"
                className="mt-5 block w-full rounded-xl bg-sky-600 px-5 py-3 text-center font-bold text-white hover:opacity-90"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}