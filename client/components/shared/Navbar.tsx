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

const NAV_LINKS = [
  { label: "Shop", href: "/shop" },
  { label: "Electronics", href: "/category/electronics" },
  { label: "Home Appliances", href: "/category/home-appliances" },
  { label: "Fashion & Beauty", href: "/category/fashion-beauty" },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const cartCount = useCartStore((s) => s.count());
  const { user, logout } = useAuthStore();

  const [q, setQ] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const firstName = useMemo(() => (user?.name ? user.name.split(" ")[0] : ""), [user?.name]);

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    const query = q.trim();
    setMobileSearchOpen(false);
    setMobileOpen(false);
    router.push(query ? `/shop?q=${encodeURIComponent(query)}` : "/shop");
  }

  // Close drawer when route changes
  useEffect(() => {
    setMobileOpen(false);
    setMobileSearchOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left */}
        <div className="flex items-center gap-3">
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen((s) => !s)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition md:hidden"
            aria-label="Open menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {/* Brand */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-600 text-white shadow-sm">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div className="leading-tight">
              <div className="text-sm sm:text-base font-black tracking-tight text-slate-900">
                PremiumStore
              </div>
              <div className="hidden sm:block text-[11px] font-bold text-slate-500">
                Quality • Fast delivery
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="ml-8 hidden md:flex items-center gap-2">
            {NAV_LINKS.map((l) => (
              <NavLink key={l.href} href={l.href} active={pathname === l.href || pathname.startsWith(l.href + "/")}>
                {l.label}
              </NavLink>
            ))}
            {user?.role === "admin" && (
              <NavLink href="/admin" active={pathname === "/admin" || pathname.startsWith("/admin/")}>
                Admin
              </NavLink>
            )}
          </nav>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          {/* Desktop search */}
          <form onSubmit={onSearch} className="hidden lg:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="w-72 rounded-full bg-slate-100 pl-10 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="Search products..."
                type="text"
              />
            </div>
          </form>

          {/* Mobile search button */}
          <button
            onClick={() => setMobileSearchOpen((s) => !s)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition lg:hidden"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>

          {/* Account */}
          {user ? (
            <>
              <Link
                href="/account"
                className="hidden sm:inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-3 py-2 text-sm font-extrabold text-slate-800 hover:bg-slate-200 transition"
              >
                Hi, {firstName}
                <ChevronRight className="h-4 w-4 text-slate-500" />
              </Link>
              <button
                onClick={logout}
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
                aria-label="Logout"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
              aria-label="Login"
              title="Login"
            >
              <User2 className="h-5 w-5" />
            </Link>
          )}

          {/* Cart */}
          <Link
            href="/cart"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
            aria-label="Cart"
            title="Cart"
          >
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-sky-600 px-1 text-[11px] font-black text-white shadow-sm">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile search bar */}
      {mobileSearchOpen && (
        <div className="border-t border-slate-200 bg-white/90 backdrop-blur-md lg:hidden">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3">
            <form onSubmit={onSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="w-full rounded-2xl bg-slate-100 pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="Search products..."
                type="text"
              />
            </form>
          </div>
        </div>
      )}

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 space-y-2">
            {NAV_LINKS.map((l) => (
              <MobileLink key={l.href} href={l.href} active={pathname === l.href || pathname.startsWith(l.href + "/")}>
                {l.label}
              </MobileLink>
            ))}

            {user?.role === "admin" && (
              <MobileLink href="/admin" active={pathname === "/admin" || pathname.startsWith("/admin/")}>
                Admin
              </MobileLink>
            )}

            <div className="pt-3 border-t border-slate-200">
              {user ? (
                <div className="flex items-center justify-between gap-3">
                  <Link
                    href="/account"
                    className="flex-1 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-extrabold text-slate-900"
                  >
                    Account ({firstName})
                  </Link>
                  <button
                    onClick={logout}
                    className="rounded-2xl bg-rose-600 px-4 py-3 text-sm font-extrabold text-white"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="block rounded-2xl bg-sky-600 px-4 py-3 text-center text-sm font-extrabold text-white"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function NavLink({
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
      className={[
        "rounded-full px-4 py-2 text-sm font-extrabold transition",
        active ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100",
      ].join(" ")}
    >
      {children}
    </Link>
  );
}

function MobileLink({
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
      className={[
        "flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-extrabold transition",
        active ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-900 hover:bg-slate-200",
      ].join(" ")}
    >
      <span>{children}</span>
      <ChevronRight className={["h-4 w-4", active ? "text-white/80" : "text-slate-500"].join(" ")} />
    </Link>
  );
}