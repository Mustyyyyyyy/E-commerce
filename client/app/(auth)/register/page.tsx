"use client";

import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { apiClient } from "@/lib/api-client";
import type { AuthResponse } from "@/lib/types";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function register() {
    setLoading(true);
    setMsg("");
    try {
      const data = await apiClient<AuthResponse>("/api/auth/register", {
        method: "POST",
        json: { name, email, password },
      });
      setAuth(data.token, data.user);
      router.push("/");
    } catch (e: any) {
      setMsg(e.message || "Register failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-md px-4 py-12">
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-extrabold">Create account</h1>

          <div className="mt-5 space-y-3">
            <input className="w-full rounded-xl bg-slate-100 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
            <input className="w-full rounded-xl bg-slate-100 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input className="w-full rounded-xl bg-slate-100 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          {msg && <div className="mt-3 text-sm text-rose-600">{msg}</div>}

          <button
            onClick={register}
            disabled={loading}
            className="mt-5 w-full rounded-xl bg-sky-600 px-5 py-3 font-bold text-white hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Creating..." : "Register"}
          </button>

          <p className="mt-4 text-sm text-slate-600">
            Already have an account? <a className="font-bold text-sky-600 hover:underline" href="/login">Login</a>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}