import { Suspense } from "react";
import { ProductPage } from "@/components/product/product-page";

export default function ProductRoute({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<div className="p-4">Carregando produto…</div>}>
      <ProductPage id={params.id} />
    </Suspense>
  );
}

