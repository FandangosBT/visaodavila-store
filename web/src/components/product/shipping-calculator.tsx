"use client";
import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatPriceBRL } from "@/lib/format";

type Option = { service: string; etaDays: number; price: number };

function simulate(cep: string): Option[] {
  const clean = cep.replace(/\D/g, "");
  if (clean.length < 8) return [];
  const region = Number(clean[0]);
  const base = 19.9 + region * 2;
  return [
    { service: "Econômico", etaDays: 8 - Math.min(region, 5), price: Math.max(14.9, base) },
    { service: "Rápido", etaDays: 3 + Math.max(0, 5 - region), price: Math.max(24.9, base + 10) },
  ];
}

export function ShippingCalculator() {
  const [cep, setCep] = React.useState("");
  const [options, setOptions] = React.useState<Option[]>([]);
  const [loading, setLoading] = React.useState(false);

  const onCalc = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    setOptions(simulate(cep));
    setLoading(false);
  };

  return (
    <div className="mt-6">
      <div className="text-sm font-semibold text-zinc-800">Calcular frete</div>
      <form className="mt-2 flex gap-2" onSubmit={onCalc}>
        <Input
          placeholder="Digite seu CEP"
          value={cep}
          onChange={(e) => setCep(e.target.value)}
          aria-label="CEP"
          required
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Calculando..." : "Calcular"}
        </Button>
      </form>
      {options.length > 0 && (
        <ul className="mt-3 space-y-1 text-sm text-zinc-700">
          {options.map((o, i) => (
            <li key={i} className="flex items-center justify-between rounded border border-zinc-200 px-3 py-2">
              <span>
                {o.service} · {o.etaDays} dias úteis
              </span>
              <span className="font-medium">{formatPriceBRL(o.price)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

