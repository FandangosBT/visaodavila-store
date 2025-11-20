"use client";
import * as React from "react";
import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/catalog/breadcrumbs";
import { Gallery } from "@/components/product/gallery";
import { VariantPicker } from "@/components/product/variant-picker";
import { ShippingCalculator } from "@/components/product/shipping-calculator";
import { Reviews } from "@/components/product/reviews";
import { Related } from "@/components/product/related";
import { formatPriceBRL } from "@/lib/format";
import { installments } from "@/lib/installments";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/feedback/toast";

type Product = {
  id: string;
  name: string;
  price: number;
  salePrice?: number;
  images: string[];
  colors: string[];
  sizes: string[];
  rating: number;
  stock: number;
  categoryId?: string;
};

export function ProductPage({ id }: { id: string }) {
  const [p, setP] = React.useState<Product | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [variant, setVariant] = React.useState<{ color?: string; size?: string }>({});
  const { show } = useToast();

  React.useEffect(() => {
    let cancelled = false;
    fetch(`/products/${id}`)
      .then((r) => r.json())
      .then((data) => !cancelled && setP(data))
      .catch(() => !cancelled && setP(null))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) return <div className="p-6">Carregando produto…</div>;
  if (!p) return <div className="p-6">Produto não encontrado.</div>;

  const price = p.salePrice ?? p.price;
  const ins = installments(price, 3);
  const canBuy = p.stock > 0;

  async function addToCart() {
    if (!canBuy || !p) return;
    await fetch("/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: p.id, quantity: 1, ...variant }),
    });
    const { refresh } = await import("@/store/cart").then((m) => ({ refresh: m.useCartStore.getState().refresh }));
    refresh();
    show({ title: "Adicionado", message: `${p.name} no carrinho`, variant: "success" });
  }

  return (
    <main className="py-8">
      <Container>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              name: p.name,
              image: p.images,
              offers: {
                "@type": "Offer",
                priceCurrency: "BRL",
                price: price,
                availability: p.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: "/" },
                { "@type": "ListItem", position: 2, name: p.name },
              ],
            }),
          }}
        />
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: p.name }]} />
        <div className="grid gap-8 lg:grid-cols-2">
          <Gallery images={p.images} />
          <div>
            <h1 className="heading-2">{p.name}</h1>
            <div className="mt-2 flex items-end gap-3">
              <span className="price">{formatPriceBRL(price)}</span>
              {p.salePrice && <span className="price-old">{formatPriceBRL(p.price)}</span>}
              {p.salePrice && (
                <span className="rounded bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
                  Promo
                </span>
              )}
            </div>
            <div className="mt-1 text-sm text-zinc-600">ou {ins.parts}x de {formatPriceBRL(ins.value)}</div>
            <div className="mt-2 text-sm text-zinc-500">{p.stock > 0 ? "Em estoque" : "Esgotado"}</div>

            <div className="mt-6">
              <VariantPicker colors={p.colors} sizes={p.sizes} onChange={setVariant} />
            </div>

            <div className="mt-6 flex gap-2">
              <Button onClick={addToCart} disabled={!canBuy} className="min-w-40">
                {canBuy ? "Adicionar ao carrinho" : "Esgotado"}
              </Button>
              <Button variant="outline">Comprar agora</Button>
            </div>

            <ShippingCalculator />

            <section className="mt-8 space-y-2 text-sm text-zinc-700">
              <div>
                <div className="font-semibold text-zinc-800">Descrição</div>
                <p className="mt-1">Produto de alta qualidade, confortável e versátil para o dia a dia.</p>
              </div>
              <div>
                <div className="font-semibold text-zinc-800">Composição</div>
                <p className="mt-1">Algodão 100%.</p>
              </div>
              <div>
                <div className="font-semibold text-zinc-800">Cuidados</div>
                <p className="mt-1">Lavar à mão, não usar alvejante, secar à sombra.</p>
              </div>
              <div>
                <div className="font-semibold text-zinc-800">Tabela de medidas</div>
                <p className="mt-1">Consulte a tabela para escolher o tamanho ideal.</p>
              </div>
            </section>
          </div>
        </div>

        <Reviews productId={p.id} />
        <Related categoryId={p.categoryId} excludeId={p.id} />
      </Container>
    </main>
  );
}
