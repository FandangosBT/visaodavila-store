"use client";
import { create } from "zustand";

type UIState = {
  miniCartOpen: boolean;
  setMiniCartOpen: (v: boolean) => void;
  toggleMiniCart: () => void;
};

export const useUIStore = create<UIState>((set) => ({
  miniCartOpen: false,
  setMiniCartOpen: (v) => set({ miniCartOpen: v }),
  toggleMiniCart: () => set((s) => ({ miniCartOpen: !s.miniCartOpen })),
}));

