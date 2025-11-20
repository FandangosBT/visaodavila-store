"use client";
import * as React from "react";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { getSessionUser, type SessionUser } from "@/lib/session";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<SessionUser>(null);
  const [loading, setLoading] = React.useState(true);
  const pathname = usePathname();

  const load = React.useCallback(async () => {
    setLoading(true);
    const u = await getSessionUser();
    setUser(u);
    setLoading(false);
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  async function logout() {
    await fetch("/auth/logout", { method: "POST" });
    const { useSessionStore } = await import("@/store/session");
    await useSessionStore.getState().refresh();
    await load();
  }

  if (loading) return <div className="p-6">Carregando conta…</div>;
  // Permitir páginas públicas da área de conta: login, cadastro, recuperação
  const isPublic = pathname?.startsWith("/conta/login") || pathname?.startsWith("/conta/cadastro") || pathname?.startsWith("/conta/recuperar-senha");
  if (!user && !isPublic)
    return (
      <Container>
        <div className="py-12 text-center">
          <div className="heading-3">Acesse sua conta</div>
          <p className="mt-2 text-body text-zinc-600">Faça login para ver seus pedidos e gerenciar seus dados.</p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <Link href="/conta/login">
              <Button>Entrar</Button>
            </Link>
            <Link href="/conta/cadastro">
              <Button variant="outline">Criar conta</Button>
            </Link>
          </div>
        </div>
      </Container>
    );

  return (
    <main className="py-8">
      <Container>
        <div className="mb-6 flex items-center justify-between">
          <div className="heading-2">Minha conta</div>
          <Button variant="outline" onClick={logout}>Sair</Button>
        </div>
        <div className="grid gap-8 lg:grid-cols-[16rem_1fr]">
          <aside className="rounded-[var(--radius-lg)] border border-zinc-200 p-4 text-sm">
            <div className="font-semibold text-zinc-800">Olá, {user?.name || user?.email}</div>
            <nav className="mt-3 grid gap-2">
              <Link className="hover:underline" href="/conta">Dashboard</Link>
              <Link className="hover:underline" href="/conta/pedidos">Pedidos</Link>
              <Link className="hover:underline" href="/conta/enderecos">Endereços</Link>
              <Link className="hover:underline" href="/conta/perfil">Perfil</Link>
            </nav>
          </aside>
          <section>{children}</section>
        </div>
      </Container>
    </main>
  );
}
