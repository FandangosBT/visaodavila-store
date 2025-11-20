import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ProductCard } from "@/components/home/product-card";
import { ToastProvider } from "@/components/feedback/toast";

beforeEach(() => {
  vi.spyOn(global, "fetch").mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }) as any);
});

describe("ProductCard", () => {
  const p = {
    id: "p1",
    name: "Camiseta",
    price: 129.9,
    salePrice: 99.9,
    images: ["https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop"],
    colors: ["preto"],
    sizes: ["M"],
    rating: 4.5,
  };

  it("renders product name", () => {
    render(
      <ToastProvider>
        <ProductCard p={p} />
      </ToastProvider>,
    );
    expect(screen.getByText("Camiseta")).toBeInTheDocument();
  });

  it("adds to cart", async () => {
    render(
      <ToastProvider>
        <ProductCard p={p} />
      </ToastProvider>,
    );
    const btn = screen.getByRole("button", { name: /adicionar ao carrinho/i });
    fireEvent.click(btn);
    expect(global.fetch).toHaveBeenCalled();
  });
});
