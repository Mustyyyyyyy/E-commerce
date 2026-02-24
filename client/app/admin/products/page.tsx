"use client";

import Navbar from "@/components/shared/Navbar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";
import { apiClient } from "@/lib/api-client";
import { formatNaira } from "@/lib/format";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Search, Plus, Trash2, Pencil, Tag } from "lucide-react";

type ProductLite = {
  _id: string;
  name: string;
  category: string;
  price: number;
  images?: string[];
  featured?: boolean;
};

export default function AdminProductsPage() {
  const [items, setItems] = useState<ProductLite[]>([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  const [q, setQ] = useState("");
  const [category, setCategory] = useState<string>("");

  async function load() {
    setErr("");
    setLoading(true);
    try {
      const data = await apiClient<ProductLite[]>("/api/products/admin/all");
      setItems(data || []);
    } catch (e: any) {
      setErr(e.message || "Failed to load products");
    } finally {
      setLoading(false);
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

  useEffect(() => {
    load();
  }, []);

  const categories = useMemo(() => {
    const set = new Set(items.map((p) => p.category).filter(Boolean));
    return Array.from(set).sort();
  }, [items]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return items.filter((p) => {
      const okQ = !query || p.name.toLowerCase().includes(query);
      const okC = !category || p.category === category;
      return okQ && okC;
    });
  }, [items, q, category]);

  return (
    <div className="min-h-screen bg-[#f6f7f8]">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
          <AdminSidebar />

          <div className="space-y-6">
            <AdminTopbar onRefresh={load} />

            {/* Header row */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-black text-slate-900">Products</h1>
                <p className="mt-1 text-sm text-slate-500">
                  Manage your catalog. Upload multiple images so products don’t look the same.
                </p>
              </div>

              <Link
                href="/admin/products/new"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-600 px-4 py-2.5 text-sm font-extrabold text-white shadow-lg shadow-sky-600/20 hover:opacity-90"
              >
                <Plus className="h-4 w-4" />
                Add product
              </Link>
            </div>

            {/* Error */}
            {err && (
              <div className="rounded-3xl border border-rose-200 bg-rose-50 p-5 text-rose-700">
                <div className="font-extrabold">Something went wrong</div>
                <div className="mt-1 text-sm">{err}</div>
              </div>
            )}

            {/* Filters */}
            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_260px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    className="w-full rounded-2xl bg-slate-100 pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="Search by product name..."
                  />
                </div>

                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-2xl bg-slate-100 pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="">All categories</option>
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-3 text-xs text-slate-500">
                Showing <b>{filtered.length}</b> of <b>{items.length}</b> products
              </div>
            </div>

            {/* List */}
            <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              {loading ? (
                <div className="p-6 text-slate-500">Loading products...</div>
              ) : filtered.length === 0 ? (
                <div className="p-8">
                  <div className="text-lg font-black text-slate-900">No products found</div>
                  <div className="mt-1 text-sm text-slate-500">
                    Try a different search or add your first product.
                  </div>
                  <Link
                    href="/admin/products/new"
                    className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-sky-600 px-5 py-3 text-sm font-extrabold text-white hover:opacity-90"
                  >
                    <Plus className="h-4 w-4" />
                    Add product
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {filtered.map((p) => (
                    <div
                      key={p._id}
                      className="p-4 sm:p-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={p.images?.[0] || "/placeholders/product.png"}
                          alt={p.name}
                          className="h-14 w-14 rounded-2xl object-cover bg-slate-100 border border-slate-200"
                        />

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <div className="font-extrabold text-slate-900">{p.name}</div>
                            {p.featured && (
                              <span className="rounded-full bg-sky-600 px-2.5 py-1 text-[10px] font-black text-white">
                                Featured
                              </span>
                            )}
                          </div>

                          <div className="mt-1 text-xs text-slate-500">
                            {formatNaira(p.price)} • {p.category}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 justify-end">
                        <Link
                          href={`/admin/products/${p._id}`}
                          className="inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-2.5 text-sm font-extrabold text-slate-900 hover:bg-slate-200"
                        >
                          <Pencil className="h-4 w-4" />
                          Edit
                        </Link>

                        <button
                          onClick={() => del(p._id)}
                          className="inline-flex items-center gap-2 rounded-2xl bg-rose-600 px-4 py-2.5 text-sm font-extrabold text-white hover:opacity-90"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Small footer spacing */}
            <div className="h-2" />
          </div>
        </div>
      </main>
    </div>
  );
}