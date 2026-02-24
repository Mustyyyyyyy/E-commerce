import type { ProductCategory } from "./types";

export function prettyCategory(c: ProductCategory) {
  if (c === "electronics") return "Electronics";
  if (c === "home-appliances") return "Home Appliances";
  return "Fashion & Beauty";
}

export function formatNaira(n: number) {
  try {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    return `₦${Math.round(n).toLocaleString()}`;
  }
}