"use client";
import * as React from "react";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { getSessionUser } from "@/lib/session";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const pathname = usePathname();

  React.useEffect(() => {
    getSessionUser().then((u) => setUser(u)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6">Carregando...</div>;
  const isAdminLogin = pathname?.startsWith("/admin/login");
  if ((!user || user.role !== "admin") && !isAdminLogin)
    return (
      <Container>
        <div className="py-12 text-center">
          <div className="heading-3">Acesso restrito</div>
          <p className="mt-2 text-zinc-600">Entre com uma conta de administrador.</p>
          <Link href="/admin/login">
            <Button className="mt-3">Ir para login admin</Button>
          </Link>
        </div>
      </Container>
    );

  return (
    <main className="py-8">
      <Container>
        <div className="mb-6 flex items-center justify-between">
          <div className="heading-2">Admin</div>
          <nav className="flex gap-3 text-sm">
            <Link className="hover:underline" href="/admin">Dashboard</Link>
            <Link className="hover:underline" href="/admin/produtos">Produtos</Link>
            <Link className="hover:underline" href="/admin/categorias">Categorias</Link>
            <Link className="hover:underline" href="/admin/colecoes">Coleções</Link>
            <Link className="hover:underline" href="/admin/pedidos">Pedidos</Link>
            <Link className="hover:underline" href="/admin/clientes">Clientes</Link>
            <Link className="hover:underline" href="/admin/conteudo">Conteúdo</Link>
            <Link className="hover:underline" href="/admin/configuracoes">Configurações</Link>
          </nav>
        </div>
        {children}
      </Container>
    </main>
  );
}
