"use client";
import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Address } from "@/types";

async function list(): Promise<Address[]> {
  const r = await fetch("/addresses");
  if (!r.ok) return [];
  return await r.json();
}
async function create(addr: Omit<Address, "id">): Promise<Address | null> {
  const r = await fetch("/addresses", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(addr) });
  if (!r.ok) return null;
  return await r.json();
}
async function update(id: string, patch: Partial<Address>): Promise<Address | null> {
  const r = await fetch(`/addresses/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(patch) });
  if (!r.ok) return null;
  return await r.json();
}
async function del(id: string) {
  await fetch(`/addresses/${id}`, { method: "DELETE" });
}

export default function AddressesPage() {
  const [listAddr, setListAddr] = React.useState<Address[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [form, setForm] = React.useState<Omit<Address, "id">>({ name: "", cep: "", street: "", number: "", city: "", uf: "", complement: "" });

  const load = React.useCallback(() => {
    setLoading(true);
    list().then(setListAddr).finally(() => setLoading(false));
  }, []);

  React.useEffect(() => { load(); }, [load]);

  async function onAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.cep || !form.street || !form.number || !form.city || !form.uf) return;
    const created = await create(form);
    if (created) {
      setForm({ name: "", cep: "", street: "", number: "", city: "", uf: "", complement: "" });
      load();
    }
  }

  async function onEdit(id: string) {
    const current = listAddr.find((a) => a.id === id);
    if (!current) return;
    const name = window.prompt("Nome", current.name) ?? current.name;
    const city = window.prompt("Cidade", current.city) ?? current.city;
    const patch = await update(id, { name, city });
    if (patch) load();
  }

  async function onDelete(id: string) {
    if (!window.confirm("Excluir este endereço?")) return;
    await del(id);
    load();
  }

  return (
    <div>
      <div className="heading-3">Endereços</div>
      <form onSubmit={onAdd} className="mt-4 grid gap-2 rounded-[var(--radius-lg)] border border-zinc-200 p-4 sm:grid-cols-2 lg:grid-cols-3">
        <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nome completo" required />
        <Input value={form.cep} onChange={(e) => setForm({ ...form, cep: e.target.value })} placeholder="CEP" required />
        <Input value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} placeholder="Rua" required />
        <Input value={form.number} onChange={(e) => setForm({ ...form, number: e.target.value })} placeholder="Número" required />
        <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="Cidade" required />
        <Input value={form.uf} onChange={(e) => setForm({ ...form, uf: e.target.value })} placeholder="UF" required />
        <Input className="sm:col-span-2 lg:col-span-3" value={form.complement || ""} onChange={(e) => setForm({ ...form, complement: e.target.value })} placeholder="Complemento (opcional)" />
        <div className="sm:col-span-2 lg:col-span-3">
          <Button type="submit">Adicionar endereço</Button>
        </div>
      </form>

      <ul className="mt-6 space-y-3">
        {loading && <li>Carregando...</li>}
        {!loading && listAddr.length === 0 && <li className="text-zinc-600">Nenhum endereço cadastrado.</li>}
        {listAddr.map((a) => (
          <li key={a.id} className="rounded-[var(--radius-lg)] border border-zinc-200 p-3 text-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-zinc-800">{a.name}</div>
                <div className="text-zinc-600">{a.street}, {a.number} - {a.city}/{a.uf} · CEP {a.cep}</div>
                {a.complement && <div className="text-zinc-500">{a.complement}</div>}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => onEdit(a.id)}>Editar</Button>
                <Button variant="outline" onClick={() => onDelete(a.id)}>Excluir</Button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

