"use client";

import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { token, user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!token) router.push("/login?next=/admin");
    else if (user?.role !== "admin") router.push("/");
  }, [token, user, router]);

  if (!token || user?.role !== "admin") return null;
  return <>{children}</>;
}