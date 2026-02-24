"use client";

import { useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import {
  Shield,
  Plus,
  RefreshCw,
  ChevronRight,
  LayoutDashboard,
  Package,
  ShoppingBag,
  TicketPercent,
} from "lucide-react";

function titleFromPath(path: string) {
  if (path === "/admin") return { title: "Dashboard", icon: LayoutDashboard };
  if (path.startsWith("/admin/products")) return { title: "Products", icon: Package };
  if (path.startsWith("/admin/orders")) return { title: "Orders", icon: ShoppingBag };
  if (path.startsWith("/admin/coupons")) return { title: "Coupons", icon: TicketPercent };
  return { title: "Admin", icon: Shield };
}

export default function AdminTopbar({
  onRefresh,
}: {
  onRefresh?: () => void;
}) {
  const router = useRouter();
  const path = usePathname();
  const user = useAuthStore((s) => s.user);

  const firstName = useMemo(
    () => (user?.name ? user.name.split(" ")[0] : "Admin"),
    [user?.name]
  );

  const meta = titleFromPath(path);
  const Icon = meta.icon;

  // Quick action based on section
  const quickAddHref =
    path.startsWith("/admin/products") ? "/admin/products/new" : "/admin/products/new";

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Left: Title + breadcrumb */}
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-800">
            <Icon className="h-5 w-5" />
          </div>

          <div className="leading-tight">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
              <span>Admin</span>
              <ChevronRight className="h-4 w-4" />
              <span className="text-slate-700">{meta.title}</span>
            </div>
            <div className="text-lg font-black text-slate-900">
              {meta.title}
            </div>
          </div>
        </div>

        {/* Right: actions + user chip */}
        <div className="flex flex-wrap items-center gap-2 justify-between sm:justify-end">
          {/* Refresh */}
          <button
            onClick={onRefresh}
            className="inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-2 text-sm font-extrabold text-slate-800 hover:bg-slate-200 transition disabled:opacity-60"
            disabled={!onRefresh}
            title="Refresh"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>

          {/* Quick add */}
          <button
            onClick={() => router.push(quickAddHref)}
            className="inline-flex items-center gap-2 rounded-2xl bg-sky-600 px-4 py-2 text-sm font-extrabold text-white shadow-lg shadow-sky-600/20 hover:opacity-90 transition"
            title="Add product"
          >
            <Plus className="h-4 w-4" />
            Add product
          </button>

          {/* User chip */}
          <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 font-black">
              {firstName.slice(0, 1).toUpperCase()}
            </div>
            <div className="leading-tight">
              <div className="text-sm font-extrabold text-slate-900">
                {firstName}
              </div>
              <div className="text-[11px] font-bold text-slate-500">Admin</div>
            </div>
          </div>
        </div>
      </div>

      {/* Small helper row */}
      <div className="mt-3 rounded-2xl bg-slate-50 px-4 py-3 text-xs text-slate-600">
        Tip: Upload multiple images per product so products never look identical.
      </div>
    </div>
  );
}