"use client";
import * as React from "react";
import { getJSON } from "@/lib/api";
import { ProductCard } from "@/components/home/product-card";

type Product = React.ComponentProps<typeof ProductCard>["p"] & { categoryId?: string };

export function Related({ categoryId, excludeId }: { categoryId?: string; excludeId: string }) {
  const [list, setList] = React.useState<Product[]>([]);

  React.useEffect(() => {
    let url = "/products";
    if (categoryId) url = `/products?category=${encodeURIComponent(categoryId)}`;
    getJSON<Product[]>(url)
      .then((l) => setList(l.filter((p) => p.id !== excludeId)))
      .catch(() => setList([]));
  }, [categoryId, excludeId]);

  if (list.length === 0) return null;
  return (
    <section className="mt-12">
      <h3 className="heading-3 mb-4">Produtos relacionados</h3>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
        {list.slice(0, 8).map((p) => (
          <ProductCard key={p.id} p={p} />
        ))}
      </div>
    </section>
  );
}

