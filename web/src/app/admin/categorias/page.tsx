"use client";
import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Item = { id: string; name: string; slug: string };

export default function AdminCategoriesPage() {
  const [list, setList] = React.useState<Item[]>([]);
  const [name, setName] = React.useState("");
  const [slug, setSlug] = React.useState("");

  const load = React.useCallback(() => {
    fetch("/categories").then((r) => r.json()).then(setList).catch(() => setList([]));
  }, []);
  React.useEffect(() => { load(); }, [load]);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/categories", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, slug }) });
    setName(""); setSlug("");
    load();
  }
  async function remove(id: string) {
    if (!confirm("Excluir categoria?")) return;
    await fetch(`/categories/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <div className="heading-3">Categorias</div>
      <form onSubmit={add} className="mt-4 flex gap-2">
        <Input placeholder="Nome" value={name} onChange={(e) => setName(e.target.value)} required />
        <Input placeholder="slug" value={slug} onChange={(e) => setSlug(e.target.value)} required />
        <Button type="submit">Adicionar</Button>
      </form>
      <ul className="mt-4 divide-y rounded border text-sm">
        {list.map((c) => (
          <li key={c.id} className="flex items-center justify-between p-2">
            <span>{c.name} ({c.slug})</span>
            <Button variant="outline" onClick={() => remove(c.id)}>Excluir</Button>
          </li>
        ))}
      </ul>
    </div>
  );
}

