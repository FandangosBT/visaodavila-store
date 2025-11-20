"use client";
import * as React from "react";
import Link from "next/link";
import { getSessionUser } from "@/lib/session";

export default function AccountDashboard() {
  const [name, setName] = React.useState<string>("");
  const [orders, setOrders] = React.useState<any[]>([]);
  const [addresses, setAddresses] = React.useState<any[]>([]);

  React.useEffect(() => {
    getSessionUser().then((u) => setName(u?.name || u?.email || ""));
    fetch("/orders").then((r) => (r.ok ? r.json() : [])).then(setOrders).catch(() => setOrders([]));
    fetch("/addresses").then((r) => (r.ok ? r.json() : [])).then(setAddresses).catch(() => setAddresses([]));
  }, []);

  return (
    <div>
      <div className="heading-3">Bem-vindo, {name}</div>
      <div className="mt-2 grid gap-6 sm:grid-cols-2">
        <div className="rounded-[var(--radius-lg)] border border-zinc-200 p-4">
          <div className="text-sm font-semibold text-zinc-800">Seus pedidos</div>
          <ul className="mt-2 text-sm">
            {orders.slice(0, 3).map((o) => (
              <li key={o.id} className="flex items-center justify-between border-b py-2 last:border-b-0">
                <span>{o.id}</span>
                <Link className="text-primary hover:underline" href={`/conta/pedidos/${o.id}`}>ver detalhes</Link>
              </li>
            ))}
            {orders.length === 0 && <li className="text-zinc-600">Você ainda não possui pedidos.</li>}
          </ul>
          <Link className="mt-2 inline-block text-sm text-primary hover:underline" href="/conta/pedidos">Ver todos</Link>
        </div>
        <div className="rounded-[var(--radius-lg)] border border-zinc-200 p-4">
          <div className="text-sm font-semibold text-zinc-800">Endereços</div>
          <div className="mt-2 text-sm text-zinc-700">{addresses.length} cadastrado(s)</div>
          <Link className="mt-2 inline-block text-sm text-primary hover:underline" href="/conta/enderecos">Gerenciar endereços</Link>
        </div>
      </div>
    </div>
  );
}

