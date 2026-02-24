import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  image: string;
  unitPrice: number;
  quantity: number;
  variantSku?: string;
  variantName?: string;
};

type CartState = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (key: { productId: string; variantSku?: string }) => void;
  setQty: (key: { productId: string; variantSku?: string }, qty: number) => void;
  clear: () => void;
  count: () => number;
  subtotal: () => number;
};

function keyOf(i: { productId: string; variantSku?: string }) {
  return `${i.productId}::${i.variantSku || ""}`;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          const qty = item.quantity ?? 1;
          const k = keyOf(item);
          const idx = state.items.findIndex((x) => keyOf(x) === k);

          if (idx >= 0) {
            const copy = [...state.items];
            copy[idx] = { ...copy[idx], quantity: copy[idx].quantity + qty };
            return { items: copy };
          }
          return { items: [...state.items, { ...item, quantity: qty }] };
        }),

      removeItem: (key) =>
        set((state) => ({ items: state.items.filter((x) => keyOf(x) !== keyOf(key)) })),

      setQty: (key, qty) =>
        set((state) => {
          const q = Math.max(1, Math.floor(qty || 1));
          return { items: state.items.map((x) => (keyOf(x) === keyOf(key) ? { ...x, quantity: q } : x)) };
        }),

      clear: () => set({ items: [] }),

      count: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      subtotal: () => get().items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0),
    }),
    { name: "premiumstore_cart_v1" }
  )
);