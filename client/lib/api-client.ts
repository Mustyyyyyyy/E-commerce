// lib/api-client.ts
export type ApiOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  json?: any;
  headers?: Record<string, string>;
  timeoutMs?: number;
};

export async function apiClient<T = any>(
  path: string,
  opts: ApiOptions = {}
): Promise<T> {
  const BASE = process.env.NEXT_PUBLIC_API_URL ?? "";
  if (!BASE) throw new Error("NEXT_PUBLIC_API_URL is missing.");

  const url = `${BASE}${path.startsWith("/") ? path : `/${path}`}`;

  const token =
    typeof window !== "undefined" ? window.localStorage.getItem("token") : null;

  const controller = new AbortController();
  const timeoutMs = opts.timeoutMs ?? 90000; // ✅ 90 seconds default for Render
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  const headers: Record<string, string> = {
    ...(opts.json ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(opts.headers ?? {}),
  };

  const init: RequestInit = {
    method: opts.method ?? (opts.json ? "POST" : "GET"),
    headers,
    body: opts.json ? JSON.stringify(opts.json) : undefined,
    signal: controller.signal,
  };

  try {
    const res = await fetch(url, init);

    const ct = res.headers.get("content-type") || "";
    const isJson = ct.includes("application/json");
    const data = isJson ? await res.json().catch(() => null) : await res.text().catch(() => "");

    if (!res.ok) {
      const msg =
        typeof data === "object" && data && "message" in data
          ? String((data as any).message)
          : `Request failed: ${res.status}`;
      throw new Error(msg);
    }

    return data as T;
  } catch (e: any) {
    if (e?.name === "AbortError") {
      throw new Error("Backend may be sleeping or unreachable (timeout). Try again.");
    }
    throw e;
  } finally {
    clearTimeout(timeout);
  }
}