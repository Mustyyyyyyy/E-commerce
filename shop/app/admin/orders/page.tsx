"use client";

import Navbar from "@/components/shared/Navbar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";
import { apiClient } from "@/lib/api-client";
import { formatNaira } from "@/lib/format";
import Link from "next/link";
import { useEffect, useState } from "react";

const STATUSES = ["", "pending", "processing", "shipped", "delivered", "cancelled", "refunded"] as const;

export default function AdminOrdersPage() {
  const [status, setStatus] = useState<string>("");
  const [orders, setOrders] = useState<any[]>([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function load(nextStatus?: string) {
    setErr("");
    setLoading(true);
    try {
      const s = nextStatus !== undefined ? nextStatus : status;
      const qs = s ? `?status=${encodeURIComponent(s)}` : "";
      const data = await apiClient<any[]>(`/api/orders/admin/all/list${qs}`);
      setOrders(data);
    } catch (e: any) {
      setErr(e.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
          <AdminSidebar />

          <div className="space-y-6">
            <AdminTopbar />

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h1 className="text-2xl font-extrabold">Orders</h1>

              <div className="flex gap-2">
                <select
                  value={status}
                  onChange={(e) => {
                    const v = e.target.value;
                    setStatus(v);
                    load(v);
                  }}
                  className="rounded-xl bg-white border border-slate-200 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-500"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s ? `Status: ${s}` : "All statuses"}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => load()}
                  className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white"
                >
                  Refresh
                </button>
              </div>
            </div>

            {err && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-rose-700">
                {err}
              </div>
            )}

            <div className="rounded-2xl border border-slate-100 bg-white overflow-hidden">
              <div className="divide-y divide-slate-100">
                {loading && <div className="p-5 text-slate-500">Loading...</div>}

                {!loading && orders.map((o) => (
                  <div key={o._id} className="p-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="font-mono text-xs text-slate-500">{o._id}</div>
                      <div className="mt-1 text-sm">
                        <span className="font-bold">{o.userId?.name || "Customer"}</span>{" "}
                        <span className="text-slate-500">({o.userId?.email || "—"})</span>
                      </div>
                      <div className="mt-1 text-xs text-slate-500">
                        Status: <span className="font-bold text-slate-700">{o.status}</span> • Payment:{" "}
                        <span className="font-bold text-slate-700">{o.payment?.status}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 md:justify-end">
                      <div className="font-extrabold text-slate-900">{formatNaira(o.total)}</div>
                      <Link
                        href={`/admin/orders/${o._id}`}
                        className="rounded-xl bg-sky-600 px-4 py-2 text-sm font-bold text-white"
                      >
                        Manage
                      </Link>
                    </div>
                  </div>
                ))}

                {!loading && orders.length === 0 && (
                  <div className="p-5 text-slate-500">No orders found.</div>
                )}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}