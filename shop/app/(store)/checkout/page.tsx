"use client";

import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import RequireAuth from "@/components/shared/RequireAuth";
import { useCartStore } from "@/store/cart.store";
import { apiClient } from "@/lib/api-client";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { formatNaira } from "@/lib/format";

export default function CheckoutPage() {
  return (
    <RequireAuth>
      <CheckoutInner />
    </RequireAuth>
  );
}

function CheckoutInner() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal());
  const clear = useCartStore((s) => s.clear);

  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const [shipping, setShipping] = useState({
    fullName: "",
    phone: "",
    address1: "",
    city: "Ogbomoso",
    state: "Oyo",
    country: "Nigeria",
    notes: "",
  });

  const total = useMemo(() => Math.max(0, subtotal - discount), [subtotal, discount]);

  async function applyCoupon() {
    setMsg("");
    try {
      const res = await apiClient<{ valid: true; discount: number }>(`/api/coupons/validate`, {
        method: "POST",
        json: { code: coupon, subtotal },
      });
      setDiscount(res.discount || 0);
      setMsg("Coupon applied ✅");
    } catch (e: any) {
      setDiscount(0);
      setMsg(e.message || "Invalid coupon");
    }
  }

  async function placeOrder() {
    if (items.length === 0) return setMsg("Cart is empty");
    setLoading(true);
    setMsg("");

    try {
      const payload = {
        items: items.map((i) => ({
          productId: i.productId,
          name: i.name,
          image: i.image,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
          variantSku: i.variantSku,
        })),
        shippingAddress: shipping,
        couponCode: coupon.trim() ? coupon.trim().toUpperCase() : undefined,
        shippingFee: 0,
      };

      const order = await apiClient<any>(`/api/orders`, { method: "POST", json: payload });
      clear();
      router.push(`/order/${order._id}`);
    } catch (e: any) {
      setMsg(e.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold">Checkout</h1>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-2xl border border-slate-100 bg-white p-5">
            <h2 className="text-lg font-bold">Shipping details</h2>

            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
              {(["fullName", "phone", "address1", "city", "state", "country"] as const).map((k) => (
                <input
                  key={k}
                  value={(shipping as any)[k]}
                  onChange={(e) => setShipping((s) => ({ ...s, [k]: e.target.value }))}
                  className="rounded-xl bg-slate-100 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder={k}
                />
              ))}
              <textarea
                value={shipping.notes}
                onChange={(e) => setShipping((s) => ({ ...s, notes: e.target.value }))}
                className="md:col-span-2 rounded-xl bg-slate-100 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="Notes (optional)"
              />
            </div>

            <div className="mt-6 flex gap-2">
              <input
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                className="flex-1 rounded-xl bg-slate-100 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="Coupon code (optional)"
              />
              <button onClick={applyCoupon} className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white">
                Apply
              </button>
            </div>

            {msg && <div className="mt-3 text-sm text-slate-600">{msg}</div>}
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 h-fit">
            <h2 className="text-lg font-bold">Summary</h2>

            <div className="mt-4 space-y-2 text-sm">
              <Row label="Subtotal" value={formatNaira(subtotal)} />
              <Row label="Discount" value={`- ${formatNaira(discount)}`} />
              <div className="border-t border-slate-100 pt-3" />
              <Row label="Total" value={formatNaira(total)} strong />
            </div>

            <button
              disabled={loading}
              onClick={placeOrder}
              className="mt-5 w-full rounded-xl bg-sky-600 px-5 py-3 font-bold text-white hover:opacity-90 disabled:opacity-60"
            >
              {loading ? "Placing order..." : "Place Order"}
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-600">{label}</span>
      <span className={strong ? "font-black" : "font-bold"}>{value}</span>
    </div>
  );
}