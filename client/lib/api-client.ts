import { useAuthStore } from "@/store/auth.store";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiClient<T>(
  path: string,
  init?: RequestInit & { json?: any }
): Promise<T> {
  const token = useAuthStore.getState().token;

  const headers: Record<string, string> = { ...(init?.headers as any) };
  if (init?.json !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers,
    body: init?.json !== undefined ? JSON.stringify(init.json) : init?.body,
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || `Request failed: ${res.status}`);
  return data as T;
}

export async function uploadImages(files: File[]): Promise<string[]> {
  const fd = new FormData();
  files.forEach((f) => fd.append("images", f));

  const token = useAuthStore.getState().token;
  const res = await fetch(`${API_URL}/api/upload/images`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: fd,
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || "Upload failed");
  return data.urls as string[];
}