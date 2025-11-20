"use client";
import { create } from "zustand";

type Theme = "light" | "dark";
type PrefsState = {
  theme: Theme;
  setTheme: (t: Theme) => void;
};

function loadTheme(): Theme {
  if (typeof window === "undefined") return "light";
  try {
    return ((localStorage.getItem("pref:theme") as Theme) || "light");
  } catch {
    return "light";
  }
}

export const usePrefsStore = create<PrefsState>((set) => ({
  theme: loadTheme(),
  setTheme: (t) => {
    try {
      localStorage.setItem("pref:theme", t);
    } catch {}
    set({ theme: t });
    if (typeof document !== "undefined") {
      document.documentElement.dataset.theme = t;
      // Ativar utilitários `dark:` do Tailwind quando dark
      document.documentElement.classList.toggle("dark", t === "dark");
    }
  },
}));
