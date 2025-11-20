"use client";
import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Drawer } from "@/components/overlay/drawer";
import { Button } from "@/components/ui/button";
import { formatPriceBRL } from "@/lib/format";
import { fetchCart, updateQty, removeItem, subtotal, type CartAPI } from "@/lib/cart";

export function MiniCart({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [cart, setCart] = React.useState<CartAPI | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [undoItem, setUndoItem] = React.useState<{ productId: string; quantity: number; color?: string; size?: string } | null>(null);
  const undoTimer = React.useRef<number | null>(null);
  const [undoProgress, setUndoProgress] = React.useState(0);
  const pendingTimers = React.useRef<Record<string, number>>({});
  const [updating, setUpdating] = React.useState<Record<string, boolean>>({});

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const c = await fetchCart();
      setCart(c);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (open) load();
  }, [open, load]);

  function changeOptimistic(id: string, q: number) {
    const qty = Math.max(1, q);
    setCart((prev) => {
      if (!prev) return prev;
      const items = prev.items.map((it) => (it.id === id ? { ...it, quantity: qty } : it));
      return { ...prev, items } as CartAPI;
    });
    setUpdating((u) => ({ ...u, [id]: true }));
    if (pendingTimers.current[id]) window.clearTimeout(pendingTimers.current[id]);
    pendingTimers.current[id] = window.setTimeout(async () => {
      try {
        await updateQty(id, qty);
        await load();
      } finally {
        setUpdating((u) => ({ ...u, [id]: false }));
        delete pendingTimers.current[id];
      }
    }, 350);
  }
  async function remove(id: string) {
    // capturar dados para possível undo
    const it = cart?.items.find((x) => x.id === id);
    const productId = it?.product?.id || it?.productId;
    const quantity = it?.quantity || 1;
    const color = (it as any)?.color;
    const size = (it as any)?.size;
    // otimista: remover localmente
    setCart((prev) => (prev ? { ...prev, items: prev.items.filter((i) => i.id !== id) } : prev));
    try {
      await removeItem(id);
    } catch {
      // reconciliar em caso de falha
      await load();
    }
    if (productId) {
      setUndoItem({ productId, quantity, color, size });
      setUndoProgress(100);
      if (undoTimer.current) window.clearTimeout(undoTimer.current);
      const start = Date.now();
      const total = 3000;
      const tick = () => {
        const elapsed = Date.now() - start;
        const pct = Math.max(0, 100 - Math.round((elapsed / total) * 100));
        setUndoProgress(pct);
        if (elapsed >= total) {
          setUndoItem(null);
          return;
        }
        undoTimer.current = window.setTimeout(tick, 100);
      };
      undoTimer.current = window.setTimeout(tick, 100);
    }
  }

  async function undoRemove() {
    if (!undoItem) return;
    await fetch("/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(undoItem),
    });
    setUndoItem(null);
    await load();
  }

  const total = cart ? subtotal(cart) : 0;

  return (
    <Drawer open={open} onClose={onClose} title="Seu carrinho">
      {loading && <div className="p-2 text-sm text-zinc-600">Carregando…</div>}
      {!loading && cart && cart.items.length === 0 && (
        <div className="p-4 text-sm text-zinc-700">
          <div className="text-zinc-800">Seu carrinho está vazio.</div>
          <div className="mt-2 flex gap-2">
            <Link href="/" className="w-1/2">
              <Button className="w-full" onClick={onClose}>Ver novidades</Button>
            </Link>
            <Link href="/categoria/camisetas" className="w-1/2">
              <Button variant="outline" className="w-full" onClick={onClose}>Explorar coleções</Button>
            </Link>
          </div>
        </div>
      )}
      {!loading && cart && cart.items.length > 0 && (
        <div className="flex h-full flex-col">
          <ul className="flex-1 space-y-3 pb-28">
            {cart.items.map((it) => {
              const unit = it.product ? (it.product.salePrice ?? it.product.price ?? 0) : 0;
              const base = it.product?.price ?? unit;
              const save = base > unit ? base - unit : 0;
              return (
                <li key={it.id} className={"flex gap-3 " + (updating[it.id] ? "opacity-70" : "") }>
                  <div className="relative h-16 w-16 overflow-hidden rounded border">
                    {it.product?.images?.[0] && (
                      <Image src={it.product.images[0]} alt={it.product?.name || "produto"} fill className="object-cover" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-zinc-800">{it.product?.name}</div>
                    <div className="text-xs text-zinc-500">
                      {it.color && <span>cor: {it.color} </span>}
                      {it.size && <span>tam: {it.size}</span>}
                    </div>
                    <div className="mt-1 text-xs text-zinc-500">
                      <span>un: {formatPriceBRL(unit)}</span>
                      {save > 0 && <span className="ml-2 text-emerald-600">economize {formatPriceBRL(save)}</span>}
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-sm">
                      <button
                        className="inline-flex h-11 w-11 items-center justify-center rounded border text-lg leading-none transition-transform active:scale-95"
                        aria-label={`Diminuir quantidade de ${it.product?.name ?? "produto"}`}
                        onClick={() => changeOptimistic(it.id, it.quantity - 1)}
                      >
                        −
                      </button>
                      <span className="w-6 text-center">{it.quantity}</span>
                      <button
                        className="inline-flex h-11 w-11 items-center justify-center rounded border text-lg leading-none transition-transform active:scale-95"
                        aria-label={`Aumentar quantidade de ${it.product?.name ?? "produto"}`}
                        onClick={() => changeOptimistic(it.id, it.quantity + 1)}
                      >
                        ＋
                      </button>
                      <div role="status" aria-live="polite" className="sr-only">
                        {updating[it.id] ? "Atualizando a quantidade" : ""}
                      </div>
                      {updating[it.id] && <span className="ml-2 text-xs text-zinc-500">Atualizando…</span>}
                      <button
                        className="ml-auto text-xs text-red-600 hover:underline"
                        aria-label={`Remover ${it.product?.name ?? "produto"}`}
                        onClick={() => remove(it.id)}
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-zinc-800">
                    {formatPriceBRL(unit * it.quantity)}
                  </div>
                </li>
              );
            })}
          </ul>
          {/* sticky footer area */}
          <div className="sticky bottom-0 mt-3 space-y-3 border-t bg-white p-3" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
            {undoItem && (
              <div className="space-y-2 rounded-md bg-zinc-50 p-2 text-xs text-zinc-700">
                <div className="flex items-center justify-between">
                  <span>Item removido</span>
                  <button className="link-underline" onClick={undoRemove} aria-label="Desfazer remoção">Desfazer</button>
                </div>
                <div className="h-1 w-full overflow-hidden rounded bg-zinc-200">
                  <div className="h-full bg-zinc-500" style={{ width: `${undoProgress}%` }} />
                </div>
              </div>
            )}
            <div className="flex items-center justify-between text-sm">
              <span>Subtotal</span>
              <span className="font-semibold">{formatPriceBRL(total)}</span>
            </div>
            {/* Frete grátis mock */}
            <FreeShippingHint subtotal={total} />
            <div className="flex gap-2">
              <Link href="/carrinho" className="w-1/2">
                <Button variant="outline" className="w-full" onClick={onClose}>
                  Ver carrinho
                </Button>
              </Link>
              <Link href="/checkout" className="w-1/2">
                <Button className="w-full" onClick={onClose}>
                  Finalizar compra
                </Button>
              </Link>
            </div>
            <button className="link-underline text-left text-sm text-zinc-700" onClick={onClose}>
              Continuar comprando
            </button>
          </div>
        </div>
      )}
    </Drawer>
  );
}

function FreeShippingHint({ subtotal }: { subtotal: number }) {
  const threshold = 199;
  const remain = Math.max(0, threshold - subtotal);
  const pct = Math.min(100, Math.round((subtotal / threshold) * 100));
  if (remain <= 0)
    return <div className="text-xs text-emerald-700">Você ganhou frete grátis 🎉</div>;
  return (
    <div>
      <div className="text-xs text-zinc-600">Faltam {formatPriceBRL(remain)} para frete grátis</div>
      <div className="mt-1 h-2 w-full overflow-hidden rounded bg-zinc-200">
        <div className="h-full bg-emerald-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
