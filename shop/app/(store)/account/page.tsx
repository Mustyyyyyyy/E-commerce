"use client";

import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { useAuthStore } from "@/store/auth.store";

export default function AccountPage() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold">Account</h1>

        <div className="mt-6 rounded-2xl border border-slate-100 bg-white p-6">
          <div className="text-sm text-slate-500">Name</div>
          <div className="font-bold">{user?.name}</div>

          <div className="mt-4 text-sm text-slate-500">Email</div>
          <div className="font-bold">{user?.email}</div>

          <div className="mt-4 text-sm text-slate-500">Role</div>
          <div className="font-bold">{user?.role}</div>

          <a href="/account/orders" className="mt-6 inline-block rounded-xl bg-sky-600 px-5 py-3 font-bold text-white">
            View my orders
          </a>
        </div>
      </main>
      <Footer />
    </div>
  );
}