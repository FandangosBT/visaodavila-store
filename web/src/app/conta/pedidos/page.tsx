"use client";
import * as React from "react";
import Link from "next/link";

export default function OrdersListPage() {
  const [orders, setOrders] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(true);
    fetch("/orders").then((r) => (r.ok ? r.json() : [])).then(setOrders).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="heading-3">Meus pedidos</div>
      {loading ? (
        <div className="mt-3">Carregando…</div>
      ) : orders.length === 0 ? (
        <div className="mt-3 text-zinc-600">Você ainda não possui pedidos.</div>
      ) : (
        <ul className="mt-4 divide-y rounded border">
          {orders.map((o) => (
            <li key={o.id} className="flex items-center justify-between p-3 text-sm">
              <div>
                <div className="font-medium text-zinc-800">{o.id}</div>
                <div className="text-zinc-600">{new Date(o.createdAt).toLocaleString()} · {o.status}</div>
              </div>
              <Link className="text-primary hover:underline" href={`/conta/pedidos/${o.id}`}>ver detalhes</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

