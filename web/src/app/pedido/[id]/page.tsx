"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/layout/container";
import { formatPriceBRL } from "@/lib/format";

type Order = {
  id: string;
  items: { quantity: number; price: number; salePrice?: number; productId: string }[];
  total: number;
  createdAt: string;
};

export default function OrderConfirmation({ params }: { params: { id: string } }) {
  const [order, setOrder] = React.useState<Order | null>(null);
  const router = useRouter();

  React.useEffect(() => {
    fetch("/orders")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((list: Order[]) => {
        const found = list.find((o) => o.id === params.id) || null;
        setOrder(found);
      })
      .catch(() => setOrder(null));
  }, [params.id]);

  if (!order) return <div className="p-6">Pedido não encontrado ou sessão expirada.</div>;

  return (
    <main className="py-8">
      <Container>
        <h1 className="heading-2">Pedido confirmado</h1>
        <div className="mt-2 text-sm text-zinc-600">Número do pedido: {order.id}</div>
        <div className="mt-6 rounded border border-zinc-200 p-4">
          <div className="text-sm font-semibold text-zinc-800">Resumo</div>
          <div className="mt-2 text-sm">Itens: {order.items.length}</div>
          <div className="mt-1 text-base font-semibold">Total: {formatPriceBRL(order.total)}</div>
        </div>
      </Container>
    </main>
  );
}

