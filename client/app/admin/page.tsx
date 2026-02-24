"use client";

import Navbar from "@/components/shared/Navbar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";
import StatCard from "@/components/admin/StatCard";
import { apiClient } from "@/lib/api-client";
import { useEffect, useState } from "react";
import { formatNaira } from "@/lib/format";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await apiClient<any>("/api/admin/stats");
        setStats(data);
      } catch (e: any) {
        setErr(e.message || "Failed to load stats");
      }
    })();
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
          <AdminSidebar />

          <div className="space-y-6">
            <AdminTopbar />

            {err && <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-rose-700">{err}</div>}

            {stats && (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <StatCard label="Orders" value={stats.orders} />
                  <StatCard label="Products" value={stats.products} />
                  <StatCard label="Customers" value={stats.customers} />
                  <StatCard label="Revenue (paid)" value={formatNaira(stats.revenue || 0)} />
                </div>

                <div className="rounded-2xl border border-slate-100 bg-white p-5">
                  <div className="font-extrabold">Low stock</div>
                  <div className="mt-4 space-y-2 text-sm">
                    {stats.lowStock?.length ? (
                      stats.lowStock.map((p: any) => (
                        <div key={p._id} className="flex items-center justify-between">
                          <span className="font-bold">{p.name}</span>
                          <span className="text-slate-500">
                            base: {p.stock ?? 0} • variants: {p.variants?.length ?? 0}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="text-slate-500">No low-stock items.</div>
                    )}
                  </div>
                </div>
              </>
            )}

            {!stats && !err && <div className="rounded-2xl border border-slate-100 bg-white p-5">Loading...</div>}
          </div>
        </div>
      </main>
    </div>
  );
}