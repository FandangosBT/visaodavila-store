"use client";
"use client";
import Link from "next/link";
import { SearchBox } from "@/components/header/search";
import { CartBadge } from "@/components/header/cart-badge";
import { Nav } from "@/components/header/nav";
import { Container } from "@/components/layout/container";
import * as React from "react";
import { MiniCart } from "@/components/cart/mini-cart";
import { useUIStore } from "@/store/ui";
import { useRouter } from "next/navigation";
import { useSessionStore } from "@/store/session";
import { ThemeToggle } from "@/components/header/theme-toggle";

export function Header() {
  const open = useUIStore((s) => s.miniCartOpen);
  const setOpen = (v: boolean) => useUIStore.getState().setMiniCartOpen(v);
  const router = useRouter();
  const user = useSessionStore((s) => s.user);
  const isAdmin = user?.role === "admin";
  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <Container className="flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-base font-semibold text-brand" aria-label="Página inicial">
            Visão da Vila
          </Link>
          <Nav />
        </div>
        <SearchBox />
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link
            href={user ? "/conta" : "/conta/login"}
            aria-label="Área do cliente"
            className="hidden md:inline text-zinc-800 hover:text-zinc-900"
          >
            Área do cliente
          </Link>
          <Link
            href={isAdmin ? "/admin" : "/admin/login"}
            aria-label="Painel admin"
            className="hidden md:inline text-zinc-800 hover:text-zinc-900"
          >
            Admin
          </Link>
          <Link href={user ? "/conta" : "/conta/login"} aria-label="Minha conta" className="text-zinc-800 hover:text-zinc-900">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21a8 8 0 1 0-16 0" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </Link>
          <button aria-label="Wishlist" className="text-zinc-800 hover:text-zinc-900">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
          <button
            aria-label="Carrinho"
            className="text-zinc-800 hover:text-zinc-900"
            onMouseEnter={() => {
              router.prefetch?.("/checkout");
              router.prefetch?.("/carrinho");
            }}
            onClick={() => setOpen(true)}
          >
            <CartBadge />
          </button>
        </div>
      </Container>
      <MiniCart open={open} onClose={() => setOpen(false)} />
    </header>
  );
}
