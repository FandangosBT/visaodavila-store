import { createServer, Model, Factory, Response, RestSerializer } from "miragejs";
import type {
  Banner,
  Cart,
  Category,
  Collection,
  ID,
  Order,
  Product,
  Settings,
  User,
  Address,
} from "@/types";
import {
  makeBanners,
  makeCategories,
  makeCollections,
  makeProducts,
  makeSettings,
  makeUsers,
} from "@/mocks/data";
import { getLocal, setLocal, removeLocal, isBrowser } from "@/lib/storage";

type AppSchema = any;

const CART_KEY = "mock:cart";
const SESSION_KEY = "mock:session";
const ORDERS_KEY = "mock:orders"; // per user id map
const ADDR_KEY = "mock:addresses"; // per user id map

function getCart(): Cart {
  return getLocal<Cart>(CART_KEY, { items: [] });
}
function setCart(cart: Cart) {
  setLocal(CART_KEY, cart);
}
function getSession(): { userId?: ID } {
  return getLocal(SESSION_KEY, {} as any);
}
function setSession(s: { userId?: ID }) {
  setLocal(SESSION_KEY, s);
}
function clearSession() {
  removeLocal(SESSION_KEY);
}
function getOrdersByUser(): Record<ID, Order[]> {
  return getLocal<Record<ID, Order[]>>(ORDERS_KEY, {});
}
function setOrdersByUser(map: Record<ID, Order[]>) {
  setLocal(ORDERS_KEY, map);
}

function getAddressesByUser(): Record<ID, Address[]> {
  return getLocal<Record<ID, Address[]>>(ADDR_KEY, {});
}
function setAddressesByUser(map: Record<ID, Address[]>) {
  setLocal(ADDR_KEY, map);
}

