"use client";
import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatPriceBRL } from "@/lib/format";

type Order = { id: string; total: number; status: string; createdAt: string };

export default function AdminOrdersPage() {
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [loading, setLoading] = React.useState(true);

  const load = React.useCallback(() => {
    setLoading(true);
    fetch("/admin/orders").then((r) => (r.ok ? r.json() : [])).then(setOrders).finally(() => setLoading(false));
  }, []);

  React.useEffect(() => { load(); }, [load]);

  async function updateStatus(id: string, status: string) {
    await fetch(`/admin/orders/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    load();
  }

  function exportCSV() {
    const header = "id,total,status,createdAt\n";
    const lines = orders.map((o) => `${o.id},${o.total},${o.status},${o.createdAt}`);
    const csv = header + lines.join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "orders.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <div className="heading-3">Pedidos</div>
        <Button variant="outline" onClick={exportCSV}>Exportar CSV</Button>
      </div>
      {loading ? (
        <div>Carregando…</div>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-zinc-600">
              <th className="p-2">ID</th>
              <th className="p-2">Data</th>
              <th className="p-2">Total</th>
              <th className="p-2">Status</th>
              <th className="p-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t">
                <td className="p-2"><Link className="text-primary hover:underline" href={`/conta/pedidos/${o.id}`}>{o.id}</Link></td>
                <td className="p-2">{new Date(o.createdAt).toLocaleString()}</td>
                <td className="p-2">{formatPriceBRL(o.total)}</td>
                <td className="p-2">
                  <select className="rounded border p-1" value={o.status} onChange={(e) => updateStatus(o.id, e.target.value)}>
                    {['created','paid','shipped','delivered','canceled'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="p-2">—</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

