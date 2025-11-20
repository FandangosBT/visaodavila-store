import { Listing } from "@/components/catalog/listing";
import { Suspense } from "react";

export default function CategoryPage({ params }: { params: { slug: string } }) {
  return (
    <Suspense fallback={<div className="p-4">Carregando categoria…</div>}>
      <Listing title="Categoria" categorySlug={params.slug} />
    </Suspense>
  );
}
