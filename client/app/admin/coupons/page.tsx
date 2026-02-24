"use client";

import Navbar from "@/components/shared/Navbar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";
import { apiClient } from "@/lib/api-client";
import { formatNaira } from "@/lib/format";
import { useEffect, useState } from "react";

type CouponType = "percent" | "fixed";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [err, setErr] = useState("");

  const [code, setCode] = useState("");
  const [type, setType] = useState<CouponType>("percent");
  const [value, setValue] = useState<string>("");
  const [minSpend, setMinSpend] = useState<string>("");
  const [usageLimit, setUsageLimit] = useState<string>("");
  const [expiresDate, setExpiresDate] = useState<string>(""); // yyyy-mm-dd
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function load() {
    setErr("");
    try {
      const data = await apiClient<any[]>("/api/coupons");
      setCoupons(data);
    } catch (e: any) {
      setErr(e.message || "Failed to load coupons");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function create() {
    setMsg("");
    setLoading(true);
    try {
      if (!code.trim()) throw new Error("Coupon code is required");
      const v = Number(value);
      if (!Number.isFinite(v) || v <= 0) throw new Error("Value must be > 0");

      const payload: any = {
        code: code.trim().toUpperCase(),
        type,
        value: v,
        active: true,
      };

      if (minSpend.trim()) payload.minSpend = Number(minSpend);
      if (usageLimit.trim()) payload.usageLimit = Number(usageLimit);

      // backend expects datetime string if provided
      if (expiresDate) {
        payload.expiresAt = new Date(expiresDate).toISOString();
      }

      await apiClient("/api/coupons", { method: "POST", json: payload });

      setCode("");
      setValue("");
      setMinSpend("");
      setUsageLimit("");
      setExpiresDate("");
      setMsg("Coupon created ✅");
      load();
    } catch (e: any) {
      setMsg(e.message || "Create failed");
    } finally {
      setLoading(false);
    }
  }

  async function toggle(id: string) {
    try {
      await apiClient(`/api/coupons/${id}/toggle`, { method: "PATCH" });
      load();
    } catch (e: any) {
      alert(e.message || "Toggle failed");
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
              <h1 className="text-2xl font-extrabold">Coupons</h1>
              <button
                onClick={load}
                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white"
              >
                Refresh
              </button>
            </div>

            {err && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-rose-700">
                {err}
              </div>
            )}

            {/* Create */}
            <div className="rounded-2xl border border-slate-100 bg-white p-5">
              <div className="font-extrabold">Create coupon</div>

              <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-6">
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="md:col-span-2 rounded-xl bg-slate-100 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="CODE e.g. SAVE10"
                />

                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as CouponType)}
                  className="rounded-xl bg-slate-100 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="percent">percent (%)</option>
                  <option value="fixed">fixed (₦)</option>
                </select>

                <input
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  inputMode="numeric"
                  className="rounded-xl bg-slate-100 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder={type === "percent" ? "Value e.g. 10" : "Value e.g. 2000"}
                />

                <input
                  value={minSpend}
                  onChange={(e) => setMinSpend(e.target.value)}
                  inputMode="numeric"
                  className="rounded-xl bg-slate-100 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="Min spend (optional)"
                />

                <input
                  value={usageLimit}
                  onChange={(e) => setUsageLimit(e.target.value)}
                  inputMode="numeric"
                  className="rounded-xl bg-slate-100 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="Usage limit (optional)"
                />
              </div>

              <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
                <div>
                  <div className="mb-2 text-xs font-bold text-slate-600">Expires (optional)</div>
                  <input
                    type="date"
                    value={expiresDate}
                    onChange={(e) => setExpiresDate(e.target.value)}
                    className="w-full rounded-xl bg-slate-100 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              {msg && <div className="mt-3 text-sm text-slate-600">{msg}</div>}

              <button
                onClick={create}
                disabled={loading}
                className="mt-5 rounded-xl bg-sky-600 px-5 py-3 font-bold text-white hover:opacity-90 disabled:opacity-60"
              >
                {loading ? "Creating..." : "Create coupon"}
              </button>
            </div>

            {/* List */}
            <div className="rounded-2xl border border-slate-100 bg-white overflow-hidden">
              <div className="p-5 font-extrabold">All coupons</div>
              <div className="divide-y divide-slate-100">
                {coupons.map((c) => {
                  const label =
                    c.type === "percent"
                      ? `${c.value}% OFF`
                      : `${formatNaira(c.value)} OFF`;

                  return (
                    <div key={c._id} className="p-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                      <div>
                        <div className="font-bold">
                          {c.code} <span className="text-slate-500">• {label}</span>
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          Active: <b>{String(c.active)}</b> • Used: <b>{c.usedCount || 0}</b>
                          {c.usageLimit ? ` / ${c.usageLimit}` : ""}
                          {c.minSpend ? ` • Min spend: ${formatNaira(c.minSpend)}` : ""}
                          {c.expiresAt ? ` • Expires: ${new Date(c.expiresAt).toLocaleDateString()}` : ""}
                        </div>
                      </div>

                      <button
                        onClick={() => toggle(c._id)}
                        className={`rounded-xl px-4 py-2 text-sm font-bold ${
                          c.active ? "bg-rose-600 text-white" : "bg-slate-900 text-white"
                        }`}
                      >
                        {c.active ? "Disable" : "Enable"}
                      </button>
                    </div>
                  );
                })}

                {coupons.length === 0 && (
                  <div className="p-5 text-slate-500">No coupons yet.</div>
                )}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}