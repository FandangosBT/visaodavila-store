"use client";
import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Banner = { id: string; imageUrl: string; href?: string; title?: string; subtitle?: string };

export default function AdminContentPage() {
  const [banners, setBanners] = React.useState<Banner[]>([]);
  const [settings, setSettings] = React.useState<any | null>(null);
  const [form, setForm] = React.useState<Partial<Banner>>({ imageUrl: "", href: "", title: "", subtitle: "" });

  const load = React.useCallback(() => {
    fetch("/banners").then((r) => r.json()).then(setBanners).catch(() => setBanners([]));
    fetch("/settings").then((r) => r.json()).then(setSettings).catch(() => setSettings(null));
  }, []);
  React.useEffect(() => { load(); }, [load]);

  async function addBanner(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/banners", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setForm({ imageUrl: "", href: "", title: "", subtitle: "" });
    load();
  }
  async function removeBanner(id: string) {
    if (!confirm("Excluir banner?")) return;
    await fetch(`/banners/${id}`, { method: "DELETE" });
    load();
  }
  async function saveSettings(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/settings", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(settings) });
    load();
  }

  return (
    <div>
      <div className="heading-3">Conteúdo</div>
      <section className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="rounded border border-zinc-200 p-4">
          <div className="text-sm font-semibold text-zinc-800">Banners (hero)</div>
          <form onSubmit={addBanner} className="mt-2 grid gap-2">
            <Input placeholder="URL da imagem" value={form.imageUrl || ""} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} required />
            <Input placeholder="Link (opcional)" value={form.href || ""} onChange={(e) => setForm({ ...form, href: e.target.value })} />
            <Input placeholder="Título (opcional)" value={form.title || ""} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <Input placeholder="Subtítulo (opcional)" value={form.subtitle || ""} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} />
            <Button type="submit">Adicionar banner</Button>
          </form>
          <ul className="mt-3 divide-y rounded border text-sm">
            {banners.map((b) => (
              <li key={b.id} className="flex items-center justify-between p-2">
                <span className="truncate">{b.title || b.imageUrl}</span>
                <Button variant="outline" onClick={() => removeBanner(b.id)}>Excluir</Button>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded border border-zinc-200 p-4">
          <div className="text-sm font-semibold text-zinc-800">Configurações da loja</div>
          {settings && (
            <form onSubmit={saveSettings} className="mt-2 grid gap-2">
              <Input placeholder="Nome da loja" value={settings.storeName || ""} onChange={(e) => setSettings({ ...settings, storeName: e.target.value })} />
              <Input placeholder="Mensagem topbar" value={settings.topbarMessage || ""} onChange={(e) => setSettings({ ...settings, topbarMessage: e.target.value })} />
              <Button type="submit">Salvar configurações</Button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}

