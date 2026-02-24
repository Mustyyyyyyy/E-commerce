import RequireAdmin from "@/components/shared/RequireAdmin";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <RequireAdmin>{children}</RequireAdmin>;
}