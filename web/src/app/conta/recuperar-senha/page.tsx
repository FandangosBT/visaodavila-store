"use client";
import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState("");
  const [sent, setSent] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setSent(true);
  }

  return (
    <div className="mx-auto max-w-sm">
      <div className="heading-3">Recuperar senha</div>
      {sent ? (
        <p className="mt-3 text-sm text-emerald-700">Se existir uma conta para {email}, enviaremos instruções por e-mail.</p>
      ) : (
        <form onSubmit={onSubmit} className="mt-4 grid gap-2">
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Seu e-mail" required />
          <Button type="submit" disabled={loading}>{loading ? "Enviando..." : "Enviar"}</Button>
        </form>
      )}
    </div>
  );
}

