"use client";
import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/catalog/breadcrumbs";
import { Filters, type FilterMeta } from "@/components/catalog/filters";
import { ProductCard } from "@/components/home/product-card";
import { EmptyState } from "@/components/feedback/empty-state";
import { Skeleton } from "@/components/feedback/skeleton";
import { getJSON } from "@/lib/api";

type Product = React.ComponentProps<typeof ProductCard>["p"] & { categoryId?: string; collectionIds?: string[] };

export function Listing({
  title,
  categorySlug,
  search,
}: {
  title: string;
  categorySlug?: string;
  search?: string;
}) {
  const sp = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);
  const [raw, setRaw] = React.useState<Product[]>([]);
  const [visible, setVisible] = React.useState(12);
  const [categoryName, setCategoryName] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        let url = "/products";
        if (categorySlug) {
          const cats = await getJSON<any[]>("/categories");
          const cat = cats.find((x) => x.slug === categorySlug);
          if (cat) {
            setCategoryName(cat.name);
            url = `/products?category=${encodeURIComponent(cat.id)}`;
          } else {
            setCategoryName(undefined);
          }
        } else if (search) {
          url = `/products?search=${encodeURIComponent(search)}`;
        }
        const list = await getJSON<Product[]>(url);
        if (!cancelled) {
          setRaw(list);
          setVisible(12);
        }
      } catch (e) {
        if (!cancelled) setRaw([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    // reset scroll to top on filter context change
    window.scrollTo({ top: 0, behavior: "smooth" });
    return () => {
      cancelled = true;
    };
  }, [categorySlug, search]);

  const min = Number(sp.get("min") || 0);
  const max = Number(sp.get("max") || Number.MAX_SAFE_INTEGER);
  const sizes = new Set(sp.getAll("size"));
  const colors = new Set(sp.getAll("color"));
  const sort = sp.get("sort") || "relevance";

  const filtered = React.useMemo(() => {
    let list = raw.filter((p) => {
      const price = p.salePrice ?? p.price;
      const inPrice = price >= min && price <= max;
      const inSize = sizes.size ? p.sizes.some((s) => sizes.has(s)) : true;
      const inColor = colors.size ? p.colors.some((c) => colors.has(c)) : true;
      return inPrice && inSize && inColor;
    });
    if (sort === "price-asc") list = list.sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price));
    if (sort === "price-desc") list = list.sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price));
    if (sort === "new") list = list.reverse(); // mock: newest last seeded first
    return list;
  }, [raw, min, max, sizes, colors, sort]);

  const meta: FilterMeta = React.useMemo(() => {
    const allPrices = raw.map((p) => p.salePrice ?? p.price);
    const priceMin = Math.min(...(allPrices.length ? allPrices : [0]));
    const priceMax = Math.max(...(allPrices.length ? allPrices : [0]));
    const sizeSet = new Set<string>();
    const colorSet = new Set<string>();
    raw.forEach((p) => {
      p.sizes.forEach((s) => sizeSet.add(s));
      p.colors.forEach((c) => colorSet.add(c));
    });
    return {
      priceMin: isFinite(priceMin) ? Math.floor(priceMin) : 0,
      priceMax: isFinite(priceMax) ? Math.ceil(priceMax) : 0,
      sizes: Array.from(sizeSet),
      colors: Array.from(colorSet),
    };
  }, [raw]);

  // Infinite scroll sentinel
  const sentinelRef = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) setVisible((v) => v + 12);
    });
    io.observe(el);
    return () => io.disconnect();
  }, [filtered.length]);

  const show = filtered.slice(0, visible);

  return (
    <main className="py-8">
      <Container>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: "/" },
                { "@type": "ListItem", position: 2, name: title },
              ],
            }),
          }}
        />
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: title }]} />
        <div className="mb-2 text-sm text-zinc-600">
          {categoryName ? `${categoryName} · ` : ""}
          {filtered.length} {filtered.length === 1 ? "resultado" : "resultados"}
        </div>
        <div className="mt-4 grid gap-6 sm:grid-cols-[16rem_1fr]">
          <Filters meta={meta} />
          <div>
            {loading ? (
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: 12 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-[3/4]" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <EmptyState title="Sem resultados" description="Tente ajustar os filtros." />
            ) : (
              <>
                <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
                  {show.map((p) => (
                    <ProductCard key={p.id} p={p} />
                  ))}
                </div>
                {show.length < filtered.length && <div ref={sentinelRef} className="h-10" />}
              </>
            )}
          </div>
        </div>
      </Container>
    </main>
  );
}
