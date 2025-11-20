export type CartAPIItem = {
  id: string;
  productId: string;
  quantity: number;
  color?: string;
  size?: string;
  product?: {
    id: string;
    name: string;
    price: number;
    salePrice?: number;
    images: string[];
  } | null;
};

export type CartAPI = { items: CartAPIItem[]; couponCode?: string };

export async function fetchCart(): Promise<CartAPI> {
  const res = await fetch("/cart");
  if (!res.ok) throw new Error("cart");
  return (await res.json()) as CartAPI;
}

export async function updateQty(id: string, quantity: number) {
  await fetch(`/cart/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ quantity }),
  });
}

export async function removeItem(id: string) {
  await fetch(`/cart/${id}`, { method: "DELETE" });
}

export async function clearCart() {
  await fetch(`/cart`, { method: "DELETE" });
}

export async function applyCoupon(code: string) {
  await fetch(`/cart/coupon`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  });
}

export function subtotal(cart: CartAPI): number {
  return cart.items.reduce((acc, it) => {
    const price = it.product?.salePrice ?? it.product?.price ?? 0;
    return acc + price * it.quantity;
  }, 0);
}

export function discountFromCoupon(code?: string): number {
  if (!code) return 0;
  const map: Record<string, number> = { OFF10: 0.1, DESCONTO10: 0.1 };
  const rate = map[code.toUpperCase()] ?? 0;
  return rate;
}

