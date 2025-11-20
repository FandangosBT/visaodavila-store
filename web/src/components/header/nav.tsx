"use client";
import * as React from "react";
import Link from "next/link";

export function Nav() {
  const [categories, setCategories] = React.useState<any[]>([]);
  const [collections, setCollections] = React.useState<any[]>([]);

  React.useEffect(() => {
    Promise.all([fetch("/categories").then((r) => r.json()), fetch("/collections").then((r) => r.json())])
      .then(([cats, cols]) => {
        setCategories(cats || []);
        setCollections(cols || []);
      })
      .catch(() => {});
  }, []);

  return (
    <nav aria-label="Navegação principal" className="hidden items-center gap-6 md:flex">
      {categories.map((c) => (
        <Link key={c.id} href={`/categoria/${c.slug}`} className="text-sm text-zinc-700 hover:text-zinc-900">
          {c.name}
        </Link>
      ))}
      <DetailsMenu label="Coleções">
        {collections.map((col) => (
          <Link
            key={col.id}
            href={`/colecao/${col.slug}`}
            className="block rounded px-2 py-1 text-sm text-zinc-700 hover:bg-zinc-50"
          >
            {col.name}
          </Link>
        ))}
      </DetailsMenu>
    </nav>
  );
}

function DetailsMenu({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <details className="group relative">
      <summary className="cursor-pointer list-none text-sm text-zinc-700 hover:text-zinc-900">
        {label}
      </summary>
      <div className="absolute left-0 z-20 mt-2 w-48 rounded-md border border-zinc-200 bg-white p-2 shadow-md">
        {children}
      </div>
    </details>
  );
}
