import RequireAuth from "@/components/shared/RequireAuth";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return <RequireAuth>{children}</RequireAuth>;
}