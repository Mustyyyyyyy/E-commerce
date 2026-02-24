"use client";

import { useAuthStore } from "@/store/auth.store";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { token } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!token) router.push(`/login?next=${encodeURIComponent(pathname)}`);
  }, [token, router, pathname]);

  if (!token) return null;
  return <>{children}</>;
}