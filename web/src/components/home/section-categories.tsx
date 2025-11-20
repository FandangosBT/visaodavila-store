"use client";
import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Container } from "@/components/layout/container";
import { getJSON } from "@/lib/api";
import { Skeleton } from "@/components/feedback/skeleton";

type Category = { id: string; name: string; slug: string };

export function SectionCategories() {
  const [loading, setLoading] = React.useState(true);
  const [cats, setCats] = React.useState<Category[]>([]);
  const [counts, setCounts] = React.useState<Record<string, number>>({});
  const router = useRouter();

  React.useEffect(() => {
    async function load() {
      try {
        const c = await getJSON<Category[]>("/categories");
        setCats(c);
        // calcular contagem por categoria (leve)
        const all = await getJSON<any[]>("/products");
        const map = Object.fromEntries(
          c.map((cat) => [cat.id, all.filter((p) => p.categoryId === cat.id).length]),
        );
        setCounts(map);
      } catch {
        setCats([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <section className="mt-10">
      <Container>
        <h2 className="heading-2 mb-4">Compre por categoria</h2>
        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {cats.map((c) => (
              <Link
                key={c.id}
                href={`/categoria/${c.slug}`}
                onMouseEnter={() => router.prefetch?.(`/categoria/${c.slug}`)}
                onFocus={() => router.prefetch?.(`/categoria/${c.slug}`)}
                className="group rounded-[var(--radius-md)] border border-zinc-200 p-4 text-center text-sm text-zinc-800 hover:shadow-sm focus-visible:ring-2 focus-visible:ring-primary"
                aria-label={`Ver categoria ${c.name} com ${counts[c.id] ?? 0} itens`}
              >
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-md bg-zinc-100 text-zinc-700">
                  {iconFor(c.slug)}
                </div>
                <div className="font-medium">{c.name}</div>
                <div className="text-xs text-zinc-500 group-hover:text-zinc-700">
                  Ver {counts[c.id] ?? 0} itens
                </div>
              </Link>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}

function iconFor(slug: string) {
  switch (slug) {
    case "camisetas":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M16 3 12 5 8 3 4 6v4h2v9h12V10h2V6l-4-3z" />
        </svg>
      );
    case "calcas":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M8 3h8l-1 7 2 11h-4l-1-8-1 8H7l2-11L8 3z" />
        </svg>
      );
    case "acessorios":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21a8 8 0 0116 0" />
        </svg>
      );
    default:
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6">
          <circle cx="12" cy="12" r="9" />
        </svg>
      );
  }
}
