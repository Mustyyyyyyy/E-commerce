type ApiOpts = {
  method?: string;
  json?: any;
};

const BASE = process.env.NEXT_PUBLIC_API_URL || "";

export async function apiClient<T = any>(path: string, opts: ApiOpts = {}): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const res = await fetch(`${BASE}${path}`, {
    method: opts.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: opts.json ? JSON.stringify(opts.json) : undefined,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const details =
      Array.isArray(data?.errors) && data.errors.length
        ? data.errors.map((e: any) => e.message).join(", ")
        : "";

    throw new Error(
      details
        ? `${data?.message || "Error"}: ${details}`
        : data?.message || `Request failed: ${res.status}`
    );
  }

  return data as T;
}