export type Category = "running" | "lifestyle" | "training";
export type Gender = "hombre" | "mujer" | "unisex";
export type ProductBadge = "Nuevo" | "Best seller" | "Últimas tallas" | "Oferta";

export type ProductColor = {
  name: string;
  hex: string;
};

export type ProductSize = {
  size: number;
  stock: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  description: string;
  price: number;
  compareAt?: number;
  category: Category;
  gender: Gender;
  badge?: ProductBadge;
  images: string[];
  colors: ProductColor[];
  sizes: ProductSize[];
  rating: number;
  reviews: number;
  features: string[];
  isNew?: boolean;
  isFeatured?: boolean;
};

export type CartItem = {
  key: string;
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  size: number;
  color: string;
  quantity: number;
};

export type Customer = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  department: string;
  notes?: string;
};

export type ShippingMethod = "standard" | "express";
export type PaymentMethod = "wompi" | "cod";

export type Order = {
  reference: string;
  createdAt: string;
  items: CartItem[];
  customer: Customer;
  shippingMethod: ShippingMethod;
  paymentMethod: PaymentMethod;
  subtotal: number;
  shipping: number;
  total: number;
  status: "pendiente" | "pagado" | "enviado";
  demo?: boolean;
};
