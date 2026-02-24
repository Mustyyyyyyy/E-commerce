export type ProductCategory = "electronics" | "home-appliances" | "fashion-beauty";

export type ProductVariant = {
  name: string;
  sku: string;
  stock: number;
  price?: number;
};

export type Product = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  brand?: string;
  category: ProductCategory;
  price: number;
  images: string[];
  featured?: boolean;
  stock?: number;
  variants?: ProductVariant[];
  isActive?: boolean;
  createdAt?: string;
};

export type ProductsResponse = {
  items: Product[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "customer";
};

export type AuthResponse = {
  token: string;
  user: AuthUser;
};