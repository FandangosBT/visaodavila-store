"use client";
import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/feedback/toast";

export default function ProfilePage() {
  const { show } = useToast();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch("/users/me")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => {
        setName(data.user?.name || "");
        setEmail(data.user?.email || "");
      })
      .finally(() => setLoading(false));
  }, []);

  async function save() {
    setLoading(true);
    await fetch("/users/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    setLoading(false);
    show({ title: "Perfil atualizado", variant: "success" });
  }

  return (
    <div className="max-w-md">
      <div className="heading-3">Perfil</div>
      <div className="mt-4 grid gap-2">
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome" />
        <Input value={email} disabled placeholder="E-mail" />
        <Button onClick={save} disabled={loading}>Salvar</Button>
      </div>
    </div>
  );
}

