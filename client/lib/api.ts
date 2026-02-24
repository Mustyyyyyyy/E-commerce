const BASE = process.env.NEXT_PUBLIC_API_URL || "";

export async function apiGet<T>(path: string): Promise<T> {
  const url = `${BASE}${path}`;

  const res = await fetch(url, { cache: "no-store" });

  let data: any = null;
  try {
    data = await res.json();
  } catch {
  }

  if (!res.ok) {
    throw new Error(data?.message || `Request failed: ${res.status} (${url})`);
  }

  return data as T;
}