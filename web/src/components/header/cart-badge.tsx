"use client";
import * as React from "react";
import { useCartStore } from "@/store/cart";

export function CartBadge() {
  const count = useCartStore((s) => s.count);
  React.useEffect(() => {
    // Ensure it's loaded at least once
    useCartStore.getState().refresh();
  }, []);
  return (
    <span aria-label={`Carrinho (${count})`} className="relative inline-flex">
      <svg
        aria-hidden
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-zinc-800"
      >
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
      {count > 0 && (
        <span className="absolute -right-2 -top-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-xs font-semibold text-white">
          {count}
        </span>
      )}
    </span>
  );
}
