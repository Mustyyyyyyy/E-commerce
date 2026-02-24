import React from "react";
import { cn } from "@/lib/utils";

type Props = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: Props) {
  return (
    <input
      className={cn(
        "w-full rounded-2xl bg-slate-100 px-4 py-3 text-sm outline-none ring-0 focus:ring-2 focus:ring-sky-500",
        className
      )}
      {...props}
    />
  );
}