"use client";
import { create } from "zustand";
import type { SessionUser } from "@/lib/session";
import { getSessionUser } from "@/lib/session";

type SessionState = {
  user: SessionUser;
  loading: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
};

export const useSessionStore = create<SessionState>((set) => ({
  user: null,
  loading: false,
  refresh: async () => {
    set({ loading: true });
    try {
      const u = await getSessionUser();
      set({ user: u });
    } finally {
      set({ loading: false });
    }
  },
  logout: async () => {
    await fetch("/auth/logout", { method: "POST" });
    set({ user: null });
  },
}));

