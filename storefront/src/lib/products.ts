import type { Product } from "./types";

const sizeRange = (from: number, to: number, soldOut: number[] = []) =>
  Array.from({ length: to - from + 1 }, (_, index) => {
    const size = from + index;
    return {
      size,
      stock: soldOut.includes(size) ? 0 : 2 + ((size * 7) % 6),
    };
  });

export const products: Product[] = [
  {
    id: "dr-001",
    slug: "velocity-rojo",
    name: "Velocity Rojo",
    subtitle: "Running · Amortiguación reactiva",
    description:
      "Diseñada para tus rodadas diarias. Malla transpirable, entresuela de espuma reactiva y suela con tracción en goma para que cada kilómetro se sienta más ligero.",
    price: 429_900,
    compareAt: 499_900,
    category: "running",
    gender: "hombre",
    badge: "Best seller",
    images: ["/products/p1.jpg", "/products/p1-detail.jpg"],
    colors: [
      { name: "Rojo", hex: "#c8102e" },
      { name: "Negro", hex: "#141414" },
    ],
    sizes: sizeRange(39, 45, [44]),
    rating: 4.8,
    reviews: 126,
    features: [
      "Malla técnica transpirable",
      "Espuma reactiva de alto retorno",
      "Suela de goma con tracción",
      "Peso: 265 g (talla 42)",
    ],
    isFeatured: true,
  },
  {
    id: "dr-002",
    slug: "court-heritage",
    name: "Court Heritage",
    subtitle: "Lifestyle · Piel premium",
    description:
      "Un clásico de cancha reinterpretado para la calle. Piel de grano fino, silueta limpia y una plantilla acolchada que aguanta el día completo.",
    price: 359_900,
    category: "lifestyle",
    gender: "unisex",
    badge: "Nuevo",
    images: ["/products/p2.jpg", "/products/p2-detail.jpg"],
    colors: [
      { name: "Blanco/Naranja", hex: "#f2ede3" },
      { name: "Gris", hex: "#9a9a9a" },
    ],
    sizes: sizeRange(36, 44, [36, 43]),
    rating: 4.7,
    reviews: 84,
    features: [
      "Piel premium de grano fino",
      "Plantilla acolchada extraíble",
      "Suela de goma antideslizante",
      "Forro interior en algodón",
    ],
    isNew: true,
    isFeatured: true,
  },
  {
    id: "dr-003",
    slug: "aero-pastel",
    name: "Aero Pastel",
    subtitle: "Lifestyle · Edición limitada",
    description:
      "Una mezcla de tonos suaves sobre una base liviana. La edición Aero Pastel combina capas de gamuza y malla para un look que no pasa desapercibido.",
    price: 389_900,
    compareAt: 449_900,
    category: "lifestyle",
    gender: "mujer",
    badge: "Oferta",
    images: ["/products/p3.jpg", "/products/p3-detail.jpg"],
    colors: [
      { name: "Multicolor", hex: "#c9b8e8" },
      { name: "Blanco", hex: "#f0eee8" },
    ],
    sizes: sizeRange(35, 41, [35, 40]),
    rating: 4.6,
    reviews: 52,
    features: [
      "Capas de gamuza y malla",
      "Entresuela ligera",
      "Plantilla ergonómica",
      "Edición de temporada",
    ],
  },
  {
    id: "dr-004",
    slug: "studio-blanco",
    name: "Studio Blanco",
    subtitle: "Lifestyle · Minimalista",
    description:
      "Menos es más. Una silueta depurada en blanco total, con líneas limpias y materiales fáciles de combinar con todo lo que ya tienes.",
    price: 329_900,
    category: "lifestyle",
    gender: "mujer",
    images: ["/products/p4.jpg", "/products/p4-detail.jpg"],
    colors: [
      { name: "Blanco", hex: "#f7f6f2" },
      { name: "Negro", hex: "#151515" },
    ],
    sizes: sizeRange(35, 41, [39]),
    rating: 4.5,
    reviews: 39,
    features: [
      "Superficie de fácil limpieza",
      "Diseño minimalista",
      "Suela baja de goma",
      "Peso liviano",
    ],
  },
  {
    id: "dr-005",
    slug: "retro-high",
    name: "Retro High",
    subtitle: "Lifestyle · Caña alta",
    description:
      "Inspirada en el básquetbol de los 80. Caña alta, paneles contrastados y una presencia que se roba la calle desde que sales de casa.",
    price: 499_900,
    category: "lifestyle",
    gender: "unisex",
    badge: "Últimas tallas",
    images: ["/products/p5.jpg", "/products/p5-detail.jpg"],
    colors: [
      { name: "Rojo/Negro", hex: "#b5121b" },
      { name: "Blanco/Negro", hex: "#e9e6de" },
    ],
    sizes: sizeRange(38, 45, [38, 39, 45]),
    rating: 4.9,
    reviews: 203,
    features: [
      "Caña alta con soporte",
      "Paneles de piel sintética",
      "Amortiguación en el talón",
      "Suela de goma con patrón",
    ],
    isFeatured: true,
  },
  {
    id: "dr-006",
    slug: "suede-classic",
    name: "Suede Classic",
    subtitle: "Lifestyle · Gamuza",
    description:
      "Gamuza suave, tonos tierra y una silueta atemporal. La compañera perfecta para jeans, cargo o lo que te pongas un martes.",
    price: 419_900,
    category: "lifestyle",
    gender: "hombre",
    images: ["/products/p6.jpg", "/products/p6-detail.jpg"],
    colors: [
      { name: "Camel", hex: "#b07b4f" },
      { name: "Negro", hex: "#1a1a1a" },
    ],
    sizes: sizeRange(39, 45, [40, 45]),
    rating: 4.7,
    reviews: 91,
    features: [
      "Gamuza de alta calidad",
      "Plantilla acolchada",
      "Suela de goma flexible",
      "Acabados cosidos a mano",
    ],
    isFeatured: true,
  },
  {
    id: "dr-007",
    slug: "air-minimal",
    name: "Air Minimal",
    subtitle: "Lifestyle · Blanco total",
    description:
      "La zapatilla blanca que resuelve todo. Perfil bajo, materiales premium y una comodidad que se siente desde el primer paso.",
    price: 379_900,
    category: "lifestyle",
    gender: "unisex",
    badge: "Best seller",
    images: ["/products/p7.jpg", "/products/p7-detail.jpg"],
    colors: [{ name: "Blanco", hex: "#f8f8f6" }],
    sizes: sizeRange(36, 45, [37, 44]),
    rating: 4.8,
    reviews: 311,
    features: [
      "Piel sintética premium",
      "Perfil bajo y limpio",
      "Plantilla suave",
      "Suela de goma duradera",
    ],
    isFeatured: true,
  },
  {
    id: "dr-008",
    slug: "carbon-trainer",
    name: "Carbon Trainer",
    subtitle: "Training · Estabilidad",
    description:
      "Construida para el gimnasio: base ancha, sujeción lateral y una entresuela firme que te mantiene estable en cada levantamiento.",
    price: 349_900,
    category: "training",
    gender: "hombre",
    badge: "Nuevo",
    images: ["/products/p8.jpg", "/products/p8-detail.jpg"],
    colors: [{ name: "Negro", hex: "#101010" }],
    sizes: sizeRange(39, 45, [41]),
    rating: 4.6,
    reviews: 47,
    features: [
      "Base ancha para estabilidad",
      "Sujeción lateral reforzada",
      "Entresuela firme",
      "Malla de secado rápido",
    ],
    isNew: true,
  },
  {
    id: "dr-009",
    slug: "skate-77",
    name: "Skate 77",
    subtitle: "Lifestyle · Suela vulcanizada",
    description:
      "Suela vulcanizada, puntera reforzada y una silueta que nació en el skatepark. Resistencia y actitud en partes iguales.",
    price: 299_900,
    compareAt: 349_900,
    category: "lifestyle",
    gender: "unisex",
    badge: "Oferta",
    images: ["/products/p9.jpg", "/products/p9-detail.jpg"],
    colors: [
      { name: "Vino", hex: "#6d1f2c" },
      { name: "Negro", hex: "#111111" },
    ],
    sizes: sizeRange(36, 44, [36, 42]),
    rating: 4.5,
    reviews: 78,
    features: [
      "Suela vulcanizada",
      "Puntera reforzada",
      "Lona resistente",
      "Plantilla acolchada",
    ],
  },
  {
    id: "dr-010",
    slug: "trail-olive",
    name: "Trail Olive",
    subtitle: "Running · Terreno mixto",
    description:
      "Para cuando el asfalto se acaba. Tacos de tracción, protección en la puntera y una pisada estable en tierra, gravilla y montaña.",
    price: 459_900,
    category: "running",
    gender: "hombre",
    images: ["/products/p10.jpg", "/products/p10-detail.jpg"],
    colors: [
      { name: "Oliva", hex: "#5b5f46" },
      { name: "Negro", hex: "#1b1b1b" },
    ],
    sizes: sizeRange(39, 45, [39, 44]),
    rating: 4.7,
    reviews: 64,
    features: [
      "Tacos de tracción multidireccional",
      "Puntera de protección",
      "Entresuela amortiguada",
      "Malla resistente al agua",
    ],
    isFeatured: true,
  },
  {
    id: "dr-011",
    slug: "prisma-run",
    name: "Prisma Run",
    subtitle: "Running · Edición color",
    description:
      "Color, energía y velocidad. Una edición vibrante con entresuela de espuma ligera y ajuste tipo calcetín para tus entrenamientos más rápidos.",
    price: 439_900,
    category: "running",
    gender: "mujer",
    badge: "Nuevo",
    images: ["/products/p11.jpg", "/products/p11-detail.jpg"],
    colors: [{ name: "Multicolor", hex: "#d9c7e6" }],
    sizes: sizeRange(35, 41, [35, 39]),
    rating: 4.8,
    reviews: 73,
    features: [
      "Ajuste tipo calcetín",
      "Espuma ligera de alto retorno",
      "Cordones planos",
      "Detalles reflectivos",
    ],
    isNew: true,
    isFeatured: true,
  },
  {
    id: "dr-012",
    slug: "street-court",
    name: "Street Court",
    subtitle: "Lifestyle · Uso diario",
    description:
      "La mezcla perfecta entre una zapatilla de cancha y una de calle. Perfil bajo, paneles contrastados y comodidad para todo el día.",
    price: 369_900,
    category: "lifestyle",
    gender: "unisex",
    images: ["/products/p12.jpg", "/products/p12-detail.jpg"],
    colors: [
      { name: "Negro/Blanco", hex: "#1b1b1b" },
      { name: "Blanco/Negro", hex: "#efede7" },
    ],
    sizes: sizeRange(37, 45, [37, 43]),
    rating: 4.6,
    reviews: 58,
    features: [
      "Perfil bajo",
      "Paneles de piel y malla",
      "Plantilla acolchada",
      "Suela de goma",
    ],
  },
  {
    id: "dr-013",
    slug: "air-volt",
    name: "Air Volt",
    subtitle: "Lifestyle · Volumen visible",
    description:
      "Amortiguación visible y una paleta que enciende cualquier outfit. La Air Volt es comodidad exagerada con una actitud que no pide permiso.",
    price: 519_900,
    category: "lifestyle",
    gender: "hombre",
    badge: "Best seller",
    images: ["/products/p13.jpg", "/products/p13-detail.jpg"],
    colors: [
      { name: "Amarillo/Volt", hex: "#e8c31a" },
      { name: "Blanco", hex: "#f2f0ea" },
    ],
    sizes: sizeRange(39, 45, [39, 45]),
    rating: 4.9,
    reviews: 187,
    features: [
      "Amortiguación visible",
      "Upper de malla y sintético",
      "Ajuste cómodo",
      "Suela de goma",
    ],
    isFeatured: true,
  },
  {
    id: "dr-014",
    slug: "flow-knit",
    name: "Flow Knit",
    subtitle: "Running · Tejido flexible",
    description:
      "Un tejido que se adapta a tu pie como una segunda piel. Ligera, flexible y pensada para rodadas suaves y caminatas largas.",
    price: 399_900,
    category: "running",
    gender: "mujer",
    images: ["/products/p14.jpg", "/products/p14-detail.jpg"],
    colors: [
      { name: "Blanco", hex: "#f1efe9" },
      { name: "Gris", hex: "#9b9b9b" },
    ],
    sizes: sizeRange(35, 41, [38]),
    rating: 4.7,
    reviews: 102,
    features: [
      "Tejido knit flexible",
      "Entresuela suave",
      "Peso: 230 g (talla 38)",
      "Plantilla extraíble",
    ],
    isNew: true,
  },
];

export const getProductBySlug = (slug: string) =>
  products.find((product) => product.slug === slug);

export const getProductById = (id: string) =>
  products.find((product) => product.id === id);

export const featuredProducts = products.filter((product) => product.isFeatured);

export const newArrivals = products.filter((product) => product.isNew);

export const relatedProducts = (product: Product, limit = 4) =>
  products
    .filter(
      (item) =>
        item.id !== product.id &&
        (item.category === product.category || item.gender === product.gender),
    )
    .slice(0, limit);

export const allSizes = Array.from(
  new Set(products.flatMap((product) => product.sizes.map((size) => size.size))),
).sort((a, b) => a - b);

export const allColors = Array.from(
  new Map(
    products.flatMap((product) =>
      product.colors.map((color) => [color.name, color] as const),
    ),
  ).values(),
).sort((a, b) => a.name.localeCompare(b.name, "es"));
