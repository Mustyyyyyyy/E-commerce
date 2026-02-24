"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Search,
  ShoppingBag,
  ShoppingCart,
  User2,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { useCartStore } from "@/store/cart.store";
import { useAuthStore } from "@/store/auth.store";
import { useEffect, useMemo, useState } from "react";

const LINKS = [
  { label: "Electronics", href: "/category/electronics" },
  { label: "Home Appliances", href: "/category/home-appliances" },
  { label: "Fashion & Beauty", href: "/category/fashion-beauty" },
  { label: "New Arrivals", href: "/category/shop" },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const cartCount = useCartStore((s) => s.count());
  const { user, logout } = useAuthStore();

  const [q, setQ] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSearch, setMobileSearch] = useState(false);

  const firstName = useMemo(
    () => (user?.name ? user.name.split(" ")[0] : ""),
    [user?.name]
  );

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    const query = q.trim();
    setMobileSearch(false);
    setMobileOpen(false);
    router.push(query ? `/shop?q=${encodeURIComponent(query)}` : "/shop");
  }

  useEffect(() => {
    setMobileOpen(false);
    setMobileSearch(false);
  }, [pathname]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <header className="sticky top-0 z-50 w-full border-b border-sky-600/10 bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left */}
          <div className="flex items-center gap-4">
            {/* Mobile menu */}
            <button
              onClick={() => setMobileOpen((s) => !s)}
              className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-600/5 text-slate-800 hover:bg-sky-600/15 transition"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {/* Brand */}
            <Link href="/" className="flex items-center gap-2 text-sky-600">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-600 text-white shadow-sm">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <div className="leading-tight">
                <div className="text-lg font-extrabold tracking-tight text-slate-900">
                  ModernStore
                </div>
                <div className="hidden sm:block text-[11px] font-bold text-slate-500">
                  Quality Products • Delivered Fast
                </div>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-6 ml-6">
              <Link
                href="/shop"
                className={`text-sm font-semibold transition-colors ${
                  isActive("/shop") ? "text-sky-600" : "text-slate-600 hover:text-sky-600"
                }`}
              >
                Shop
              </Link>

              {LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`text-sm font-semibold transition-colors ${
                    isActive(l.href) ? "text-sky-600" : "text-slate-600 hover:text-sky-600"
                  }`}
                >
                  {l.label}
                </Link>
              ))}

              {user?.role === "admin" && (
                <Link
                  href="/admin"
                  className={`text-sm font-semibold transition-colors ${
                    isActive("/admin") ? "text-sky-600" : "text-slate-600 hover:text-sky-600"
                  }`}
                >
                  Admin
                </Link>
              )}
            </nav>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2">
            {/* Desktop search */}
            <form onSubmit={onSearch} className="hidden lg:flex relative items-center">
              <Search className="absolute left-3 h-4 w-4 text-slate-400" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="w-72 pl-10 pr-4 py-2 rounded-2xl border-none bg-sky-600/5 focus:ring-2 focus:ring-sky-600/30 text-sm outline-none"
                placeholder="Search products..."
                type="text"
              />
            </form>

            {/* Mobile search */}
            <button
              onClick={() => setMobileSearch((s) => !s)}
              className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-600/5 text-slate-800 hover:bg-sky-600/15 transition"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-600/5 text-slate-800 hover:bg-sky-600/15 transition"
              aria-label="Cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-sky-600 px-1 text-[11px] font-black text-white shadow-sm">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>

            {/* Auth */}
            {user ? (
              <>
                <Link
                  href="/account"
                  className="hidden sm:inline-flex items-center gap-2 rounded-2xl bg-sky-600/5 px-3 py-2 text-sm font-extrabold text-slate-900 hover:bg-sky-600/15 transition"
                >
                  Hi, {firstName}
                  <ChevronRight className="h-4 w-4 text-slate-500" />
                </Link>

                <button
                  onClick={logout}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-600/5 text-slate-800 hover:bg-sky-600/15 transition"
                  aria-label="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-600/5 text-slate-800 hover:bg-sky-600/15 transition"
                aria-label="Login"
              >
                <User2 className="h-5 w-5" />
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Search Bar */}
        {mobileSearch && (
          <div className="pb-3 lg:hidden">
            <form onSubmit={onSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-sky-600/5 focus:ring-2 focus:ring-sky-600/30 text-sm outline-none"
                placeholder="Search products..."
                type="text"
              />
            </form>
          </div>
        )}

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-sky-600/10 py-4 space-y-2">
            <MobileItem href="/shop" active={isActive("/shop")}>Shop</MobileItem>

            {LINKS.map((l) => (
              <MobileItem key={l.href} href={l.href} active={isActive(l.href)}>
                {l.label}
              </MobileItem>
            ))}

            {user?.role === "admin" && (
              <MobileItem href="/admin" active={isActive("/admin")}>
                Admin
              </MobileItem>
            )}

            <div className="pt-3 border-t border-sky-600/10">
              {user ? (
                <div className="flex items-center gap-2">
                  <Link
                    href="/account"
                    className="flex-1 rounded-2xl bg-sky-600/5 px-4 py-3 text-sm font-extrabold text-slate-900 hover:bg-sky-600/15 transition"
                  >
                    Account ({firstName})
                  </Link>
                  <button
                    onClick={logout}
                    className="rounded-2xl bg-rose-600 px-4 py-3 text-sm font-extrabold text-white hover:opacity-90 transition"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="block rounded-2xl bg-sky-600 px-4 py-3 text-center text-sm font-extrabold text-white hover:opacity-90 transition"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

function MobileItem({
  href,
  active,
  children,
}: {
  href: string;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-extrabold transition ${
        active ? "bg-sky-600 text-white" : "bg-sky-600/5 text-slate-900 hover:bg-sky-600/15"
      }`}
    >
      <span>{children}</span>
      <ChevronRight className={`h-4 w-4 ${active ? "text-white/80" : "text-slate-500"}`} />
    </Link>
  );
}