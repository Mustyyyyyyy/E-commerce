"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  TicketPercent,
  Store,
  ChevronRight,
  Shield,
} from "lucide-react";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/coupons", label: "Coupons", icon: TicketPercent },
];

export default function AdminSidebar() {
  const path = usePathname();

  return (
    <aside className="w-full lg:w-72 h-fit">
      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-800">
                <Shield className="h-5 w-5" />
              </div>
              <div className="leading-tight">
                <div className="text-sm font-black text-slate-900">Admin Panel</div>
                <div className="text-[11px] font-bold text-slate-500">Manage store operations</div>
              </div>
            </div>
          </div>

          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-black text-slate-600">
            ADMIN
          </span>
        </div>

        <nav className="mt-4 space-y-1">
          {NAV.map((item) => {
            const active = path === item.href || path.startsWith(item.href + "/");
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "group flex items-center justify-between rounded-2xl px-3 py-2.5 transition",
                  active
                    ? "bg-slate-900 text-white shadow-sm"
                    : "hover:bg-slate-100 text-slate-800",
                ].join(" ")}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={[
                      "flex h-9 w-9 items-center justify-center rounded-2xl transition",
                      active
                        ? "bg-white/10 text-white"
                        : "bg-slate-100 text-slate-700 group-hover:bg-white",
                    ].join(" ")}
                  >
                    <Icon className="h-4 w-4" />
                  </div>

                  <div className="text-sm font-extrabold">{item.label}</div>
                </div>

                <ChevronRight
                  className={[
                    "h-4 w-4 transition",
                    active ? "text-white/70" : "text-slate-400 group-hover:text-slate-600",
                  ].join(" ")}
                />
              </Link>
            );
          })}
        </nav>

        <div className="my-4 h-px bg-slate-200" />

        <Link
          href="/"
          className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-3 text-sm font-extrabold text-slate-900 hover:bg-slate-100 transition"
        >
          <span className="flex items-center gap-2">
            <Store className="h-4 w-4 text-sky-600" />
            Back to Storefront
          </span>
          <ChevronRight className="h-4 w-4 text-slate-400" />
        </Link>

        <p className="mt-3 text-xs text-slate-500 leading-relaxed">
          Tip: Add products with multiple images so items don’t show the same picture.
        </p>
      </div>
    </aside>
  );
}