export function startMirage() {
  if (!isBrowser()) return;
  if ((window as any).__MIRAGE__) return;

  const server = createServer({
    serializers: {
      application: RestSerializer,
    },
    models: {
      category: Model.extend<Partial<Category>>({}),
      collection: Model.extend<Partial<Collection>>({}),
      product: Model.extend<Partial<Product>>({}),
      banner: Model.extend<Partial<Banner>>({}),
      user: Model.extend<Partial<User>>({}),
      setting: Model.extend<Partial<Settings>>({}),
    },
    factories: {
      // not used now; we seed manually via data.ts
    },
    seeds(server) {
      const categories = makeCategories();
      const collections = makeCollections();
      const products = makeProducts(categories, collections);
      const banners = makeBanners();
      const users = makeUsers();
      const settings = makeSettings();

      categories.forEach((c) => server.create("category", c));
      collections.forEach((c) => server.create("collection", c));
      products.forEach((p) => server.create("product", p));
      banners.forEach((b) => server.create("banner", b));
      users.forEach((u) => server.create("user", u));
      server.create("setting", settings);
    },
    routes() {
      this.timing = 300; // network delay
      this.namespace = "/";

      // Products
      this.get("/products", function (schema, req) {
        const search = (req.queryParams["search"] || "").toString().toLowerCase();
        const category = req.queryParams["category"] as string | undefined;
        const collection = req.queryParams["collection"] as string | undefined;
        let list = (schema as AppSchema).products.all().models as Product[];
        if (search) list = list.filter((p) => p.name.toLowerCase().includes(search));
        if (category) list = list.filter((p) => p.categoryId === category);
        if (collection) list = list.filter((p) => p.collectionIds?.includes(collection));
        return list;
      });
      this.get("/products/:id", function (schema, req) {
        const p = (schema as AppSchema).products.find(req.params.id);
        if (!p) return new Response(404, {}, { message: "Produto não encontrado" });
        return p.attrs;
      });

      // Categories & Collections
      this.get("/categories", (schema) => (schema as AppSchema).categories.all().models);
      this.get("/collections", (schema) => (schema as AppSchema).collections.all().models);

      // Banners & Settings
      this.get("/banners", (schema) => (schema as AppSchema).banners.all().models);
      this.get("/settings", (schema) => (schema as AppSchema).settings.all().models[0]);
      this.patch("/settings", function (schema, req) {
        const { userId } = getSession();
        const user = userId ? (schema as AppSchema).users.find(userId) : null;
        if (!user || user.attrs.role !== "admin")
          return new Response(403, {}, { message: "Sem permissão" });
        const s = (schema as AppSchema).settings.all().models[0];
        const patch = JSON.parse(req.requestBody || "{}");
        s.update({ ...s.attrs, ...patch });
        return s.attrs;
      });

      // Auth
      this.post("/auth/signup", function (schema, req) {
        const { name, email, password } = JSON.parse(req.requestBody || "{}");
        if (!email || !password) return new Response(400, {}, { message: "Dados inválidos" });
        const exists = (schema as AppSchema).users
          .all()
          .models.find((u: any) => u.attrs.email === email);
        if (exists) return new Response(409, {}, { message: "E-mail já cadastrado" });
        const user = (schema as AppSchema).users.create({ id: `u_${Date.now()}`, name: name || "", email, password, role: "customer" });
        setSession({ userId: user.attrs.id });
        return { user: { ...user.attrs, password: undefined } };
      });
      this.post("/auth/login", function (schema, req) {
        const { email, password } = JSON.parse(req.requestBody || "{}");
        const user = (schema as AppSchema).users
          .all()
          .models.find((u: any) => u.attrs.email === email && u.attrs.password === password);
        if (!user) return new Response(401, {}, { message: "Credenciais inválidas" });
        setSession({ userId: user.attrs.id });
        return { user: { ...user.attrs, password: undefined } };
      });
      this.post("/auth/logout", function () {
        clearSession();
        return { ok: true };
      });
      this.get("/users/me", function (schema) {
        const { userId } = getSession();
        if (!userId) return new Response(401, {}, { message: "Não autenticado" });
        const user = (schema as AppSchema).users.find(userId);
        return { user: { ...user.attrs, password: undefined } };
      });
      this.patch("/users/me", function (schema, req) {
        const { userId } = getSession();
        if (!userId) return new Response(401, {}, { message: "Não autenticado" });
        const patch = JSON.parse(req.requestBody || "{}");
        const user = (schema as AppSchema).users.find(userId);
        user.update({ name: patch.name ?? user.attrs.name });
        return { user: { ...user.attrs, password: undefined } };
      });

      // Cart (persist in localStorage)
      this.get("/cart", function (schema) {
        const cart = getCart();
        const products = (schema as AppSchema).products.all().models as Product[];
        const detailed = cart.items.map((it) => {
          const p = products.find((x: any) => x.attrs.id === it.productId) as any;
          return {
            ...it,
            product: p ? p.attrs : null,
          };
        });
        return { items: detailed, couponCode: cart.couponCode };
      });
      this.post("/cart", function (schema, req) {
        const body = JSON.parse(req.requestBody || "{}");
        const { productId, quantity = 1, color, size } = body;
        const cart = getCart();
        const existing = cart.items.find(
          (i) => i.productId === productId && i.color === color && i.size === size,
        );
        if (existing) existing.quantity += quantity;
        else cart.items.push({ id: Math.random().toString(36).slice(2), productId, quantity, color, size });
        setCart(cart);
        return { ok: true };
      });
      this.patch("/cart/:id", function (schema, req) {
        const { id } = req.params;
        const { quantity } = JSON.parse(req.requestBody || "{}");
        const cart = getCart();
        const item = cart.items.find((i) => i.id === id);
        if (!item) return new Response(404, {}, { message: "Item não encontrado" });
        item.quantity = quantity;
        setCart(cart);
        return { ok: true };
      });
      this.delete("/cart/:id", function (schema, req) {
        const { id } = req.params;
        const cart = getCart();
        const next = { ...cart, items: cart.items.filter((i) => i.id !== id) };
        setCart(next);
        return { ok: true };
      });
      this.delete("/cart", function () {
        setCart({ items: [] });
        return { ok: true };
      });

      this.post("/cart/coupon", function (schema, req) {
        const { code } = JSON.parse(req.requestBody || "{}");
        const cart = getCart();
        cart.couponCode = code ?? undefined;
        setCart(cart);
        return { ok: true };
      });

      // Orders (persist in localStorage per user)
      this.get("/orders", function () {
        const { userId } = getSession();
        if (!userId) return new Response(401, {}, { message: "Não autenticado" });
        const map = getOrdersByUser();
        return map[userId] ?? [];
      });
      this.get("/orders/:id", function (schema, req) {
        const { userId } = getSession();
        if (!userId) return new Response(401, {}, { message: "Não autenticado" });
        const map = getOrdersByUser();
        const id = req.params.id;
        const found = (map[userId] ?? []).find((o) => o.id === id);
        if (!found) return new Response(404, {}, { message: "Pedido não encontrado" });
        return found;
      });
      this.post("/orders", function (schema) {
        const { userId } = getSession();
        if (!userId) return new Response(401, {}, { message: "Não autenticado" });
        const cart = getCart();
        const products = (schema as AppSchema).products.all().models as Product[];
        const items = cart.items.map((it) => {
          const p = products.find((x: any) => x.attrs.id === it.productId) as any;
          const price = p?.attrs.price ?? 0;
          const salePrice = p?.attrs.salePrice;
          return { ...it, price, salePrice };
        });
        const total = items.reduce(
          (acc, it) => acc + (Number(it.salePrice ?? it.price) || 0) * it.quantity,
          0,
        );
        const order: Order = {
          id: `ord_${Date.now()}`,
          userId,
          items: items as any,
          total: Number(total.toFixed(2)),
          status: "created",
          createdAt: new Date().toISOString(),
        };
        const map = getOrdersByUser();
        map[userId] = [...(map[userId] ?? []), order];
        setOrdersByUser(map);
        setCart({ items: [] });
        return order;
      });

      // Users (basic list for admin)
      this.get("/users", function (schema) {
        const { userId } = getSession();
        const user = userId ? (schema as AppSchema).users.find(userId) : null;
        if (!user || user.attrs.role !== "admin")
          return new Response(403, {}, { message: "Sem permissão" });
        return (schema as AppSchema).users
          .all()
          .models.map((u: any) => ({ ...u.attrs, password: undefined }));
      });

      // Addresses (persist per user)
      this.get("/addresses", function () {
        const { userId } = getSession();
        if (!userId) return new Response(401, {}, { message: "Não autenticado" });
        const map = getAddressesByUser();
        return map[userId] ?? [];
      });
      this.post("/addresses", function (schema, req) {
        const { userId } = getSession();
        if (!userId) return new Response(401, {}, { message: "Não autenticado" });
        const data = JSON.parse(req.requestBody || "{}");
        const map = getAddressesByUser();
        const list = map[userId] ?? [];
        const addr = { ...data, id: `addr_${Date.now()}` } as Address;
        map[userId] = [addr, ...list];
        setAddressesByUser(map);
        return addr;
      });
      this.patch("/addresses/:id", function (schema, req) {
        const { userId } = getSession();
        if (!userId) return new Response(401, {}, { message: "Não autenticado" });
        const id = req.params.id;
        const data = JSON.parse(req.requestBody || "{}");
        const map = getAddressesByUser();
        const list = map[userId] ?? [];
        const idx = list.findIndex((a) => a.id === id);
        if (idx < 0) return new Response(404, {}, { message: "Endereço não encontrado" });
        list[idx] = { ...list[idx], ...data } as Address;
        map[userId] = list;
        setAddressesByUser(map);
        return list[idx];
      });
      this.delete("/addresses/:id", function (schema, req) {
        const { userId } = getSession();
        if (!userId) return new Response(401, {}, { message: "Não autenticado" });
        const id = req.params.id;
        const map = getAddressesByUser();
        const list = map[userId] ?? [];
        map[userId] = list.filter((a) => a.id !== id);
        setAddressesByUser(map);
        return { ok: true };
      });

      // Admin: Products CRUD
      this.post("/products", function (schema, req) {
        const { userId } = getSession();
        const user = userId ? (schema as AppSchema).users.find(userId) : null;
        if (!user || user.attrs.role !== "admin")
          return new Response(403, {}, { message: "Sem permissão" });
        const data = JSON.parse(req.requestBody || "{}");
        const created = (schema as AppSchema).products.create({ ...data, id: data.id || `p_${Date.now()}` });
        return created.attrs;
      });
      this.patch("/products/:id", function (schema, req) {
        const { userId } = getSession();
        const user = userId ? (schema as AppSchema).users.find(userId) : null;
        if (!user || user.attrs.role !== "admin")
          return new Response(403, {}, { message: "Sem permissão" });
        const id = req.params.id;
        const patch = JSON.parse(req.requestBody || "{}");
        const found = (schema as AppSchema).products.find(id);
        if (!found) return new Response(404, {}, { message: "Produto não encontrado" });
        found.update({ ...found.attrs, ...patch });
        return found.attrs;
      });
      this.delete("/products/:id", function (schema, req) {
        const { userId } = getSession();
        const user = userId ? (schema as AppSchema).users.find(userId) : null;
        if (!user || user.attrs.role !== "admin")
          return new Response(403, {}, { message: "Sem permissão" });
        const id = req.params.id;
        const found = (schema as AppSchema).products.find(id);
        if (!found) return new Response(404, {}, { message: "Produto não encontrado" });
        found.destroy();
        return { ok: true };
      });

      // Admin: Categories CRUD
      this.post("/categories", function (schema, req) {
        const { userId } = getSession();
        const user = userId ? (schema as AppSchema).users.find(userId) : null;
        if (!user || user.attrs.role !== "admin")
          return new Response(403, {}, { message: "Sem permissão" });
        const data = JSON.parse(req.requestBody || "{}");
        const created = (schema as AppSchema).categories.create({ ...data, id: data.id || `c_${Date.now()}` });
        return created.attrs;
      });
      this.patch("/categories/:id", function (schema, req) {
        const { userId } = getSession();
        const user = userId ? (schema as AppSchema).users.find(userId) : null;
        if (!user || user.attrs.role !== "admin")
          return new Response(403, {}, { message: "Sem permissão" });
        const id = req.params.id;
        const patch = JSON.parse(req.requestBody || "{}");
        const found = (schema as AppSchema).categories.find(id);
        if (!found) return new Response(404, {}, { message: "Categoria não encontrada" });
        found.update({ ...found.attrs, ...patch });
        return found.attrs;
      });
      this.delete("/categories/:id", function (schema, req) {
        const { userId } = getSession();
        const user = userId ? (schema as AppSchema).users.find(userId) : null;
        if (!user || user.attrs.role !== "admin")
          return new Response(403, {}, { message: "Sem permissão" });
        const id = req.params.id;
        const found = (schema as AppSchema).categories.find(id);
        if (!found) return new Response(404, {}, { message: "Categoria não encontrada" });
        found.destroy();
        return { ok: true };
      });

      // Admin: Collections CRUD
      this.post("/collections", function (schema, req) {
        const { userId } = getSession();
        const user = userId ? (schema as AppSchema).users.find(userId) : null;
        if (!user || user.attrs.role !== "admin")
          return new Response(403, {}, { message: "Sem permissão" });
        const data = JSON.parse(req.requestBody || "{}");
        const created = (schema as AppSchema).collections.create({ ...data, id: data.id || `col_${Date.now()}` });
        return created.attrs;
      });
      this.patch("/collections/:id", function (schema, req) {
        const { userId } = getSession();
        const user = userId ? (schema as AppSchema).users.find(userId) : null;
        if (!user || user.attrs.role !== "admin")
          return new Response(403, {}, { message: "Sem permissão" });
        const id = req.params.id;
        const patch = JSON.parse(req.requestBody || "{}");
        const found = (schema as AppSchema).collections.find(id);
        if (!found) return new Response(404, {}, { message: "Coleção não encontrada" });
        found.update({ ...found.attrs, ...patch });
        return found.attrs;
      });
      this.delete("/collections/:id", function (schema, req) {
        const { userId } = getSession();
        const user = userId ? (schema as AppSchema).users.find(userId) : null;
        if (!user || user.attrs.role !== "admin")
          return new Response(403, {}, { message: "Sem permissão" });
        const id = req.params.id;
        const found = (schema as AppSchema).collections.find(id);
        if (!found) return new Response(404, {}, { message: "Coleção não encontrada" });
        found.destroy();
        return { ok: true };
      });

      // Admin: Banners CRUD
      this.post("/banners", function (schema, req) {
        const { userId } = getSession();
        const user = userId ? (schema as AppSchema).users.find(userId) : null;
        if (!user || user.attrs.role !== "admin")
          return new Response(403, {}, { message: "Sem permissão" });
        const data = JSON.parse(req.requestBody || "{}");
        const created = (schema as AppSchema).banners.create({ ...data, id: data.id || `b_${Date.now()}` });
        return created.attrs;
      });
      this.patch("/banners/:id", function (schema, req) {
        const { userId } = getSession();
        const user = userId ? (schema as AppSchema).users.find(userId) : null;
        if (!user || user.attrs.role !== "admin")
          return new Response(403, {}, { message: "Sem permissão" });
        const id = req.params.id;
        const patch = JSON.parse(req.requestBody || "{}");
        const found = (schema as AppSchema).banners.find(id);
        if (!found) return new Response(404, {}, { message: "Banner não encontrado" });
        found.update({ ...found.attrs, ...patch });
        return found.attrs;
      });
      this.delete("/banners/:id", function (schema, req) {
        const { userId } = getSession();
        const user = userId ? (schema as AppSchema).users.find(userId) : null;
        if (!user || user.attrs.role !== "admin")
          return new Response(403, {}, { message: "Sem permissão" });
        const id = req.params.id;
        const found = (schema as AppSchema).banners.find(id);
        if (!found) return new Response(404, {}, { message: "Banner não encontrado" });
        found.destroy();
        return { ok: true };
      });

      // Admin: Orders overview + status
      this.get("/admin/orders", function (schema) {
        const { userId } = getSession();
        const user = userId ? (schema as AppSchema).users.find(userId) : null;
        if (!user || user.attrs.role !== "admin") return new Response(403, {}, { message: "Sem permissão" });
        const map = getOrdersByUser();
        const list = Object.values(map).flat();
        return list;
      });
      this.patch("/admin/orders/:id", function (schema, req) {
        const { userId } = getSession();
        const user = userId ? (schema as AppSchema).users.find(userId) : null;
        if (!user || user.attrs.role !== "admin") return new Response(403, {}, { message: "Sem permissão" });
        const patch = JSON.parse(req.requestBody || "{}");
        const id = req.params.id;
        const map = getOrdersByUser();
        let updated = null as any;
        for (const key of Object.keys(map)) {
          const idx = map[key].findIndex((o) => o.id === id);
          if (idx >= 0) {
            map[key][idx] = { ...map[key][idx], ...patch };
            updated = map[key][idx];
            break;
          }
        }
        if (!updated) return new Response(404, {}, { message: "Pedido não encontrado" });
        setOrdersByUser(map);
        return updated;
      });

      // Admin: KPIs
      this.get("/admin/kpis", function (schema) {
        const { userId } = getSession();
        const user = userId ? (schema as AppSchema).users.find(userId) : null;
        if (!user || user.attrs.role !== "admin") return new Response(403, {}, { message: "Sem permissão" });
        const map = getOrdersByUser();
        const list = Object.values(map).flat();
        const ordersCount = list.length;
        const revenue = list.reduce((acc, o) => acc + (o.total || 0), 0);
        const avgTicket = ordersCount ? revenue / ordersCount : 0;
        return { ordersCount, revenue: Number(revenue.toFixed(2)), avgTicket: Number(avgTicket.toFixed(2)) };
      });
    },
  });

  (window as any).__MIRAGE__ = server;
}
