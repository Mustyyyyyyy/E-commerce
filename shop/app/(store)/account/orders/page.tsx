"use client";

import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { apiClient } from "@/lib/api-client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { formatNaira } from "@/lib/format";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await apiClient<any[]>("/api/orders/mine");
        setOrders(data);
      } catch (e: any) {
        setErr(e.message || "Failed to load orders");
      }
    })();
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold">My Orders</h1>

        {err && <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-5 text-rose-700">{err}</div>}

        <div className="mt-6 space-y-3">
          {orders.map((o) => (
            <div key={o._id} className="rounded-2xl border border-slate-100 bg-white p-5 flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-500">Order</div>
                <div className="font-mono text-xs">{o._id}</div>
                <div className="mt-2 text-sm">
                  <span className="font-bold">{o.status}</span> • {formatNaira(o.total)}
                </div>
              </div>
              <Link href={`/order/${o._id}`} className="rounded-xl bg-sky-600 px-4 py-2 font-bold text-white">
                View
              </Link>
            </div>
          ))}
          {orders.length === 0 && !err && (
            <div className="rounded-2xl border border-slate-100 bg-white p-5 text-slate-600">
              No orders yet.
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}