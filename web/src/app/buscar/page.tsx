import { Listing } from "@/components/catalog/listing";
import { Suspense } from "react";

export default function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const q = searchParams?.q ?? "";
  return (
    <Suspense fallback={<div className="p-4">Carregando busca…</div>}>
      <Listing title="Busca" search={q} />
    </Suspense>
  );
}
