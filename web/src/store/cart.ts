"use client";
import { create } from "zustand";
import { fetchCart, type CartAPI } from "@/lib/cart";

type CartState = {
  cart: CartAPI | null;
  count: number;
  loading: boolean;
  refresh: () => Promise<void>;
};

export const useCartStore = create<CartState>((set) => ({
  cart: null,
  count: 0,
  loading: false,
  refresh: async () => {
    set({ loading: true });
    try {
      const c = await fetchCart();
      const count = c.items.reduce((acc, it) => acc + (it.quantity || 0), 0);
      set({ cart: c, count });
    } finally {
      set({ loading: false });
    }
  },
}));

