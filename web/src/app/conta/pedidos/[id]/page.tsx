"use client";
import * as React from "react";
import { useToast } from "@/components/feedback/toast";
import { formatPriceBRL } from "@/lib/format";

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = React.useState<any | null>(null);
  const [loading, setLoading] = React.useState(true);
  const { show } = useToast();

  React.useEffect(() => {
    setLoading(true);
    fetch(`/orders/${params.id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then(setOrder)
      .finally(() => setLoading(false));
  }, [params.id]);

  function requestReturn() {
    show({ title: "Solicitação enviada", message: "Nossa equipe entrará em contato.", variant: "success" });
  }

  if (loading) return <div>Carregando…</div>;
  if (!order) return <div>Pedido não encontrado.</div>;

  const tracking = `TRK${order.id.slice(-6).toUpperCase()}`;

  return (
    <div>
      <div className="heading-3">Pedido {order.id}</div>
      <div className="mt-1 text-sm text-zinc-600">{new Date(order.createdAt).toLocaleString()} · {order.status}</div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_24rem]">
        <div>
          <div className="text-sm font-semibold text-zinc-800">Itens</div>
          <ul className="mt-2 divide-y rounded border">
            {order.items.map((it: any, i: number) => (
              <li key={i} className="flex items-center justify-between p-3 text-sm">
                <span>{it.quantity} x Produto {it.productId}</span>
                <span>{formatPriceBRL((it.salePrice ?? it.price) * it.quantity)}</span>
              </li>
            ))}
          </ul>
        </div>
        <aside className="rounded border p-4 text-sm">
          <div className="font-semibold text-zinc-800">Rastreamento</div>
          <div className="mt-1">Código: {tracking}</div>
          <ul className="mt-2 space-y-1 text-zinc-700">
            <li>Pedido recebido</li>
            <li>Separado no estoque</li>
            <li>Em transporte</li>
          </ul>
          <button className="mt-4 text-primary" onClick={requestReturn}>Solicitar troca/devolução</button>
        </aside>
      </div>
    </div>
  );
}

