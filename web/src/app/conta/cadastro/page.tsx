"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") || "");
    const email = String(form.get("email") || "");
    const password = String(form.get("password") || "");
    const res = await fetch("/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    setLoading(false);
    if (res.ok) router.push("/conta");
    else setError("Não foi possível criar a conta (e-mail pode estar em uso)");
  }

  return (
    <div className="mx-auto max-w-sm">
      <div className="heading-3">Criar conta</div>
      <form onSubmit={onSubmit} className="mt-4 grid gap-2">
        <Input name="name" placeholder="Nome completo" required />
        <Input name="email" type="email" placeholder="E-mail" required />
        <Input name="password" type="password" placeholder="Senha" required />
        {error && <div className="text-sm text-red-600">{error}</div>}
        <Button type="submit" disabled={loading}>{loading ? "Criando..." : "Criar conta"}</Button>
      </form>
      <div className="mt-2 text-sm">
        Já tem conta? <Link className="text-primary hover:underline" href="/conta/login">Entrar</Link>
      </div>
    </div>
  );
}

