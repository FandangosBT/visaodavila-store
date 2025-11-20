"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchCart, subtotal, discountFromCoupon, type CartAPI } from "@/lib/cart";
import { formatPriceBRL } from "@/lib/format";

type Step = "login" | "address" | "shipping" | "payment" | "review";

export default function CheckoutPage() {
  const router = useRouter();
  const [step, setStep] = React.useState<Step>("login");
  const [user, setUser] = React.useState<{ email: string } | null>(null);
  const [cart, setCart] = React.useState<CartAPI | null>(null);
  const [address, setAddress] = React.useState({ name: "", cep: "", street: "", number: "", city: "", uf: "" });
  const [ship, setShip] = React.useState<{ label: string; price: number } | null>(null);
  const [payment, setPayment] = React.useState<"pix" | "card" | "boleto" | null>(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    fetchCart().then(setCart).catch(() => setCart(null));
  }, []);

  const sub = cart ? subtotal(cart) : 0;
  const rate = discountFromCoupon(cart?.couponCode);
  const discount = Math.round(sub * rate * 100) / 100;
  const shipping = ship?.price ?? 0;
  const total = Math.max(0, sub - discount) + shipping;

  async function login(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") || "");
    const password = String(form.get("password") || "");
    setLoading(true);
    const res = await fetch("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    setLoading(false);
    if (res.ok) {
      setUser({ email });
      setStep("address");
    } else {
      alert("Falha no login. Use cliente@demo.com / 123456");
    }
  }

  async function confirmOrder() {
    setLoading(true);
    const res = await fetch("/orders", { method: "POST" });
    setLoading(false);
    if (res.ok) {
      const order = await res.json();
      router.push(`/pedido/${order.id}`);
    } else {
      alert("Erro ao criar pedido");
    }
  }

  return (
    <main className="py-8">
      <Container>
        <h1 className="heading-2">Checkout</h1>

        {step === "login" && (
          <section className="mt-6 grid max-w-md gap-3">
            <div className="text-sm text-zinc-600">Faça login para prosseguir (use o demo)</div>
            <form onSubmit={login} className="grid gap-2">
              <Input name="email" type="email" placeholder="cliente@demo.com" defaultValue="cliente@demo.com" required />
              <Input name="password" type="password" placeholder="senha" defaultValue="123456" required />
              <Button type="submit" disabled={loading}>{loading ? "Entrando..." : "Entrar"}</Button>
            </form>
          </section>
        )}

        {step === "address" && (
          <section className="mt-6 grid max-w-xl gap-2">
            <div className="text-sm text-zinc-600">Endereço de entrega</div>
            <Input placeholder="Nome completo" value={address.name} onChange={(e) => setAddress({ ...address, name: e.target.value })} />
            <Input placeholder="CEP" value={address.cep} onChange={(e) => import("@/lib/masks").then(({ maskCEP }) => setAddress({ ...address, cep: maskCEP(e.target.value) }))} />
            <div className="grid grid-cols-3 gap-2">
              <Input placeholder="Rua" value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} className="col-span-2" />
              <Input placeholder="Número" value={address.number} onChange={(e) => setAddress({ ...address, number: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="Cidade" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
              <Input placeholder="UF" value={address.uf} onChange={(e) => setAddress({ ...address, uf: e.target.value })} />
            </div>
            <div className="mt-2 flex gap-2">
              <Button variant="outline" onClick={() => setStep("login")}>Voltar</Button>
              <Button onClick={() => setStep("shipping")}>Continuar</Button>
            </div>
          </section>
        )}

        {step === "shipping" && (
          <section className="mt-6 max-w-xl">
            <div className="text-sm font-semibold text-zinc-800">Entrega</div>
            <ShippingStep cep={address.cep} onSelect={(o) => setShip(o)} selected={ship} />
            <div className="mt-2 flex gap-2">
              <Button variant="outline" onClick={() => setStep("address")}>Voltar</Button>
              <Button onClick={() => setStep("payment")} disabled={!ship}>Continuar</Button>
            </div>
          </section>
        )}

        {step === "payment" && (
          <section className="mt-6 max-w-xl">
            <div className="text-sm font-semibold text-zinc-800">Pagamento</div>
            <div className="mt-2 grid gap-2">
              <label className="flex items-center gap-2 rounded border border-zinc-200 p-2">
                <input type="radio" name="pay" onChange={() => setPayment("pix")} /> PIX
              </label>
              <label className="flex items-center gap-2 rounded border border-zinc-200 p-2">
                <input type="radio" name="pay" onChange={() => setPayment("card")} /> Cartão de crédito
              </label>
              <label className="flex items-center gap-2 rounded border border-zinc-200 p-2">
                <input type="radio" name="pay" onChange={() => setPayment("boleto")} /> Boleto
              </label>
            </div>
            <div className="mt-2 flex gap-2">
              <Button variant="outline" onClick={() => setStep("shipping")}>Voltar</Button>
              <Button onClick={() => setStep("review")} disabled={!payment}>Revisar pedido</Button>
            </div>
          </section>
        )}

        {step === "review" && cart && (
          <section className="mt-6 grid gap-4 lg:grid-cols-[1fr_24rem]">
            <div className="space-y-2">
              <div className="text-sm font-semibold text-zinc-800">Itens</div>
              <ul className="space-y-2 text-sm">
                {cart.items.map((it) => (
                  <li key={it.id} className="flex items-center justify-between rounded border border-zinc-200 p-2">
                    <span className="truncate">{it.product?.name}</span>
                    <span>
                      {it.quantity} x {formatPriceBRL(it.product?.salePrice ?? it.product?.price ?? 0)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <aside className="rounded border border-zinc-200 p-4 text-sm">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span>{formatPriceBRL(sub)}</span>
              </div>
              <div className="mt-1 flex items-center justify-between">
                <span>Descontos</span>
                <span>- {formatPriceBRL(Math.round(sub * rate * 100) / 100)}</span>
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
              <div className="mt-3 flex gap-2">
                <Button variant="outline" onClick={() => setStep("payment")}>Voltar</Button>
                <Button onClick={confirmOrder} disabled={loading}>{loading ? "Confirmando..." : "Confirmar pedido"}</Button>
              </div>
            </aside>
          </section>
        )}
      </Container>
    </main>
  );
}

function ShippingStep({ cep, onSelect, selected }: { cep: string; onSelect: (o: { label: string; price: number }) => void; selected: { label: string; price: number } | null }) {
  const [options, setOptions] = React.useState<{ label: string; price: number }[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [value, setValue] = React.useState(cep);

  async function calc(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    const clean = value.replace(/\D/g, "");
    if (clean.length >= 8) {
      const region = Number(clean[0]);
      const base = 19.9 + region * 2;
      setOptions([
        { label: `Econômico · ${8 - Math.min(region, 5)} dias`, price: Math.max(14.9, base) },
        { label: `Rápido · ${3 + Math.max(0, 5 - region)} dias`, price: Math.max(24.9, base + 10) },
      ]);
    } else setOptions([]);
    setLoading(false);
  }

  return (
    <div>
      <form className="mt-2 flex gap-2" onSubmit={calc}>
        <Input value={value} onChange={(e) => setValue(e.target.value)} placeholder="CEP" required />
        <Button type="submit" disabled={loading}>{loading ? "Calculando..." : "Calcular"}</Button>
      </form>
      <ul className="mt-3 space-y-2">
        {options.map((o, i) => (
          <li key={i}>
            <label className="flex cursor-pointer items-center justify-between rounded border border-zinc-200 p-2 text-sm">
              <input type="radio" name="ship-step" onChange={() => onSelect(o)} checked={selected?.label === o.label} />
              <span>{o.label}</span>
              <span className="font-medium">{formatPriceBRL(o.price)}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
