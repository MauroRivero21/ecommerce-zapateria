export const site = {
  name: "Daniel Restrepo",
  shortName: "DR",
  legalName: "Daniel Restrepo Sneakers S.A.S.",
  tagline: "Sneakers para gente que no se detiene.",
  description:
    "Zapatillas de running, training y lifestyle diseñadas en Colombia. Envíos a todo el país, cambios gratis y pago seguro.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  email: "hola@danielrestrepo.co",
  phone: "+57 300 123 4567",
  whatsapp: "573001234567",
  instagram: "https://instagram.com",
  tiktok: "https://tiktok.com",
  freeShippingThreshold: 250_000,
  standardShipping: 15_000,
  expressShipping: 25_000,
  cashOnDeliveryFee: 8_000,
} as const;

export const mainNav = [
  { label: "Hombre", href: "/tienda?genero=hombre" },
  { label: "Mujer", href: "/tienda?genero=mujer" },
  { label: "Running", href: "/tienda?categoria=running" },
  { label: "Lifestyle", href: "/tienda?categoria=lifestyle" },
  { label: "Ofertas", href: "/tienda?oferta=1" },
] as const;

export const categoryLabels = {
  running: "Running",
  lifestyle: "Lifestyle",
  training: "Training",
} as const;

export const genderLabels = {
  hombre: "Hombre",
  mujer: "Mujer",
  unisex: "Unisex",
} as const;

export const paymentMethods = [
  "Visa",
  "Mastercard",
  "PSE",
  "Nequi",
  "Bancolombia",
  "Wompi",
] as const;
