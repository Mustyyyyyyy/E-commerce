"use client";

import { useState } from "react";

export default function ImageUploader({
  onUploaded,
}: {
  onUploaded: (urls: string[]) => void;
}) {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const BASE = process.env.NEXT_PUBLIC_API_URL || "";

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files || []);
    setFiles(picked);
    setMsg("");
  }

  async function upload() {
    setMsg("");

    if (!files.length) {
      setMsg("Select at least 1 image.");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("You are not logged in. Please login again.");

      const form = new FormData();

      for (const f of files) form.append("images", f);

      const res = await fetch(`${BASE}/api/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }, 
        body: form,
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.message || `Upload failed: ${res.status}`);
      }

      const urls: string[] = data?.urls || data?.images || data?.files || [];

      if (!Array.isArray(urls) || urls.length === 0) {
        throw new Error("Upload succeeded but no image URLs were returned.");
      }

      onUploaded(urls);
      setFiles([]);
      setMsg("Uploaded successfully");
    } catch (e: any) {
      setMsg(e?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="font-black text-slate-900">Upload Images</div>
      <p className="mt-1 text-xs text-slate-500">
        Choose 1–8 images. They’ll upload to Cloudinary and be saved into <b>images[]</b>.
      </p>

      <input
        type="file"
        accept="image/*"
        multiple
        onChange={onPick}
        className="mt-4 block w-full text-sm"
      />

      {!!files.length && (
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