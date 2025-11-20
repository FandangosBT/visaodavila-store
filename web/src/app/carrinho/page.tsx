"use client";
import * as React from "react";
import Image from "next/image";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPriceBRL } from "@/lib/format";
import {
  fetchCart,
  updateQty,
  removeItem,
  applyCoupon,
  subtotal,
  discountFromCoupon,
  type CartAPI,
} from "@/lib/cart";
import { ShippingCalculator } from "@/components/product/shipping-calculator";
import Link from "next/link";

export default function CartPage() {
  const [cart, setCart] = React.useState<CartAPI | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [coupon, setCoupon] = React.useState("");
  const [ship, setShip] = React.useState<{ label: string; price: number } | null>(null);

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const c = await fetchCart();
      setCart(c);
      setCoupon(c.couponCode || "");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  async function changeQty(id: string, q: number) {
    await updateQty(id, Math.max(1, q));
    await load();
  }
  async function remove(id: string) {
    await removeItem(id);
    await load();
  }
  async function apply() {
    await applyCoupon(coupon);
    await load();
  }

  if (loading) return <div className="p-6">Carregando carrinho…</div>;
  if (!cart || cart.items.length === 0)
    return (
      <Container>
        <div className="py-10 text-center">
          <div className="heading-3">Seu carrinho está vazio</div>
          <Link href="/">
            <Button className="mt-4">Continuar comprando</Button>
          </Link>
        </div>
      </Container>
    );

  const sub = subtotal(cart);
  const rate = discountFromCoupon(cart.couponCode);
  const discount = Math.round(sub * rate * 100) / 100;
  const shipping = ship?.price ?? 0;
  const total = Math.max(0, sub - discount) + shipping;

  return (
    <main className="py-8">
      <Container>
        <h1 className="heading-2">Carrinho</h1>
        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_24rem]">
          <div className="space-y-4">
            {cart.items.map((it) => (
              <div key={it.id} className="flex gap-4 rounded-[var(--radius-lg)] border border-zinc-200 p-3">
                <div className="relative h-24 w-24 overflow-hidden rounded border">
                  {it.product?.images?.[0] && (
                    <Image src={it.product.images[0]} alt={it.product?.name || "produto"} fill className="object-cover" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-zinc-800">{it.product?.name}</div>
                  <div className="text-xs text-zinc-500">
                    {it.color && <span>cor: {it.color} </span>}
                    {it.size && <span>tam: {it.size}</span>}
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-sm">
                    <button className="rounded border px-2" onClick={() => changeQty(it.id, it.quantity - 1)}>-</button>
                    <span className="w-8 text-center">{it.quantity}</span>
                    <button className="rounded border px-2" onClick={() => changeQty(it.id, it.quantity + 1)}>+</button>
                    <button className="ml-auto text-xs text-red-600" onClick={() => remove(it.id)}>Remover</button>
                  </div>
                </div>
                <div className="text-sm font-semibold text-zinc-900">
                  {formatPriceBRL((it.product?.salePrice ?? it.product?.price ?? 0) * it.quantity)}
                </div>
              </div>
            ))}
          </div>

          <aside className="space-y-4">
            <div className="rounded-[var(--radius-lg)] border border-zinc-200 p-4">
              <div className="text-sm font-semibold text-zinc-800">Cupom</div>
              <div className="mt-2 flex gap-2">
                <Input value={coupon} onChange={(e) => setCoupon(e.target.value)} placeholder="Ex.: OFF10" />
                <Button onClick={apply}>Aplicar</Button>
              </div>
              {rate > 0 && <div className="mt-1 text-xs text-emerald-600">Cupom aplicado: {cart.couponCode}</div>}
            </div>

            <div className="rounded-[var(--radius-lg)] border border-zinc-200 p-4">
              <div className="text-sm font-semibold text-zinc-800">Frete</div>
              <ShippingChooser onChoose={(o) => setShip(o)} />
            </div>

            <div className="rounded-[var(--radius-lg)] border border-zinc-200 p-4 text-sm">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span>{formatPriceBRL(sub)}</span>
              </div>
              <div className="mt-1 flex items-center justify-between">
                <span>Descontos</span>
                <span>- {formatPriceBRL(discount)}</span>
              </div>
              <div className="mt-1 flex items-center justify-between">
                <span>Frete</span>
                <span>{ship ? formatPriceBRL(shipping) : "—"}</span>
              </div>
              <div className="mt-2 border-t pt-2 text-base font-semibold">
                <div className="flex items-center justify-between">
                  <span>Total</span>
                  <span>{formatPriceBRL(total)}</span>
                </div>
              </div>
              <Link href="/checkout">
                <Button className="mt-3 w-full">Finalizar compra</Button>
              </Link>
            </div>
          </aside>
        </div>
      </Container>
    </main>
  );
}

function ShippingChooser({ onChoose }: { onChoose: (o: { label: string; price: number }) => void }) {
  const [cep, setCep] = React.useState("");
  const [options, setOptions] = React.useState<{ label: string; price: number }[]>([]);
  const [loading, setLoading] = React.useState(false);

  const calc = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    const clean = cep.replace(/\D/g, "");
    if (clean.length >= 8) {
      const region = Number(clean[0]);
      const base = 19.9 + region * 2;
      const opts = [
        { label: `Econômico · ${8 - Math.min(region, 5)} dias`, price: Math.max(14.9, base) },
        { label: `Rápido · ${3 + Math.max(0, 5 - region)} dias`, price: Math.max(24.9, base + 10) },
      ];
      setOptions(opts);
    } else setOptions([]);
    setLoading(false);
  };

  return (
    <div>
      <form className="mt-2 flex gap-2" onSubmit={calc}>
        <Input value={cep} onChange={(e) => setCep(e.target.value)} placeholder="Digite seu CEP" required />
        <Button type="submit" disabled={loading}>
          {loading ? "Calculando..." : "Calcular"}
        </Button>
      </form>
      {options.length > 0 && (
        <ul className="mt-3 space-y-2">
          {options.map((o, i) => (
            <li key={i}>
              <label className="flex cursor-pointer items-center justify-between rounded border border-zinc-200 p-2 text-sm">
                <input
                  type="radio"
                  name="ship"
                  className="mr-2"
                  onChange={() => onChoose(o)}
                />
                <span>{o.label}</span>
                <span className="font-medium">{formatPriceBRL(o.price)}</span>
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

