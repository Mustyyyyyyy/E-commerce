"use client";

import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { apiClient } from "@/lib/api-client";
import type { AuthResponse } from "@/lib/types";
import { useAuthStore } from "@/store/auth.store";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get("next") || "/";
  const setAuth = useAuthStore((s) => s.setAuth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const canSubmit = useMemo(() => {
    return email.trim().length > 3 && password.trim().length >= 6 && !loading;
  }, [email, password, loading]);

  async function login(e?: React.FormEvent) {
    e?.preventDefault();
    if (!canSubmit) return;

    setLoading(true);
    setMsg("");

    try {
      const data = await apiClient<AuthResponse>("/api/auth/login", {
        method: "POST",
        json: { email: email.trim().toLowerCase(), password },
      });

      setAuth(data.token, data.user);
      router.push(next);
    } catch (e: any) {
      setMsg(e.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f6f7f8]">
      <Navbar />

      <main className="mx-auto max-w-md px-4 py-12">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-extrabold text-slate-900">Login</h1>
          <p className="mt-1 text-sm text-slate-500">Welcome back. Enter your details.</p>

          <form onSubmit={login} className="mt-6 space-y-3">
            <input
              className="w-full rounded-2xl bg-slate-100 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            <input
              className="w-full rounded-2xl bg-slate-100 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />

            {msg && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {msg}
              </div>
            )}

            <button
              type="submit"
              disabled={!canSubmit}
              className="mt-2 w-full rounded-2xl bg-sky-600 px-5 py-3 font-extrabold text-white hover:opacity-90 disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="mt-4 text-sm text-slate-600">
            Don’t have an account?{" "}
            <a className="font-extrabold text-sky-600 hover:underline" href="/register">
              Register
            </a>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}