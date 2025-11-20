"use client";
import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AdminSettingsPage() {
  const [settings, setSettings] = React.useState<any | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(true);
    fetch("/settings").then((r) => r.json()).then(setSettings).finally(() => setLoading(false));
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/settings", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(settings) });
  }

  if (loading) return <div>Carregando…</div>;
  if (!settings) return <div>Erro ao carregar.</div>;

  return (
    <div>
      <div className="heading-3">Configurações</div>
      <form onSubmit={save} className="mt-4 max-w-lg space-y-2">
        <Input placeholder="Nome da loja" value={settings.storeName || ""} onChange={(e) => setSettings({ ...settings, storeName: e.target.value })} />
        <Input placeholder="Mensagem de topbar" value={settings.topbarMessage || ""} onChange={(e) => setSettings({ ...settings, topbarMessage: e.target.value })} />
        <Button type="submit">Salvar</Button>
      </form>
    </div>
  );
}

