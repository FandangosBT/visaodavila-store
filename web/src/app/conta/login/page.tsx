"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") || "");
    const password = String(form.get("password") || "");
    const res = await fetch("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    setLoading(false);
    if (res.ok) {
      const { useSessionStore } = await import("@/store/session");
      await useSessionStore.getState().refresh();
      router.push("/conta");
    }
    else setError("Credenciais inválidas. Use cliente@demo.com / 123456");
  }

  return (
    <div className="mx-auto max-w-sm">
      <div className="heading-3">Entrar</div>
      <form onSubmit={onSubmit} className="mt-4 grid gap-2">
        <Input name="email" type="email" placeholder="E-mail" defaultValue="cliente@demo.com" required />
        <Input name="password" type="password" placeholder="Senha" defaultValue="123456" required />
        {error && <div className="text-sm text-red-600">{error}</div>}
        <Button type="submit" disabled={loading}>{loading ? "Entrando..." : "Entrar"}</Button>
      </form>
      <div className="mt-3 text-sm">
        <Link className="text-primary hover:underline" href="/conta/recuperar-senha">Esqueci minha senha</Link>
      </div>
      <div className="mt-1 text-sm">
        Não tem conta? <Link className="text-primary hover:underline" href="/conta/cadastro">Cadastre-se</Link>
      </div>
    </div>
  );
}
