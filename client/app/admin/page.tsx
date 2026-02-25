"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import Navbar from "@/components/shared/Navbar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";
import ManualImageUrls from "@/components/admin/ManualImageUrls";

import { apiClient } from "@/lib/api-client";
import type { ProductCategory, ProductVariant } from "@/lib/types";

const CATEGORIES: { value: ProductCategory; label: string }[] = [
  { value: "electronics", label: "Electronics" },
  { value: "home-appliances", label: "Home Appliances" },
  { value: "fashion-beauty", label: "Fashion & Beauty" },
];

export default function AdminNewProductPage() {
  const router = useRouter();

  // ✅ warm Render backend when this page loads
  useEffect(() => {
    apiClient("/api/health", { timeoutMs: 90000 }).catch(() => {});
  }, []);

  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState<ProductCategory>("electronics");
  const [price, setPrice] = useState<string>("");
  const [description, setDescription] = useState("");
  const [featured, setFeatured] = useState(false);

  const [images, setImages] = useState<string[]>([]);
  const [stock, setStock] = useState<string>("0");
  const [variants, setVariants] = useState<ProductVariant[]>([]);

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const hasVariants = variants.length > 0;

  const canSave = useMemo(() => {
    const p = Number(price);
    const s = Number(stock);

    if (!name.trim()) return false;
    if (description.trim().length < 10) return false;
    if (!Number.isFinite(p) || p < 0) return false;
    if (images.length < 1) return false;

    if (!hasVariants) {
      if (!Number.isFinite(s) || s < 0) return false;
    } else {
      for (const v of variants) {
        if (!v.name.trim() || !v.sku.trim()) return false;
        if (!Number.isFinite(Number(v.stock)) || Number(v.stock) < 0) return false;
        if (v.price !== undefined && (!Number.isFinite(Number(v.price)) || Number(v.price) < 0)) return false;
      }
    }
    return true;
  }, [name, description, price, images, stock, hasVariants, variants]);

  function addVariant() {
    setVariants((prev) => [...prev, { name: "", sku: "", stock: 0, price: undefined }]);
  }

  function updateVariant(i: number, patch: Partial<ProductVariant>) {
    setVariants((prev) => prev.map((v, idx) => (idx === i ? { ...v, ...patch } : v)));
  }

  function removeVariant(i: number) {
    setVariants((prev) => prev.filter((_, idx) => idx !== i));
  }

  function removeImage(url: string) {
    setImages((prev) => prev.filter((x) => x !== url));
  }

  async function createProduct(e?: React.FormEvent) {
    e?.preventDefault();
    setMsg("");

    if (!canSave) {
      setMsg("Fill all required fields (name, price, description, and at least 1 image URL).");
      return;
    }

    setLoading(true);

    try {
      const payload: any = {
        name: name.trim(),
        brand: brand.trim() || undefined,
        category,
        price: Number(price),
        description: description.trim(),
        images,
        featured,
      };

      if (hasVariants) {
        payload.variants = variants.map((v) => ({
          name: v.name.trim(),
          sku: v.sku.trim(),
          stock: Number(v.stock),
          price:
            v.price === undefined || v.price === null || (v.price as any) === ""
              ? undefined
              : Number(v.price),
        }));
      } else {
        payload.stock = Number(stock);
      }

      // ✅ long timeout so Render can wake up
      const created = await apiClient<any>("/api/products", {
        method: "POST",
        json: payload,
        timeoutMs: 90000,
      });

      // ✅ redirect to admin UI (not backend route)
      router.push("/admin/products");
    } catch (e: any) {
      console.log("CREATE PRODUCT ERROR:", e);
      setMsg(e?.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f6f7f8]">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
          <AdminSidebar />

          <div className="space-y-6">
            <AdminTopbar />

            <form onSubmit={createProduct} className="space-y-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-2xl font-black text-slate-900">Add Product</h1>
                  <p className="mt-1 text-sm text-slate-500">Paste at least 1 image URL.</p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={[
                    "rounded-2xl px-5 py-3 text-sm font-extrabold text-white shadow-lg transition",
                    loading ? "bg-slate-400" : canSave ? "bg-sky-600 hover:opacity-90" : "bg-sky-600/60",
                  ].join(" ")}
                  onClick={(e) => {
                    if (!canSave && !loading) {
                      e.preventDefault();
                      setMsg("Cannot save yet: complete required fields + add an image URL.");
                    }
                  }}
                >
                  {loading ? "Saving..." : "Save Product"}
                </button>
              </div>

              {msg && (
                <div className="rounded-3xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
                  {msg}
                </div>
              )}

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
                {/* Left */}
                <div className="rounded-3xl border border-slate-200 bg-white p-5 space-y-4">
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <Field label="Product name *">
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full rounded-2xl bg-slate-100 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-sky-500"
                        placeholder="e.g. Wireless Headset"
                      />
                    </Field>

                    <Field label="Brand (optional)">
                      <input
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        className="w-full rounded-2xl bg-slate-100 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-sky-500"
                        placeholder="e.g. Sony"
                      />
                    </Field>

                    <Field label="Category *">
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as ProductCategory)}
                        className="w-full rounded-2xl bg-slate-100 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-sky-500"
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c.value} value={c.value}>
                            {c.label}
                          </option>
                        ))}
                      </select>
                    </Field>

                    <Field label="Price (₦) *">
                      <input
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        inputMode="numeric"
                        className="w-full rounded-2xl bg-slate-100 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-sky-500"
                        placeholder="e.g. 45000"
                      />
                    </Field>
                  </div>

                  <Field label="Description * (min 10 chars)">
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="min-h-[120px] w-full rounded-2xl bg-slate-100 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-sky-500"
                      placeholder="Write a strong product description..."
                    />
                  </Field>

                  <div className="flex items-center gap-3">
                    <input
                      id="featured"
                      type="checkbox"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                      className="h-4 w-4"
                    />
                    <label htmlFor="featured" className="text-sm font-extrabold">
                      Featured product
                    </label>
                  </div>

                  <div className="rounded-3xl border border-slate-200 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-black">Inventory</div>
                        <div className="text-xs text-slate-500">
                          Use base stock or add variants.
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={addVariant}
                        className="rounded-2xl bg-slate-900 px-3 py-2 text-xs font-extrabold text-white"
                      >
                        + Add Variant
                      </button>
                    </div>

                    {!hasVariants ? (
                      <div className="mt-4">
                        <Field label="Stock (base) *">
                          <input
                            value={stock}
                            onChange={(e) => setStock(e.target.value)}
                            inputMode="numeric"
                            className="w-full rounded-2xl bg-slate-100 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-sky-500"
                            placeholder="e.g. 20"
                          />
                        </Field>
                      </div>
                    ) : (
                      <div className="mt-4 space-y-3">
                        {variants.map((v, idx) => (
                          <div key={idx} className="rounded-3xl bg-slate-50 p-4">
                            <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                              <input
                                value={v.name}
                                onChange={(e) => updateVariant(idx, { name: e.target.value })}
                                className="rounded-2xl bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-500"
                                placeholder='Variant name e.g. "Color: Black / Size: M"'
                              />
                              <input
                                value={v.sku}
                                onChange={(e) => updateVariant(idx, { sku: e.target.value })}
                                className="rounded-2xl bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-500"
                                placeholder="SKU e.g. BLK-M"
                              />
                              <input
                                value={String(v.stock ?? 0)}
                                onChange={(e) => updateVariant(idx, { stock: Number(e.target.value || 0) })}
                                inputMode="numeric"
                                className="rounded-2xl bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-500"
                                placeholder="Stock"
                              />
                              <input
                                value={v.price === undefined ? "" : String(v.price)}
                                onChange={(e) =>
                                  updateVariant(idx, { price: e.target.value === "" ? undefined : Number(e.target.value) })
                                }
                                inputMode="numeric"
                                className="rounded-2xl bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-500"
                                placeholder="Price override (optional)"
                              />
                            </div>

                            <div className="mt-3 flex justify-end">
                              <button
                                type="button"
                                onClick={() => removeVariant(idx)}
                                className="rounded-2xl bg-rose-600 px-3 py-2 text-xs font-extrabold text-white"
                              >
                                Remove variant
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right */}
                <div className="space-y-4">
                  <ManualImageUrls value={images} onChange={setImages} />

                  <div className="rounded-3xl border border-slate-200 bg-white p-5">
                    <div className="font-black">Images *</div>
                    <div className="mt-1 text-xs text-slate-500">At least 1 image URL required.</div>

                    <div className="mt-4 grid grid-cols-3 gap-3">
                      {images.map((url) => (
                        <div key={url} className="relative">
                          <img
                            src={url}
                            alt="product"
                            className="h-24 w-full rounded-2xl object-cover bg-slate-100 border border-slate-200"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(url)}
                            className="absolute right-2 top-2 rounded-full bg-black/70 px-2 py-1 text-[10px] font-black text-white"
                          >
                            X
                          </button>
                        </div>
                      ))}
                    </div>

                    {images.length === 0 && (
                      <div className="mt-4 text-sm text-slate-500">No images yet.</div>
                    )}
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 text-xs font-extrabold text-slate-600">{label}</div>
      {children}
    </div>
  );
}