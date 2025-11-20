import { faker } from "@faker-js/faker";
import type { Banner, Category, Collection, Product, Settings, User } from "@/types";

export function makeCategories(): Category[] {
  return [
    { id: "c1", name: "Camisetas", slug: "camisetas" },
    { id: "c2", name: "Calças", slug: "calcas" },
    { id: "c3", name: "Acessórios", slug: "acessorios" },
  ];
}

export function makeCollections(): Collection[] {
  return [
    { id: "col1", name: "Novidades", slug: "novidades" },
    { id: "col2", name: "Mais vendidos", slug: "mais-vendidos" },
  ];
}

export function makeProducts(categories: Category[], collections: Collection[]): Product[] {
  const images = [
    "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop",
  ];
  const colors = ["preto", "branco", "azul", "cinza", "verde"]; 
  const sizesTee = ["P", "M", "G", "GG"];
  const sizesPants = ["38", "40", "42", "44"];

  const list: Product[] = [];
  for (let i = 0; i < 12; i++) {
    const cat = faker.helpers.arrayElement(categories);
    const cols = faker.helpers.arrayElements(collections, { min: 0, max: 2 }).map((c) => c.id);
    const basePrice = faker.number.float({ min: 79, max: 299, multipleOf: 0.1 });
    const onSale = faker.datatype.boolean();
    const salePrice = onSale
      ? Number((basePrice * faker.number.float({ min: 0.6, max: 0.9 })).toFixed(2))
      : undefined;
    list.push({
      id: `p${i + 1}`,
      name: faker.commerce.productName(),
      price: Number(basePrice.toFixed(2)),
      salePrice,
      images: faker.helpers.shuffle(images).slice(0, faker.number.int({ min: 1, max: 3 })),
      colors: faker.helpers.arrayElements(colors, { min: 1, max: 3 }),
      sizes: cat.slug === "calcas" ? sizesPants : sizesTee,
      rating: Number(faker.number.float({ min: 3.5, max: 5 }).toFixed(1)),
      stock: faker.number.int({ min: 0, max: 50 }),
      categoryId: cat.id,
      collectionIds: cols,
    });
  }
  return list;
}

export function makeBanners(): Banner[] {
  return [
    {
      id: "b1",
      imageUrl:
        "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1600&auto=format&fit=crop",
      href: "/",
      title: "2 por R$ 207",
      subtitle: "Combos especiais",
    },
    {
      id: "b2",
      imageUrl:
        "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1600&auto=format&fit=crop",
      href: "/",
      title: "Novidades",
      subtitle: "Chegaram agora",
    },
  ];
}

export function makeUsers(): User[] {
  return [
    { id: "u1", name: "Cliente Demo", email: "cliente@demo.com", role: "customer", password: "123456" },
    { id: "u2", name: "Admin Demo", email: "admin@demo.com", role: "admin", password: "admin" },
  ];
}

export function makeSettings(): Settings {
  return {
    storeName: "Visão da Vila Store",
    topbarMessage: "Frete grátis acima de R$199 | 2 por R$207",
  };
}

