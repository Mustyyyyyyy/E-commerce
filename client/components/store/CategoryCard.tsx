"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function CategoryCard({
  title,
  description,
  href,
  image,
}: {
  title: string;
  description: string;
  href: string;
  image: string;
}) {
  return (
    <Link
      href={href}
      className="group relative aspect-[4/5] overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-sm hover:shadow-xl transition"
    >
      <Image
        src={image}
        alt={title}
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        className="object-cover transition-transform duration-500 group-hover:scale-110"
        priority={false}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 p-7">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h3 className="text-white text-2xl font-black">{title}</h3>
            <p className="mt-1 text-white/80 text-sm font-medium">
              {description}
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 border border-white/20 backdrop-blur">
            <ArrowRight className="h-5 w-5 text-white transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  );
}