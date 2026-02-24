import "./globals.css";

export const metadata = {
  title: "PremiumStore",
  description: "Single-brand e-commerce store",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#f6f7f8] text-slate-900">{children}</body>
    </html>
  );
}