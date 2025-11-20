"use client";
import * as React from "react";
import Link from "next/link";
import { useDebounce } from "@/lib/use-debounce";

type Suggestion = { id: string; name: string; href: string; type: "product" | "category" };

export function SearchBox() {
  const [q, setQ] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [sugs, setSugs] = React.useState<Suggestion[]>([]);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const debounced = useDebounce(q, 200);

  React.useEffect(() => {
    if (!debounced) {
      setSugs([]);
      return;
    }
    let cancelled = false;
    Promise.all([
      fetch(`/products?search=${encodeURIComponent(debounced)}`).then((r) => r.json()),
      fetch(`/categories`).then((r) => r.json()),
    ])
      .then(([products, categories]) => {
        if (cancelled) return;
        const matchedCats = (categories || [])
          .filter((c: any) => c.name?.toLowerCase().includes(debounced.toLowerCase()))
          .slice(0, 3)
          .map((c: any) => ({ id: c.id, name: c.name, href: `/categoria/${c.slug}`, type: "category" as const }));
        const matchedProds = (products || [])
          .slice(0, 5)
          .map((p: any) => ({ id: p.id, name: p.name, href: `/produto/${p.id}`, type: "product" as const }));
        setSugs([...matchedCats, ...matchedProds]);
        setOpen(true);
      })
      .catch(() => setOpen(false));
    return () => {
      cancelled = true;
    };
  }, [debounced]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") setOpen(false);
    if (e.key === "ArrowDown") {
      const list = document.getElementById("search-suggestions");
      const first = list?.querySelector<HTMLAnchorElement>("a");
      first?.focus();
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) {
      window.location.href = `/buscar?q=${encodeURIComponent(q.trim())}`;
    }
  };

  return (
    <form className="relative w-full max-w-md" role="search" onSubmit={onSubmit}>
      <label htmlFor="search" className="sr-only">
        Buscar produtos
      </label>
      <input
        ref={inputRef}
        id="search"
        name="search"
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onFocus={() => sugs.length > 0 && setOpen(true)}
        onKeyDown={onKeyDown}
        placeholder="Buscar produtos..."
        className="w-full rounded-[var(--radius-md)] border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary"
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls="search-suggestions"
      />
      {open && sugs.length > 0 && (
        <div
          id="search-suggestions"
          role="listbox"
          className="absolute z-30 mt-2 w-full overflow-hidden rounded-[var(--radius-md)] border border-zinc-200 bg-white shadow-lg"
        >
          <ul>
            {sugs.map((s, idx) => (
              <li key={`${s.id}-${idx}`} role="option" aria-selected={false}>
                <Link
                  className="block px-3 py-2 text-sm hover:bg-zinc-50 focus:bg-zinc-50 focus:outline-none"
                  href={s.href}
                  onClick={() => setOpen(false)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      setOpen(false);
                      inputRef.current?.focus();
                    }
                  }}
                >
                  <span className="text-zinc-800">{s.name}</span>
                  <span className="ml-2 text-xs text-zinc-500">{s.type === "category" ? "categoria" : "produto"}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </form>
  );
}
