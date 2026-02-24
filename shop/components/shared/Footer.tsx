"use client";

import Link from "next/link";
import { Facebook, Twitter, Instagram, Github, ArrowRight, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative border-t border-slate-200 bg-white">
      {/* soft background glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-slate-50 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 pt-14 pb-10 sm:px-6 lg:px-8">
        {/* Top */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Brand */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-600 text-white font-black">
                S
              </div>
              <div>
                <div className="text-lg font-black tracking-tight text-slate-900">
                  Storefront
                </div>
                <div className="text-xs font-bold text-slate-500">
                  Premium shopping experience
                </div>
              </div>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-slate-600 max-w-md">
              Your premium destination for quality electronics, fashion, and home
              goods. Delivered fast, guaranteed fresh.
            </p>

            <div className="mt-5 flex items-center gap-3">
              <SocialIcon href="#" label="Twitter">
                <Twitter className="h-4 w-4" />
              </SocialIcon>
              <SocialIcon href="#" label="Facebook">
                <Facebook className="h-4 w-4" />
              </SocialIcon>
              <SocialIcon href="#" label="Instagram">
                <Instagram className="h-4 w-4" />
              </SocialIcon>
              <SocialIcon href="#" label="GitHub">
                <Github className="h-4 w-4" />
              </SocialIcon>
            </div>

            <div className="mt-6 inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-600">
              <Mail className="h-4 w-4 text-sky-600" />
              Support: support@storefront.com
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-5">
            <FooterCol title="Shop">
              <FooterLink href="/shop">All Products</FooterLink>
              <FooterLink href="/shop">New Arrivals</FooterLink>
              <FooterLink href="/shop">Featured</FooterLink>
              <FooterLink href="/shop">Discounts</FooterLink>
            </FooterCol>

            <FooterCol title="Categories">
              <FooterLink href="/category/electronics">Electronics</FooterLink>
              <FooterLink href="/category/home-appliances">Home Appliances</FooterLink>
              <FooterLink href="/category/fashion-beauty">Fashion & Beauty</FooterLink>
            </FooterCol>

            <FooterCol title="Support">
              <FooterLink href="#">FAQ</FooterLink>
              <FooterLink href="#">Shipping & Returns</FooterLink>
              <FooterLink href="#">Contact Us</FooterLink>
              <FooterLink href="#">Privacy Policy</FooterLink>
            </FooterCol>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-3">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-sm font-black text-slate-900">Newsletter</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Subscribe to get special offers, new drops, and exclusive deals.
              </p>

              <form
                onSubmit={(e) => e.preventDefault()}
                className="mt-4 space-y-3"
              >
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-sky-600/20 focus:border-sky-600"
                />
                <button className="group w-full rounded-2xl bg-sky-600 px-4 py-3 text-sm font-extrabold text-white shadow-lg shadow-sky-600/20 hover:opacity-90 transition inline-flex items-center justify-center gap-2">
                  Join
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              </form>

              <p className="mt-3 text-xs text-slate-500">
                No spam. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 border-t border-slate-200 pt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Storefront. All rights reserved.
          </p>

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-bold text-slate-500">
            <Link className="hover:text-slate-900 transition" href="#">
              Terms
            </Link>
            <Link className="hover:text-slate-900 transition" href="#">
              Privacy
            </Link>
            <Link className="hover:text-slate-900 transition" href="#">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-sm font-black text-slate-900">{title}</h3>
      <ul className="mt-4 space-y-3">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="text-sm text-slate-600 hover:text-sky-600 transition font-semibold"
      >
        {children}
      </Link>
    </li>
  );
}

function SocialIcon({
  href,
  children,
  label,
}: {
  href: string;
  children: React.ReactNode;
  label: string;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      className="h-10 w-10 flex items-center justify-center rounded-2xl bg-slate-100 text-slate-600 hover:bg-sky-600 hover:text-white transition shadow-sm"
    >
      {children}
    </a>
  );
}