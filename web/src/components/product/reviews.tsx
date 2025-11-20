"use client";
import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Review } from "@/types/review";

function storageKey(productId: string) {
  return `mock:reviews:${productId}`;
}

function loadReviews(productId: string): Review[] {
  try {
    const raw = window.localStorage.getItem(storageKey(productId));
    return raw ? (JSON.parse(raw) as Review[]) : [];
  } catch {
    return [];
  }
}

function saveReviews(productId: string, items: Review[]) {
  try {
    window.localStorage.setItem(storageKey(productId), JSON.stringify(items));
  } catch {}
}

export function Reviews({ productId }: { productId: string }) {
  const [items, setItems] = React.useState<Review[]>([]);
  const [author, setAuthor] = React.useState("");
  const [rating, setRating] = React.useState(5);
  const [comment, setComment] = React.useState("");

  React.useEffect(() => {
    setItems(loadReviews(productId));
  }, [productId]);

  const avg = items.length
    ? Math.round((items.reduce((a, r) => a + r.rating, 0) / items.length) * 10) / 10
    : 0;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const next: Review = {
      id: Math.random().toString(36).slice(2),
      productId,
      author: author || "Anônimo",
      rating,
      comment,
      createdAt: new Date().toISOString(),
    };
    const list = [next, ...items];
    setItems(list);
    saveReviews(productId, list);
    setAuthor("");
    setRating(5);
    setComment("");
  }

  return (
    <section className="mt-10">
      <div className="text-lg font-semibold text-zinc-800">Avaliações</div>
      <div className="mt-1 text-sm text-zinc-600">Média: {avg} ({items.length} avaliações)</div>

      <form onSubmit={submit} className="mt-4 grid gap-2 sm:max-w-md">
        <Input
          placeholder="Seu nome"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          aria-label="Seu nome"
        />
        <label className="text-sm text-zinc-700">
          Nota
          <select
            className="mt-1 w-full rounded border border-zinc-300 p-2"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            aria-label="Nota"
          >
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        <textarea
          className="min-h-24 rounded border border-zinc-300 p-2 text-sm"
          placeholder="Conte como foi sua experiência"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          aria-label="Comentário"
        />
        <Button type="submit">Enviar avaliação</Button>
      </form>

      <ul className="mt-6 space-y-4">
        {items.map((r) => (
          <li key={r.id} className="rounded border border-zinc-200 p-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-zinc-800">{r.author}</div>
              <div className="text-sm">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</div>
            </div>
            {r.comment && <p className="mt-1 text-sm text-zinc-700">{r.comment}</p>}
            <div className="mt-1 text-xs text-zinc-400">{new Date(r.createdAt).toLocaleString()}</div>
          </li>
        ))}
      </ul>
    </section>
  );
}

