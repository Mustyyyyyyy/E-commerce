export default function EmptyState({
  title,
  desc,
  action,
}: {
  title: string;
  desc?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6">
      <div className="text-lg font-extrabold">{title}</div>
      {desc && <div className="mt-1 text-sm text-slate-500">{desc}</div>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}