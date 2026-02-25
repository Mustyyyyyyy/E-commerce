"use client";

import { useMemo, useState } from "react";

export default function ManualImageUrls({
  value,
  onChange,
  max = 8,
}: {
  value: string[];
  onChange: (urls: string[]) => void;
  max?: number;
}) {
  const [text, setText] = useState("");

  const canAdd = useMemo(() => {
    return text.trim().length > 0 && value.length < max;
  }, [text, value.length, max]);

  function addFromTextarea() {
    const incoming = text
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const cleaned = incoming.filter((u) => /^https?:\/\/.+/i.test(u));

    const merged = [...value, ...cleaned].slice(0, max);

    // remove duplicates
    const unique = Array.from(new Set(merged));

    onChange(unique);
    setText("");
  }

  function removeUrl(url: string) {
    onChange(value.filter((x) => x !== url));
  }

  function clearAll() {
    onChange([]);
    setText("");
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-black text-slate-900">Manual Image URLs</div>
          <p className="mt-1 text-xs text-slate-500">
            Paste image links (one per line). These will be saved into <b>images[]</b>.
          </p>
        </div>

        {value.length > 0 && (
          <button
            type="button"
            onClick={clearAll}
            className="text-xs font-extrabold text-slate-600 hover:text-slate-900"
          >
            Clear
          </button>
        )}
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={`Paste image URLs here (one per line)\nhttps://...\nhttps://...`}
        className="mt-4 min-h-[120px] w-full rounded-2xl bg-slate-100 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-sky-500"
      />

      <button
        type="button"
        disabled={!canAdd}
        onClick={addFromTextarea}
        className="mt-4 w-full rounded-2xl bg-sky-600 px-4 py-3 text-sm font-extrabold text-white hover:opacity-90 disabled:opacity-60"
      >
        Add URLs
      </button>

      <div className="mt-3 text-xs text-slate-500">
        Saved: <b>{value.length}</b> / {max}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        {value.map((url) => (
          <div key={url} className="relative">
            <img
              src={url}
              alt="product"
              className="h-24 w-full rounded-2xl object-cover bg-slate-100 border border-slate-200"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.opacity = "0.35";
              }}
            />
            <button
              type="button"
              onClick={() => removeUrl(url)}
              className="absolute right-2 top-2 rounded-full bg-black/70 px-2 py-1 text-[10px] font-black text-white"
            >
              X
            </button>
          </div>
        ))}
      </div>

      {value.length === 0 && (
        <div className="mt-4 text-sm text-slate-500">No image URLs added yet.</div>
      )}
    </div>
  );
}