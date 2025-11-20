"use client";
import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { setInQuery, toggleInQueryArray } from "@/components/catalog/utils";

export type FilterMeta = {
  colors: string[];
  sizes: string[];
  priceMin: number;
  priceMax: number;
};

export function Filters({ meta }: { meta: FilterMeta }) {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const sort = sp.get("sort") ?? "relevance";
  const colors = sp.getAll("color");
  const sizes = sp.getAll("size");
  const min = sp.get("min") ?? "";
  const max = sp.get("max") ?? "";

  const pushSp = (next: URLSearchParams) => router.replace(`${pathname}?${next.toString()}`);

  return (
    <aside aria-label="Filtros" className="w-full sm:w-64">
      <div className="rounded-[var(--radius-lg)] border border-zinc-200 p-4">
        <div>
          <div className="text-sm font-semibold text-zinc-800">Ordenar</div>
          <div className="mt-2">
            <Select
              aria-label="Ordenação"
              value={sort}
              onChange={(e) => pushSp(setInQuery("sort", e.target.value, sp))}
            >
              <option value="relevance">Relevância</option>
              <option value="price-asc">Preço: menor para maior</option>
              <option value="price-desc">Preço: maior para menor</option>
              <option value="new">Novidades</option>
            </Select>
          </div>
        </div>

        <div className="mt-6">
          <div className="text-sm font-semibold text-zinc-800">Preço</div>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <Input
              type="number"
              placeholder={`Mín. ${meta.priceMin}`}
              value={min}
              onChange={(e) => pushSp(setInQuery("min", e.target.value, sp))}
              aria-label="Preço mínimo"
            />
            <Input
              type="number"
              placeholder={`Máx. ${meta.priceMax}`}
              value={max}
              onChange={(e) => pushSp(setInQuery("max", e.target.value, sp))}
              aria-label="Preço máximo"
            />
          </div>
        </div>

        <div className="mt-6">
          <div className="text-sm font-semibold text-zinc-800">Tamanho</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {meta.sizes.map((s) => (
              <Checkbox
                key={s}
                id={`size-${s}`}
                label={s}
                checked={sizes.includes(s)}
                onChange={() => pushSp(toggleInQueryArray("size", s, sp))}
              />
            ))}
          </div>
        </div>

        <div className="mt-6">
          <div className="text-sm font-semibold text-zinc-800">Cor</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {meta.colors.map((c) => (
              <Checkbox
                key={c}
                id={`color-${c}`}
                label={c}
                checked={colors.includes(c)}
                onChange={() => pushSp(toggleInQueryArray("color", c, sp))}
              />
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}

