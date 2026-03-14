export interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "STAFF";
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  price: number | string;
  description: string;
  imageUrl: string;
  categoryId?: string;
  category?: Category;
  createdAt?: string;
}

export interface Session {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "STAFF";
  token: string;
}

export interface OrderItem {
  amount: number;
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    description: string;
  };
}

export interface Order {
  id: string;
  name?: string;
  draft: boolean;
  table: number;
  status: boolean;
  createdAt: string;
  items: OrderItem[];
}
