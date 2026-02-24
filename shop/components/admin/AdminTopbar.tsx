"use client";

import { useAuthStore } from "@/store/auth.store";

export default function AdminTopbar() {
  const user = useAuthStore((s) => s.user);
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 flex items-center justify-between">
      <div className="font-extrabold text-slate-900">Welcome, {user?.name}</div>
      <div className="text-sm text-slate-500">Admin</div>
    </div>
  );
}