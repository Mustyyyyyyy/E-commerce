"use client";

import { useState } from "react";
import { apiClient } from "@/lib/api-client";

export default function ImageUploader({
  onUploaded,
}: {
  onUploaded: (urls: string[]) => void;
}) {
  const [files, setFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function upload() {
    setMsg("");
    if (!files || files.length === 0) return setMsg("Select at least 1 image.");

    setLoading(true);
    try {
      const form = new FormData();
      Array.from(files).forEach((f) => form.append("images", f));

      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: form,
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.message || `Upload failed: ${res.status}`);

      const urls: string[] = data?.urls || data?.images || [];
      if (!urls.length) throw new Error("Upload succeeded but no URLs returned");

      onUploaded(urls);
      setFiles(null);
      setMsg("Uploaded!");
    } catch (e: any) {
      setMsg(e.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="font-black text-slate-900">Upload Images</div>
      <p className="mt-1 text-xs text-slate-500">
        Select 1–8 images. They’ll be uploaded and saved into <b>images[]</b>.
      </p>

      <input
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => setFiles(e.target.files)}
        className="mt-4 block w-full text-sm"
      />

      {msg && <div className="mt-3 text-sm text-slate-600">{msg}</div>}

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