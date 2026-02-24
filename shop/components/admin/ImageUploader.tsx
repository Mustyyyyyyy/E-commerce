"use client";

import { useState } from "react";
import { uploadImages } from "@/lib/api-client";

export default function ImageUploader({
  onUploaded,
}: {
  onUploaded: (urls: string[]) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function handle(files: FileList | null) {
    if (!files?.length) return;
    setLoading(true);
    setMsg("");
    try {
      const urls = await uploadImages(Array.from(files));
      onUploaded(urls);
      setMsg("Uploaded ✅");
    } catch (e: any) {
      setMsg(e.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4">
      <div className="text-sm font-bold">Upload images (Cloudinary)</div>
      <input
        type="file"
        multiple
        accept="image/*"
        className="mt-3 block w-full text-sm"
        onChange={(e) => handle(e.target.files)}
      />
      {msg && <div className="mt-2 text-xs text-slate-600">{msg}</div>}
      {loading && <div className="mt-2 text-xs text-slate-500">Uploading...</div>}
    </div>
  );
}