"use client";

import { useState } from "react";

export default function ImageUploader({ onUploaded }: { onUploaded: (urls: string[]) => void }) {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const BASE = process.env.NEXT_PUBLIC_API_URL || "";

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    setFiles(Array.from(e.target.files || []).slice(0, 8));
    setMsg("");
  }

  async function upload() {
    setMsg("");

    if (!BASE) return setMsg("NEXT_PUBLIC_API_URL is missing.");
    if (!files.length) return setMsg("Select at least 1 image.");

    const token = localStorage.getItem("token");
    if (!token) return setMsg("You are not logged in.");

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);

    setLoading(true);
    try {
      const form = new FormData();
      for (const f of files) form.append("images", f);

      const BASE = process.env.NEXT_PUBLIC_API_URL || "";
      const res = await fetch(`${BASE}/api/upload`, {
        method: "POST",
        mode:"cors",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
        signal: controller.signal,
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) throw new Error(data?.message || `Upload failed: ${res.status}`);

      const urls: string[] = data?.urls || [];
      if (!urls.length) throw new Error("Upload succeeded but no URLs returned.");

      onUploaded(urls);
      setFiles([]);
      setMsg("Uploaded ✅");
    } catch (e: any) {
      if (e?.name === "AbortError") setMsg("Upload timed out. Check backend/Cloudinary.");
      else setMsg(e?.message || "Upload failed");
    } finally {
      clearTimeout(timeout);
      setLoading(false);
    }
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="font-black text-slate-900">Upload Images</div>
      <p className="mt-1 text-xs text-slate-500">
        Choose 1–8 images. They’ll upload to Cloudinary and be saved into <b>images[]</b>.
      </p>

      <input type="file" accept="image/*" multiple onChange={onPick} className="mt-4 block w-full text-sm" />

      {files.length > 0 && (
        <div className="mt-3 text-xs text-slate-500">
          Selected: <b>{files.length}</b> file(s)
        </div>
      )}

      {msg && (
        <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
          {msg}
        </div>
      )}

      <button
        type="button"
        onClick={upload}
        disabled={loading}
        className="mt-4 w-full rounded-2xl bg-sky-600 px-4 py-3 text-sm font-extrabold text-white hover:opacity-90 disabled:opacity-60"
      >
        {loading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}