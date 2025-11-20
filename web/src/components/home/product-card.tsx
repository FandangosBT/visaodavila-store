"use client";
import * as React from "react";
import Image from "next/image";
import { formatPriceBRL } from "@/lib/format";
import { installments } from "@/lib/installments";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/feedback/toast";

export type Product = {
  id: string;
  name: string;
  price: number;
  salePrice?: number;
  images: string[];
  colors: string[];
  sizes: string[];
  rating: number;
  stock?: number;
};

export function ProductCard({ p, isNew }: { p: Product; isNew?: boolean }) {
  const { show } = useToast();
  const price = p.salePrice ?? p.price;
  const ins = installments(price, 3);
  const [added, setAdded] = React.useState(false);
  const outOfStock = (p as any).stock !== undefined ? (p as any).stock <= 0 : false;

  async function addToCart() {
    await fetch("/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: p.id, quantity: 1 }),
    });
    // Refresh cart store count
    const { refresh } = await import("@/store/cart").then((m) => ({ refresh: m.useCartStore.getState().refresh }));
    refresh();
    show({ title: "Adicionado", message: `${p.name} no carrinho`, variant: "success" });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <article className="group rounded-lg border border-zinc-200 p-3 hover:shadow-sm">
      <div className="relative aspect-[3/4] overflow-hidden rounded-md bg-zinc-100">
        <Image
          src={p.images[0]}
          alt={p.name}
          fill
          className="object-cover transition-transform duration-200 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
      </div>
      <h3 className="mt-3 line-clamp-2 text-sm text-zinc-800">{p.name}</h3>
      <div className="mt-1 flex items-center gap-2">
        <span className="price">{formatPriceBRL(price)}</span>
        {p.salePrice && <span className="price-old">{formatPriceBRL(p.price)}</span>}
        {p.salePrice && (
          <span className="ml-auto rounded bg-accent/10 px-1.5 py-0.5 text-xs font-medium text-accent">
            Promo
          </span>
        )}
        {!p.salePrice && isNew && (
          <span className="ml-auto rounded bg-zinc-900/10 px-1.5 py-0.5 text-xs font-medium text-zinc-700">
            Novo
          </span>
        )}
        {outOfStock && (
          <span className="ml-auto rounded bg-zinc-200 px-1.5 py-0.5 text-xs font-medium text-zinc-700">
            Esgotado
          </span>
        )}
      </div>
      <div className="mt-1 text-xs text-zinc-500">ou {ins.parts}x de {formatPriceBRL(ins.value)}</div>
      <div className="mt-2 flex items-center gap-2">
        {p.colors.slice(0, 3).map((c) => (
          <span key={c} className="rounded border px-1.5 py-0.5 text-xs text-zinc-600">
            {c}
          </span>
        ))}
      </div>
      {/* Região para anúncio acessível de ações */}
      <div role="status" aria-live="polite" className="sr-only">
        {added ? `${p.name} adicionado ao carrinho` : ""}
      </div>
      <Button
        className="mt-3 w-full"
        onClick={addToCart}
        variant="secondary"
        aria-label={`Adicionar ${p.name} ao carrinho`}
        disabled={outOfStock}
      >
        {outOfStock ? "Esgotado" : added ? "Adicionado ✓" : "Adicionar ao carrinho"}
      </Button>
    </article>
  );
}
