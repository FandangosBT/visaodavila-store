"use client";
import * as React from "react";
import { getJSON } from "@/lib/api";
import { Container } from "@/components/layout/container";
import { ProductCard } from "@/components/home/product-card";
import { Skeleton } from "@/components/feedback/skeleton";

type Product = React.ComponentProps<typeof ProductCard>["p"];

export function SectionProducts({ title, collectionSlug }: { title: string; collectionSlug?: string }) {
  const [loading, setLoading] = React.useState(true);
  const [list, setList] = React.useState<Product[]>([]);
  const [visible, setVisible] = React.useState(8);
  const sentinelRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        let url = "/products";
        if (collectionSlug) {
          const cols = await getJSON<any[]>("/collections");
          const col = cols.find((x) => x.slug === collectionSlug);
          if (col) url = `/products?collection=${encodeURIComponent(col.id)}`;
        }
        const products = await getJSON<Product[]>(url);
        if (!cancelled) setList(products);
      } catch (e) {
        if (!cancelled) setList([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [collectionSlug]);

  React.useEffect(() => {
    if (!sentinelRef.current) return;
    const el = sentinelRef.current;
    if (!('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver((entries) => {
      const e = entries[0];
      if (e && e.isIntersecting) {
        setVisible((v) => Math.min(v + 8, list.length || v + 8));
      }
    }, { rootMargin: '200px' });
    io.observe(el);
    return () => io.disconnect();
  }, [list.length]);

  const canLoadMore = !loading && visible < list.length;

  return (
    <section className="mt-10">
      <Container>
        <h2 className="heading-2 mb-4">{title}</h2>
        {loading ? (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[3/4]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {list.slice(0, visible).map((p) => (
              <ProductCard key={p.id} p={p} isNew={collectionSlug === "novidades"} />
            ))}
          </div>
        )}

        {/* Sentinel para lazy/infinite */}
        <div ref={sentinelRef} aria-hidden="true" />

        {/* Botão de fallback "Ver mais" */}
        {canLoadMore && (
          <div className="mt-6 flex justify-center">
            <button
              className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              onClick={() => setVisible((v) => Math.min(v + 8, list.length))}
            >
              Ver mais
            </button>
          </div>
        )}
      </Container>
    </section>
  );
}
