import Link from "next/link";

export type Crumb = { label: string; href?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav className="mb-4 text-sm text-zinc-500" aria-label="breadcrumb">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((it, i) => (
          <li key={`${it.label}-${i}`} className="inline-flex items-center gap-1">
            {it.href ? (
              <Link href={it.href} className="hover:text-zinc-700">
                {it.label}
              </Link>
            ) : (
              <span className="text-zinc-700">{it.label}</span>
            )}
            {i < items.length - 1 && <span className="px-1 text-zinc-400">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

