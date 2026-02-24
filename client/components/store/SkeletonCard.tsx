export default function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-3">
      <div className="aspect-square rounded-xl bg-slate-100 animate-pulse mb-3" />
      <div className="space-y-2 px-1">
        <div className="h-3 w-1/3 bg-slate-100 rounded animate-pulse" />
        <div className="h-4 w-3/4 bg-slate-100 rounded animate-pulse" />
        <div className="flex justify-between items-center pt-1">
          <div className="h-5 w-1/4 bg-slate-100 rounded animate-pulse" />
          <div className="h-8 w-8 bg-slate-100 rounded-lg animate-pulse" />
        </div>
      </div>
    </div>
  );
}
