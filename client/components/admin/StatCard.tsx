import React from "react";
import { cn } from "@/lib/utils";

export default function StatCard({
  label,
  value,
  icon,
  hint,
}: {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className={cn("rounded-3xl border border-slate-200 bg-white p-5 shadow-sm")}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
            {label}
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">{value}</div>
          {hint && <div className="mt-2 text-xs text-slate-500">{hint}</div>}
        </div>

        {icon && (
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}