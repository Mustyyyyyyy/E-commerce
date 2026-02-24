"use client";

import Navbar from "@/components/shared/Navbar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";
import { apiClient } from "@/lib/api-client";
import { formatNaira } from "@/lib/format";
import { useEffect, useState } from "react";

const ORDER_STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled", "refunded"] as const;
const PAYMENT_STATUSES = ["pending", "paid", "failed"] as const;

export default function AdminOrderDetailsPage({ params }: { params: { id: string } }) {
  const id = params.id;

  const [order, setOrder] = useState<any>(null);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);

  const [status, setStatus] = useState<string>("pending");
  const [paymentStatus, setPaymentStatus] = useState<string>("pending");
  const [courier, setCourier] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");

  async function load() {
    setErr("");
    setMsg("");
    try {
      const data = await apiClient<any>(`/api/orders/${id}`);
      setOrder(data);
      setStatus(data.status);
      setPaymentStatus(data.payment?.status || "pending");
      setCourier(data.tracking?.courier || "");
      setTrackingNumber(data.tracking?.trackingNumber || "");
    } catch (e: any) {
      setErr(e.message || "Failed to load order");
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function save() {
    setMsg("");
    setSaving(true);
    try {
      const payload: any = {
        status,
        paymentStatus,
        tracking: {
          courier: courier || undefined,
          trackingNumber: trackingNumber || undefined,
        },
      };

      const updated = await apiClient<any>(`/api/orders/admin/${id}/status`, {
        method: "PATCH",
        json: payload,
      });

      setOrder(updated);
      setMsg("Updated ✅");
    } catch (e: any) {
      setMsg(e.message || "Update failed");
    } finally {
      setSaving(false);
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
              <h1 className="text-2xl font-extrabold">Manage Order</h1>
              <button
                onClick={save}
                disabled={saving || !order}
                className="rounded-xl bg-sky-600 px-4 py-2 font-bold text-white hover:opacity-90 disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save changes"}
              </button>
            </div>

            {err && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-rose-700">
                {err}
              </div>
            )}
            {msg && (
              <div className="rounded-2xl border border-slate-100 bg-white p-4 text-sm text-slate-700">
                {msg}
              </div>
            )}

            {!order && !err && (
              <div className="rounded-2xl border border-slate-100 bg-white p-5">Loading...</div>
            )}

            {order && (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
                {/* Left: Items */}
                <div className="rounded-2xl border border-slate-100 bg-white p-5">
                  <div className="text-xs text-slate-500">Order ID</div>
                  <div className="font-mono text-xs">{order._id}</div>

                  <div className="mt-4 text-sm">
                    <span className="font-bold">{order.userId?.name}</span>{" "}
                    <span className="text-slate-500">({order.userId?.email})</span>
                  </div>

                  <div className="mt-5 border-t border-slate-100 pt-4">
                    <div className="font-extrabold">Items</div>
                    <div className="mt-4 space-y-3">
                      {order.items.map((i: any) => (
                        <div key={`${i.productId}::${i.variantSku || ""}`} className="flex items-center gap-3">
                          <img
                            src={i.image}
                            alt={i.name}
                            className="h-12 w-12 rounded-xl object-cover bg-slate-100"
                          />
                          <div className="flex-1">
                            <div className="font-bold">{i.name}</div>
                            <div className="text-xs text-slate-500">
                              Qty: {i.quantity} • {formatNaira(i.unitPrice)}
                              {i.variantSku ? ` • SKU: ${i.variantSku}` : ""}
                            </div>
                          </div>
                          <div className="font-bold">{formatNaira(i.unitPrice * i.quantity)}</div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 border-t border-slate-100 pt-4 space-y-2 text-sm">
                      <Row label="Subtotal" value={formatNaira(order.subtotal)} />
                      <Row label="Discount" value={formatNaira(order.discount || 0)} />
                      <Row label="Shipping" value={formatNaira(order.shippingFee || 0)} />
                      <div className="border-t border-slate-100 pt-3" />
                      <Row label="Total" value={formatNaira(order.total)} strong />
                    </div>
                  </div>

                  {order.shippingAddress && (
                    <div className="mt-6 rounded-2xl bg-slate-50 p-4">
                      <div className="font-extrabold">Shipping</div>
                      <div className="mt-2 text-sm text-slate-700">
                        <div><b>Name:</b> {order.shippingAddress.fullName}</div>
                        <div><b>Phone:</b> {order.shippingAddress.phone}</div>
                        <div><b>Address:</b> {order.shippingAddress.address1}</div>
                        <div><b>City/State:</b> {order.shippingAddress.city}, {order.shippingAddress.state}</div>
                        <div><b>Country:</b> {order.shippingAddress.country}</div>
                        {order.shippingAddress.notes && <div><b>Notes:</b> {order.shippingAddress.notes}</div>}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right: Update */}
                <div className="space-y-4">
                  <div className="rounded-2xl border border-slate-100 bg-white p-5">
                    <div className="font-extrabold">Update Status</div>

                    <div className="mt-4">
                      <div className="mb-2 text-xs font-bold text-slate-600">Order status</div>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full rounded-xl bg-slate-100 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-sky-500"
                      >
                        {ORDER_STATUSES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>

                    <div className="mt-4">
                      <div className="mb-2 text-xs font-bold text-slate-600">Payment status</div>
                      <select
                        value={paymentStatus}
                        onChange={(e) => setPaymentStatus(e.target.value)}
                        className="w-full rounded-xl bg-slate-100 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-sky-500"
                      >
                        {PAYMENT_STATUSES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>

                    <div className="mt-6 font-extrabold">Tracking</div>
                    <div className="mt-3 space-y-3">
                      <input
                        value={courier}
                        onChange={(e) => setCourier(e.target.value)}
                        className="w-full rounded-xl bg-slate-100 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-sky-500"
                        placeholder="Courier (e.g. DHL)"
                      />
                      <input
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                        className="w-full rounded-xl bg-slate-100 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-sky-500"
                        placeholder="Tracking number"
                      />
                    </div>

                    <button
                      onClick={save}
                      disabled={saving}
                      className="mt-5 w-full rounded-xl bg-sky-600 px-5 py-3 font-bold text-white hover:opacity-90 disabled:opacity-60"
                    >
                      {saving ? "Saving..." : "Save changes"}
                    </button>
                  </div>

                  <button
                    onClick={load}
                    className="w-full rounded-xl bg-slate-900 px-5 py-3 font-bold text-white"
                  >
                    Refresh order
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>
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