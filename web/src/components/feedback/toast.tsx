"use client";
import * as React from "react";
import { cn } from "@/lib/cn";

type Variant = "default" | "success" | "error";

export type ToastItem = {
  id: string;
  title?: string;
  message?: string;
  variant?: Variant;
};

type ToastContextValue = {
  toasts: ToastItem[];
  show: (t: Omit<ToastItem, "id"> & { id?: string; timeoutMs?: number }) => void;
  dismiss: (id: string) => void;
};

const ToastContext = React.createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = React.useCallback(
    ({ id, title, message, variant = "default", timeoutMs = 2500 }: Omit<ToastItem, "id"> & {
      id?: string;
      timeoutMs?: number;
    }) => {
      const toastId = id ?? Math.random().toString(36).slice(2);
      const item: ToastItem = { id: toastId, title, message, variant };
      setToasts((prev) => [...prev, item]);
      if (timeoutMs) {
        window.setTimeout(() => dismiss(toastId), timeoutMs);
      }
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={{ toasts, show, dismiss }}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-50 flex w-80 flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "pointer-events-auto rounded-[var(--radius-md)] border px-3 py-2 text-sm shadow-md",
              t.variant === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : t.variant === "error"
                  ? "border-red-200 bg-red-50 text-red-800"
                  : "border-zinc-200 bg-white text-zinc-800",
            )}
          >
            {t.title && <div className="font-semibold">{t.title}</div>}
            {t.message && <div className="text-zinc-600">{t.message}</div>}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

