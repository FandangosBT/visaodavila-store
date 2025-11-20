"use client";
import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Product = {
  id: string;
  name: string;
  price: number;
  salePrice?: number;
  stock: number;
  images: string[];
  colors: string[];
  sizes: string[];
  categoryId?: string;
  collectionIds?: string[];
};

export default function AdminProductsPage() {
  const [list, setList] = React.useState<Product[]>([]);
  const [q, setQ] = React.useState("");
  const [form, setForm] = React.useState<Partial<Product>>({ name: "", price: 99.9, stock: 10, images: [], colors: ["preto"], sizes: ["M"] });
  const [editing, setEditing] = React.useState<string | null>(null);

  const load = React.useCallback(() => {
    fetch("/products").then((r) => r.json()).then(setList).catch(() => setList([]));
  }, []);

  React.useEffect(() => { load(); }, [load]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const body = { ...form, images: form.images?.length ? form.images : ["https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop"] } as Product;
    if (editing) {
      await fetch(`/products/${editing}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    } else {
      await fetch(`/products`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    }
    setForm({ name: "", price: 99.9, stock: 10, images: [], colors: ["preto"], sizes: ["M"] });
    setEditing(null);
    load();
  }

  async function remove(id: string) {
    if (!window.confirm("Excluir produto?")) return;
    await fetch(`/products/${id}`, { method: "DELETE" });
    load();
  }

  const filtered = list.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div>
      <div className="heading-3">Produtos</div>
      <div className="mt-4 grid gap-4 lg:grid-cols-[24rem_1fr]">
        <form onSubmit={save} className="rounded border border-zinc-200 p-4 text-sm">
          <div className="font-semibold text-zinc-800">{editing ? "Editar" : "Novo"} produto</div>
          <div className="mt-2 grid gap-2">
            <Input placeholder="Nome" value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <Input type="number" step="0.01" placeholder="Preço" value={form.price as any} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} required />
            <Input type="number" step="0.01" placeholder="Preço promo (opcional)" value={(form.salePrice as any) || ""} onChange={(e) => setForm({ ...form, salePrice: e.target.value ? Number(e.target.value) : undefined })} />
            <Input type="number" placeholder="Estoque" value={form.stock as any} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} required />
            <Input placeholder="URL da imagem" value={(form.images?.[0] as any) || ""} onChange={(e) => setForm({ ...form, images: [e.target.value] })} />
            <Button type="submit">{editing ? "Salvar alterações" : "Criar produto"}</Button>
            {editing && <Button type="button" variant="outline" onClick={() => { setEditing(null); setForm({ name: "", price: 99.9, stock: 10, images: [], colors: ["preto"], sizes: ["M"] }); }}>Cancelar</Button>}
          </div>
        </form>

        <div>
          <div className="mb-3 flex items-center gap-2">
            <Input placeholder="Buscar por nome" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-zinc-600">
                <th className="p-2">ID</th>
                <th className="p-2">Nome</th>
                <th className="p-2">Preço</th>
                <th className="p-2">Estoque</th>
                <th className="p-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="p-2">{p.id}</td>
                  <td className="p-2">{p.name}</td>
                  <td className="p-2">R$ {p.salePrice ?? p.price}</td>
                  <td className="p-2">{p.stock}</td>
                  <td className="p-2">
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => { setEditing(p.id); setForm(p); }}>Editar</Button>
                      <Button variant="outline" onClick={() => remove(p.id)}>Excluir</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

