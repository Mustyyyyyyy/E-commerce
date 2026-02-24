"use client";

import Navbar from "@/components/shared/Navbar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar.tsx";
import { apiClient } from "@/lib/api-client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { formatNaira } from "@/lib/format";

export default function AdminProductsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [err, setErr] = useState("");

  async function load() {
    setErr("");
    try {
      const data = await apiClient<any[]>("/api/products/admin/all");
      setItems(data);
    } catch (e: any) {
      setErr(e.message || "Failed to load products");
    }
  }

  async function del(id: string) {
    if (!confirm("Delete product?")) return;
    try {
      await apiClient(`/api/products/${id}`, { method: "DELETE" });
      load();
    } catch (e: any) {
      alert(e.message || "Delete failed");
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
          <AdminSidebar />
          <div className="space-y-6">
            <AdminTopbar />

            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-extrabold">Products</h1>
              <Link href="/admin/products/new" className="rounded-xl bg-sky-600 px-4 py-2 font-bold text-white">
                Add product
              </Link>
            </div>

            {err && <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-rose-700">{err}</div>}

            <div className="rounded-2xl border border-slate-100 bg-white overflow-hidden">
              <div className="divide-y divide-slate-100">
                {items.map((p) => (
                  <div key={p._id} className="p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img src={p.images?.[0] || "/placeholders/product.png"} className="h-12 w-12 rounded-xl object-cover bg-slate-100" />
                      <div>
                        <div className="font-bold">{p.name}</div>
                        <div className="text-xs text-slate-500">{formatNaira(p.price)} • {p.category}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link href={`/admin/products/${p._id}`} className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-bold">
                        Edit
                      </Link>
                      <button onClick={() => del(p._id)} className="rounded-xl bg-rose-600 px-3 py-2 text-sm font-bold text-white">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
                {!items.length && <div className="p-5 text-slate-500">No products yet.</div>}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}