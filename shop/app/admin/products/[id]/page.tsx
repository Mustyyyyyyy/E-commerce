"use client";

import Navbar from "@/components/shared/Navbar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar.tsx";
import ImageUploader from "@/components/admin/ImageUploader";
import { apiClient } from "@/lib/api-client";
import type { ProductCategory, ProductVariant } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

const CATEGORIES: { value: ProductCategory; label: string }[] = [
  { value: "electronics", label: "Electronics" },
  { value: "home-appliances", label: "Home Appliances" },
  { value: "fashion-beauty", label: "Fashion & Beauty" },
];

export default function AdminNewProductPage() {
  const router = useRouter();

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
      // validate variants
      for (const v of variants) {
        if (!v.name.trim() || !v.sku.trim()) return false;
        if (!Number.isFinite(v.stock) || v.stock < 0) return false;
        if (v.price !== undefined && (!Number.isFinite(v.price) || v.price < 0)) return false;
      }
    }
    return true;
  }, [name, description, price, images, stock, hasVariants, variants]);

  function addVariant() {
    setVariants((prev) => [
      ...prev,
      { name: "", sku: "", stock: 0, price: undefined },
    ]);
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

  async function createProduct() {
    setMsg("");
    if (!canSave) {
      setMsg("Please fill all required fields (including at least 1 image).");
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
          price: v.price === undefined || v.price === null || v.price === ("" as any) ? undefined : Number(v.price),
        }));
      } else {
        payload.stock = Number(stock);
      }

      const created = await apiClient<any>("/api/products", {
        method: "POST",
        json: payload,
      });

      router.push(`/admin/products/${created._id}`);
    } catch (e: any) {
      setMsg(e.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
          <AdminSidebar />

          <div className="space-y-6">
            <AdminTopbar />

            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-extrabold">Add Product</h1>
              <button
                onClick={createProduct}
                disabled={!canSave || loading}
                className="rounded-xl bg-sky-600 px-4 py-2 font-bold text-white hover:opacity-90 disabled:opacity-60"
              >
                {loading ? "Saving..." : "Save Product"}
              </button>
            </div>

            {msg && (
              <div className="rounded-2xl border border-slate-100 bg-white p-4 text-sm text-slate-700">
                {msg}
              </div>
            )}

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
              {/* Left: Form */}
              <div className="rounded-2xl border border-slate-100 bg-white p-5 space-y-4">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <Field label="Product name *">
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-xl bg-slate-100 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-sky-500"
                      placeholder="e.g. Wireless Headset"
                    />
                  </Field>

                  <Field label="Brand (optional)">
                    <input
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      className="w-full rounded-xl bg-slate-100 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-sky-500"
                      placeholder="e.g. Sony"
                    />
                  </Field>

                  <Field label="Category *">
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as ProductCategory)}
                      className="w-full rounded-xl bg-slate-100 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-sky-500"
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
                      className="w-full rounded-xl bg-slate-100 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-sky-500"
                      placeholder="e.g. 45000"
                    />
                  </Field>
                </div>

                <Field label="Description * (min 10 chars)">
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="min-h-[120px] w-full rounded-xl bg-slate-100 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-sky-500"
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
                  <label htmlFor="featured" className="text-sm font-bold">
                    Featured product
                  </label>
                </div>

                {/* Stock OR Variants */}
                <div className="rounded-2xl border border-slate-100 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-extrabold">Inventory</div>
                      <div className="text-xs text-slate-500">
                        Use base stock for simple products, or variants for sizes/colors.
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={addVariant}
                      className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-bold text-white"
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
                          className="w-full rounded-xl bg-slate-100 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-sky-500"
                          placeholder="e.g. 20"
                        />
                      </Field>
                    </div>
                  ) : (
                    <div className="mt-4 space-y-3">
                      {variants.map((v, idx) => (
                        <div key={idx} className="rounded-2xl bg-slate-50 p-4">
                          <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                            <input
                              value={v.name}
                              onChange={(e) => updateVariant(idx, { name: e.target.value })}
                              className="rounded-xl bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-500"
                              placeholder='Variant name e.g. "Color: Black / Size: M"'
                            />
                            <input
                              value={v.sku}
                              onChange={(e) => updateVariant(idx, { sku: e.target.value })}
                              className="rounded-xl bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-500"
                              placeholder="SKU e.g. BLK-M"
                            />
                            <input
                              value={String(v.stock ?? 0)}
                              onChange={(e) => updateVariant(idx, { stock: Number(e.target.value || 0) })}
                              inputMode="numeric"
                              className="rounded-xl bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-500"
                              placeholder="Stock"
                            />
                            <input
                              value={v.price === undefined ? "" : String(v.price)}
                              onChange={(e) =>
                                updateVariant(idx, {
                                  price: e.target.value === "" ? undefined : Number(e.target.value),
                                })
                              }
                              inputMode="numeric"
                              className="rounded-xl bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-500"
                              placeholder="Price override (optional)"
                            />
                          </div>

                          <div className="mt-3 flex justify-end">
                            <button
                              type="button"
                              onClick={() => removeVariant(idx)}
                              className="rounded-xl bg-rose-600 px-3 py-2 text-xs font-bold text-white"
                            >
                              Remove variant
                            </button>
                          </div>
                        </div>
                      ))}

                      <div className="text-xs text-slate-500">
                        Note: When variants exist, base stock is ignored.
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Images */}
              <div className="space-y-4">
                <ImageUploader
                  onUploaded={(urls) => setImages((prev) => [...prev, ...urls])}
                />

                <div className="rounded-2xl border border-slate-100 bg-white p-5">
                  <div className="font-extrabold">Images *</div>
                  <div className="mt-1 text-xs text-slate-500">
                    Upload 1–8 images. These URLs are saved in <b>images[]</b> so every product is unique.
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-3">
                    {images.map((url) => (
                      <div key={url} className="relative">
                        <img
                          src={url}
                          alt="product"
                          className="h-24 w-full rounded-xl object-cover bg-slate-100"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(url)}
                          className="absolute right-2 top-2 rounded-full bg-black/70 px-2 py-1 text-[10px] font-bold text-white"
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

                <div className="rounded-2xl border border-slate-100 bg-white p-5">
                  <div className="font-extrabold">Quick rules</div>
                  <ul className="mt-3 list-disc pl-5 text-sm text-slate-600 space-y-1">
                    <li>Name, description, price, category are required</li>
                    <li>At least 1 image is required</li>
                    <li>Use variants for sizes/colors (optional)</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={createProduct}
                disabled={!canSave || loading}
                className="rounded-xl bg-sky-600 px-5 py-3 font-bold text-white hover:opacity-90 disabled:opacity-60"
              >
                {loading ? "Saving..." : "Save Product"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 text-xs font-bold text-slate-600">{label}</div>
      {children}
    </div>
  );
}