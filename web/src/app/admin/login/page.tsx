"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AdminLoginPage() {
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
      const data = await res.json();
      if (data?.user?.role === "admin") {
        const { useSessionStore } = await import("@/store/session");
        await useSessionStore.getState().refresh();
        router.push("/admin");
      }
      else setError("Conta sem permissão de administrador");
    } else {
      setError("Credenciais inválidas. Use admin@demo.com / admin");
    }
  }

  return (
    <div className="mx-auto max-w-sm py-10">
      <div className="heading-3">Login Admin</div>
      <form onSubmit={onSubmit} className="mt-4 grid gap-2">
        <Input name="email" type="email" placeholder="admin@demo.com" defaultValue="admin@demo.com" required />
        <Input name="password" type="password" placeholder="Senha" defaultValue="admin" required />
        {error && <div className="text-sm text-red-600">{error}</div>}
        <Button type="submit" disabled={loading}>{loading ? "Entrando..." : "Entrar"}</Button>
      </form>
    </div>
  );
}
