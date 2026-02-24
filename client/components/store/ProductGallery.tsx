"use client";

import { useMemo, useState } from "react";

export default function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const imgs = useMemo(() => (images?.length ? images : ["/placeholders/product.png"]), [images]);
  const [active, setActive] = useState(imgs[0]);

  return (
    <div>
      <div className="aspect-square overflow-hidden rounded-2xl bg-slate-100">
        <img src={active} alt={name} className="h-full w-full object-cover" />
      </div>

      <div className="mt-4 flex gap-3 overflow-x-auto">
        {imgs.map((src) => (
          <button
            key={src}
            onClick={() => setActive(src)}
            className={`h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border ${
              active === src ? "border-sky-600" : "border-slate-200"
            }`}
            aria-label="Select image"
          >
            <img src={src} alt="" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}