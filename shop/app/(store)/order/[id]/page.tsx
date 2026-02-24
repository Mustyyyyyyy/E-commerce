"use client";

import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import RequireAuth from "@/components/shared/RequireAuth";
import { apiClient } from "@/lib/api-client";
import { useEffect, useState } from "react";
import { formatNaira } from "@/lib/format";

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  return (
    <RequireAuth>
      <OrderInner id={params.id} />
    </RequireAuth>
  );
}

function OrderInner({ id }: { id: string }) {
  const [order, setOrder] = useState<any>(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await apiClient<any>(`/api/orders/${id}`);
        setOrder(data);
      } catch (e: any) {
        setErr(e.message || "Failed to load order");
      }
    })();
  }, [id]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold">Order Details</h1>

        {err && <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-5 text-rose-700">{err}</div>}
        {!order && !err && <div className="mt-6 rounded-2xl border border-slate-100 bg-white p-5">Loading...</div>}

        {order && (
          <div className="mt-6 rounded-2xl border border-slate-100 bg-white p-5">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Order ID</span>
              <span className="font-mono text-xs">{order._id}</span>
            </div>
            <div className="mt-3 flex justify-between text-sm">
              <span className="text-slate-500">Status</span>
              <span className="font-bold">{order.status}</span>
            </div>
            <div className="mt-3 flex justify-between text-sm">
              <span className="text-slate-500">Payment</span>
              <span className="font-bold">{order.payment?.status}</span>
            </div>

            <div className="mt-5 border-t border-slate-100 pt-4">
              <h3 className="font-bold">Items</h3>
              <div className="mt-3 space-y-3">
                {order.items.map((i: any) => (
                  <div key={`${i.productId}::${i.variantSku || ""}`} className="flex items-center gap-3">
                    <img src={i.image} className="h-12 w-12 rounded-xl object-cover bg-slate-100" alt={i.name} />
                    <div className="flex-1">
                      <div className="font-bold">{i.name}</div>
                      <div className="text-xs text-slate-500">Qty: {i.quantity}</div>
                    </div>
                    <div className="font-bold">{formatNaira(i.unitPrice * i.quantity)}</div>
                  </div>
                ))}
              </div>

              <div className="mt-5 border-t border-slate-100 pt-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-slate-600">Subtotal</span><span className="font-bold">{formatNaira(order.subtotal)}</span></div>
                <div className="flex justify-between"><span className="text-slate-600">Discount</span><span className="font-bold">{formatNaira(order.discount || 0)}</span></div>
                <div className="flex justify-between"><span className="text-slate-600">Total</span><span className="font-black">{formatNaira(order.total)}</span></div>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}