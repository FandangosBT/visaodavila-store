"use client";
import * as React from "react";
import { formatPriceBRL } from "@/lib/format";

export default function AdminDashboard() {
  const [kpis, setKpis] = React.useState<{ ordersCount: number; revenue: number; avgTicket: number } | null>(null);

  React.useEffect(() => {
    fetch("/admin/kpis").then((r) => (r.ok ? r.json() : null)).then(setKpis).catch(() => setKpis(null));
  }, []);

  return (
    <div>
      <div className="heading-3">Dashboard</div>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <KpiCard label="Faturamento" value={kpis ? formatPriceBRL(kpis.revenue) : "—"} />
        <KpiCard label="Pedidos" value={kpis ? String(kpis.ordersCount) : "—"} />
        <KpiCard label="Ticket médio" value={kpis ? formatPriceBRL(kpis.avgTicket) : "—"} />
      </div>
      {kpis && <MiniBars title="Pedidos (mock)" values={[kpis.ordersCount % 7, 4, 6, 3, 8, 2, 5]} />}
    </div>
  );
}

function KpiCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-zinc-200 p-4">
      <div className="text-sm text-zinc-600">{label}</div>
      <div className="text-2xl font-semibold text-zinc-900">{value}</div>
    </div>
  );
}

function MiniBars({ title, values }: { title: string; values: number[] }) {
  const max = Math.max(...values, 1);
  return (
    <div className="mt-6 rounded-[var(--radius-lg)] border border-zinc-200 p-4">
      <div className="text-sm font-semibold text-zinc-800">{title}</div>
      <div className="mt-3 flex items-end gap-2">
        {values.map((v, i) => (
          <div key={i} className="w-8 rounded bg-primary" style={{ height: `${(v / max) * 100}px` }} />
        ))}
      </div>
    </div>
  );
}

