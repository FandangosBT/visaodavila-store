import { describe, it, expect } from "vitest";
import { subtotal, discountFromCoupon, type CartAPI } from "@/lib/cart";

describe("cart utils", () => {
  it("computes subtotal", () => {
    const cart: CartAPI = {
      items: [
        { id: "1", productId: "p1", quantity: 2, product: { id: "p1", name: "A", price: 100, images: [] } as any },
        { id: "2", productId: "p2", quantity: 1, product: { id: "p2", name: "B", price: 200, images: [] } as any },
      ],
    };
    expect(subtotal(cart)).toBe(400);
  });
  it("applies 10% coupon", () => {
    expect(discountFromCoupon("OFF10")).toBe(0.1);
    expect(discountFromCoupon("invalid")).toBe(0);
  });
});

