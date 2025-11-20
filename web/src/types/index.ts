export type ID = string;

export type Category = {
  id: ID;
  name: string;
  slug: string;
};

export type Collection = {
  id: ID;
  name: string;
  slug: string;
};

export type Product = {
  id: ID;
  name: string;
  price: number;
  salePrice?: number;
  images: string[];
  colors: string[];
  sizes: string[];
  rating: number;
  stock: number;
  categoryId?: ID;
  collectionIds?: ID[];
};

export type Banner = {
  id: ID;
  imageUrl: string;
  href?: string;
  title?: string;
  subtitle?: string;
};

export type User = {
  id: ID;
  name: string;
  email: string;
  role: "customer" | "admin";
  password: string; // mock only
};

export type CartItem = {
  id: ID;
  productId: ID;
  quantity: number;
  color?: string;
  size?: string;
};

export type Cart = {
  items: CartItem[];
  couponCode?: string;
};

export type OrderItem = CartItem & {
  price: number;
  salePrice?: number;
};

export type Order = {
  id: ID;
  userId: ID;
  items: OrderItem[];
  total: number;
  status: "created" | "paid" | "shipped" | "delivered" | "canceled";
  createdAt: string;
};

export type Settings = {
  storeName: string;
  topbarMessage?: string;
};

export type Address = {
  id: ID;
  name: string;
  cep: string;
  street: string;
  number: string;
  city: string;
  uf: string;
  complement?: string;
};
