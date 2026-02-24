"use client";

import Link from "next/link";
import { LayoutDashboard, Package, ShoppingBag, TicketPercent } from "lucide-react";
import { usePathname } from "next/navigation";

function Item({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  const path = usePathname();
  const active = path === href || path.startsWith(href + "/");
  return (
    <Link
      href={href}
      className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold ${
        active ? "bg-sky-600 text-white" : "hover:bg-slate-100 text-slate-700"
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}

export default function AdminSidebar() {
  return (
    <aside className="w-full lg:w-64 rounded-2xl border border-slate-100 bg-white p-4 h-fit">
      <div className="mb-4 font-extrabold text-slate-900">Admin Panel</div>
      <div className="space-y-2">
        <Item href="/admin" icon={<LayoutDashboard className="h-4 w-4" />} label="Dashboard" />
        <Item href="/admin/products" icon={<Package className="h-4 w-4" />} label="Products" />
        <Item href="/admin/orders" icon={<ShoppingBag className="h-4 w-4" />} label="Orders" />
        <Item href="/admin/coupons" icon={<TicketPercent className="h-4 w-4" />} label="Coupons" />
      </div>
    </aside>
  );
}