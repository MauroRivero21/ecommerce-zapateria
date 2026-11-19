/**
 * Catálogo demo de Daniel Restrepo.
 *
 * Crea las 14 zapatillas del storefront con precios en COP, tallas, colores y
 * stock. Es idempotente: los productos usan handles deterministas y los que ya
 * existen se omiten.
 *
 *   npx medusa exec ./src/scripts/seed-demo-products.ts
 *
 * Requiere que `medusa db:migrate` haya corrido antes (crea la región, bodega,
 * categorías y las opciones Talla/Color).
 */
import {
  createInventoryLevelsWorkflow,
  createProductTagsWorkflow,
  createProductsWorkflow,
  createTaxRatesWorkflow,
} from "@medusajs/medusa/core-flows"
import {
  ContainerRegistrationKeys,
  MedusaError,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils"
import type { ExecArgs } from "@medusajs/framework/types"

const BATCH_SIZE = 4
const INGEST_CHUNK_SIZE = 25

const TAGS = [
  "best-seller",
  "nuevo",
  "oferta",
  "edicion-limitada",
  "hombre",
  "mujer",
  "unisex",
]

type SeedSize = {
  size: number
  stock: number
}

type SeedProduct = {
  id: string
  handle: string
  title: string
  subtitle: string
  description: string
  price: number
  compareAt?: number
  category: "Running" | "Lifestyle" | "Training"
  gender: "hombre" | "mujer" | "unisex"
  badge?: string
  tags?: string[]
  featured?: boolean
  images: string[]
  colors: string[]
  sizes: SeedSize[]
  rating: number
  reviews: number
  features: string[]
  weight: number
}

const sizeRange = (
  from: number,
  to: number,
  soldOut: number[] = []
): SeedSize[] =>
  Array.from({ length: to - from + 1 }, (_, index) => {
    const size = from + index
    return {
      size,
      stock: soldOut.includes(size) ? 0 : 2 + ((size * 7) % 6),
    }
  })

const SKU_PART = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toUpperCase()

const SHOE_SEEDS: SeedProduct[] = [
  {
    id: "dr-001",
    handle: "velocity-rojo",
    title: "Velocity Rojo",
    subtitle: "Running · Amortiguación reactiva",
    description:
      "Diseñada para tus rodadas diarias. Malla transpirable, entresuela de espuma reactiva y suela con tracción en goma para que cada kilómetro se sienta más ligero.",
    price: 429900,
    compareAt: 499900,
    category: "Running",
    gender: "hombre",
    badge: "Best seller",
    tags: ["best-seller"],
    featured: true,
    images: ["p1.jpg", "p1-detail.jpg"],
    colors: ["Rojo", "Negro"],
    sizes: sizeRange(39, 45, [44]),
    rating: 4.8,
    reviews: 126,
    features: [
      "Malla técnica transpirable",
      "Espuma reactiva de alto retorno",
      "Suela de goma con tracción",
      "Peso: 265 g (talla 42)",
    ],
    weight: 800,
  },
  {
    id: "dr-002",
    handle: "court-heritage",
    title: "Court Heritage",
    subtitle: "Lifestyle · Piel premium",
    description:
      "Un clásico de cancha reinterpretado para la calle. Piel de grano fino, silueta limpia y una plantilla acolchada que aguanta el día completo.",
    price: 359900,
    category: "Lifestyle",
    gender: "unisex",
    badge: "Nuevo",
    tags: ["nuevo", "best-seller"],
    featured: true,
    images: ["p2.jpg", "p2-detail.jpg"],
    colors: ["Blanco/Naranja", "Gris"],
    sizes: sizeRange(36, 44, [36, 43]),
    rating: 4.7,
    reviews: 84,
    features: [
      "Piel premium de grano fino",
      "Plantilla acolchada extraíble",
      "Suela de goma antideslizante",
      "Forro interior en algodón",
    ],
    weight: 850,
  },
  {
    id: "dr-003",
    handle: "aero-pastel",
    title: "Aero Pastel",
    subtitle: "Lifestyle · Edición limitada",
    description:
      "Una mezcla de tonos suaves sobre una base liviana. La edición Aero Pastel combina capas de gamuza y malla para un look que no pasa desapercibido.",
    price: 389900,
    compareAt: 449900,
    category: "Lifestyle",
    gender: "mujer",
    badge: "Oferta",
    tags: ["oferta", "edicion-limitada"],
    images: ["p3.jpg", "p3-detail.jpg"],
    colors: ["Multicolor", "Blanco"],
    sizes: sizeRange(35, 41, [35, 40]),
    rating: 4.6,
    reviews: 52,
    features: [
      "Capas de gamuza y malla",
      "Entresuela ligera",
      "Plantilla ergonómica",
      "Edición de temporada",
    ],
    weight: 750,
  },
  {
    id: "dr-004",
    handle: "studio-blanco",
    title: "Studio Blanco",
    subtitle: "Lifestyle · Minimalista",
    description:
      "Menos es más. Una silueta depurada en blanco total, con líneas limpias y materiales fáciles de combinar con todo lo que ya tienes.",
    price: 329900,
    category: "Lifestyle",
    gender: "mujer",
    images: ["p4.jpg", "p4-detail.jpg"],
    colors: ["Blanco", "Negro"],
    sizes: sizeRange(35, 41, [39]),
    rating: 4.5,
    reviews: 39,
    features: [
      "Superficie de fácil limpieza",
      "Diseño minimalista",
      "Suela baja de goma",
      "Peso liviano",
    ],
    weight: 700,
  },
  {
    id: "dr-005",
    handle: "retro-high",
    title: "Retro High",
    subtitle: "Lifestyle · Caña alta",
    description:
      "Inspirada en el básquetbol de los 80. Caña alta, paneles contrastados y una presencia que se roba la calle desde que sales de casa.",
    price: 499900,
    category: "Lifestyle",
    gender: "unisex",
    badge: "Últimas tallas",
    featured: true,
    images: ["p5.jpg", "p5-detail.jpg"],
    colors: ["Rojo/Negro", "Blanco/Negro"],
    sizes: sizeRange(38, 45, [38, 39, 45]),
    rating: 4.9,
    reviews: 203,
    features: [
      "Caña alta con soporte",
      "Paneles de piel sintética",
      "Amortiguación en el talón",
      "Suela de goma con patrón",
    ],
    weight: 950,
  },
  {
    id: "dr-006",
    handle: "suede-classic",
    title: "Suede Classic",
    subtitle: "Lifestyle · Gamuza",
    description:
      "Gamuza suave, tonos tierra y una silueta atemporal. La compañera perfecta para jeans, cargo o lo que te pongas un martes.",
    price: 419900,
    category: "Lifestyle",
    gender: "hombre",
    featured: true,
    images: ["p6.jpg", "p6-detail.jpg"],
    colors: ["Camel", "Negro"],
    sizes: sizeRange(39, 45, [40, 45]),
    rating: 4.7,
    reviews: 91,
    features: [
      "Gamuza de alta calidad",
      "Plantilla acolchada",
      "Suela de goma flexible",
      "Acabados cosidos a mano",
    ],
    weight: 820,
  },
  {
    id: "dr-007",
    handle: "air-minimal",
    title: "Air Minimal",
    subtitle: "Lifestyle · Blanco total",
    description:
      "La zapatilla blanca que resuelve todo. Perfil bajo, materiales premium y una comodidad que se siente desde el primer paso.",
    price: 379900,
    category: "Lifestyle",
    gender: "unisex",
    badge: "Best seller",
    tags: ["best-seller"],
    featured: true,
    images: ["p7.jpg", "p7-detail.jpg"],
    colors: ["Blanco"],
    sizes: sizeRange(36, 45, [37, 44]),
    rating: 4.8,
    reviews: 311,
    features: [
      "Piel sintética premium",
      "Perfil bajo y limpio",
      "Plantilla suave",
      "Suela de goma duradera",
    ],
    weight: 780,
  },
  {
    id: "dr-008",
    handle: "carbon-trainer",
    title: "Carbon Trainer",
    subtitle: "Training · Estabilidad",
    description:
      "Construida para el gimnasio: base ancha, sujeción lateral y una entresuela firme que te mantiene estable en cada levantamiento.",
    price: 349900,
    category: "Training",
    gender: "hombre",
    badge: "Nuevo",
    tags: ["nuevo"],
    images: ["p8.jpg", "p8-detail.jpg"],
    colors: ["Negro"],
    sizes: sizeRange(39, 45, [41]),
    rating: 4.6,
    reviews: 47,
    features: [
      "Base ancha para estabilidad",
      "Sujeción lateral reforzada",
      "Entresuela firme",
      "Malla de secado rápido",
    ],
    weight: 900,
  },
  {
    id: "dr-009",
    handle: "skate-77",
    title: "Skate 77",
    subtitle: "Lifestyle · Suela vulcanizada",
    description:
      "Suela vulcanizada, puntera reforzada y una silueta que nació en el skatepark. Resistencia y actitud en partes iguales.",
    price: 299900,
    compareAt: 349900,
    category: "Lifestyle",
    gender: "unisex",
    badge: "Oferta",
    tags: ["oferta"],
    images: ["p9.jpg", "p9-detail.jpg"],
    colors: ["Vino", "Negro"],
    sizes: sizeRange(36, 44, [36, 42]),
    rating: 4.5,
    reviews: 78,
    features: [
      "Suela vulcanizada",
      "Puntera reforzada",
      "Lona resistente",
      "Plantilla acolchada",
    ],
    weight: 860,
  },
  {
    id: "dr-010",
    handle: "trail-olive",
    title: "Trail Olive",
    subtitle: "Running · Terreno mixto",
    description:
      "Para cuando el asfalto se acaba. Tacos de tracción, protección en la puntera y una pisada estable en tierra, gravilla y montaña.",
    price: 459900,
    category: "Running",
    gender: "hombre",
    featured: true,
    images: ["p10.jpg", "p10-detail.jpg"],
    colors: ["Oliva", "Negro"],
    sizes: sizeRange(39, 45, [39, 44]),
    rating: 4.7,
    reviews: 64,
    features: [
      "Tacos de tracción multidireccional",
      "Puntera de protección",
      "Entresuela amortiguada",
      "Malla resistente al agua",
    ],
    weight: 880,
  },
  {
    id: "dr-011",
    handle: "prisma-run",
    title: "Prisma Run",
    subtitle: "Running · Edición color",
    description:
      "Color, energía y velocidad. Una edición vibrante con entresuela de espuma ligera y ajuste tipo calcetín para tus entrenamientos más rápidos.",
    price: 439900,
    category: "Running",
    gender: "mujer",
    badge: "Nuevo",
    tags: ["nuevo"],
    featured: true,
    images: ["p11.jpg", "p11-detail.jpg"],
    colors: ["Multicolor"],
    sizes: sizeRange(35, 41, [35, 39]),
    rating: 4.8,
    reviews: 73,
    features: [
      "Ajuste tipo calcetín",
      "Espuma ligera de alto retorno",
      "Cordones planos",
      "Detalles reflectivos",
    ],
    weight: 690,
  },
  {
    id: "dr-012",
    handle: "street-court",
    title: "Street Court",
    subtitle: "Lifestyle · Uso diario",
    description:
      "La mezcla perfecta entre una zapatilla de cancha y una de calle. Perfil bajo, paneles contrastados y comodidad para todo el día.",
    price: 369900,
    category: "Lifestyle",
    gender: "unisex",
    images: ["p12.jpg", "p12-detail.jpg"],
    colors: ["Negro/Blanco", "Blanco/Negro"],
    sizes: sizeRange(37, 45, [37, 43]),
    rating: 4.6,
    reviews: 58,
    features: [
      "Perfil bajo",
      "Paneles de piel y malla",
      "Plantilla acolchada",
      "Suela de goma",
    ],
    weight: 810,
  },
  {
    id: "dr-013",
    handle: "air-volt",
    title: "Air Volt",
    subtitle: "Lifestyle · Volumen visible",
    description:
      "Amortiguación visible y una paleta que enciende cualquier outfit. La Air Volt es comodidad exagerada con una actitud que no pide permiso.",
    price: 519900,
    category: "Lifestyle",
    gender: "hombre",
    badge: "Best seller",
    tags: ["best-seller"],
    featured: true,
    images: ["p13.jpg", "p13-detail.jpg"],
    colors: ["Amarillo/Volt", "Blanco"],
    sizes: sizeRange(39, 45, [39, 45]),
    rating: 4.9,
    reviews: 187,
    features: [
      "Amortiguación visible",
      "Upper de malla y sintético",
      "Ajuste cómodo",
      "Suela de goma",
    ],
    weight: 920,
  },
  {
    id: "dr-014",
    handle: "flow-knit",
    title: "Flow Knit",
    subtitle: "Running · Tejido flexible",
    description:
      "Un tejido que se adapta a tu pie como una segunda piel. Ligera, flexible y pensada para rodadas suaves y caminatas largas.",
    price: 399900,
    category: "Running",
    gender: "mujer",
    badge: "Nuevo",
    tags: ["nuevo"],
    images: ["p14.jpg", "p14-detail.jpg"],
    colors: ["Blanco", "Gris"],
    sizes: sizeRange(35, 41, [38]),
    rating: 4.7,
    reviews: 102,
    features: [
      "Tejido knit flexible",
      "Entresuela suave",
      "Peso: 230 g (talla 38)",
      "Plantilla extraíble",
    ],
    weight: 680,
  },
]

const variantSku = (product: SeedProduct, color: string, size: number) =>
  `${product.id.toUpperCase()}-${SKU_PART(color)}-${size}`

export default async function seedDemoProducts({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const backendUrl = (process.env.MEDUSA_BACKEND_URL ?? "http://localhost:9000").replace(
    /\/$/,
    ""
  )
  const imageUrl = (file: string) => `${backendUrl}/static/products/${file}`

  const { data: salesChannels } = await query.graph({
    entity: "sales_channel",
    fields: ["id", "name"],
  })
  const { data: shippingProfiles } = await query.graph({
    entity: "shipping_profile",
    fields: ["id"],
  })
  const { data: categories } = await query.graph({
    entity: "product_category",
    fields: ["id", "name"],
  })
  const { data: stockLocations } = await query.graph({
    entity: "stock_location",
    fields: ["id", "name"],
  })
  const { data: stores } = await query.graph({
    entity: "store",
    fields: ["id", "supported_currencies.currency_code"],
  })

  const salesChannel = salesChannels[0]
  const shippingProfile = shippingProfiles[0]
  const stockLocation = stockLocations[0]

  if (!salesChannel || !shippingProfile || !stockLocation) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      "No sales channel, shipping profile or stock location found. Run `medusa db:migrate` first."
    )
  }

  const currencyCodes: string[] = (stores[0]?.supported_currencies ?? [])
    .map((currency) => currency?.currency_code)
    .filter((code): code is string => Boolean(code))

  if (!currencyCodes.includes("cop")) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      "The store does not support COP. Check the region created by db:migrate."
    )
  }

  const { data: optionRows } = await query.graph({
    entity: "product_option",
    fields: ["id", "title", "values.value"],
    filters: { is_exclusive: false },
  })

  const sizeOption = optionRows.find((option) => option.title === "Talla")
  const colorOption = optionRows.find((option) => option.title === "Color")

  if (!sizeOption || !colorOption) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      "The Talla/Color options are missing. Run `medusa db:migrate` first."
    )
  }

  const { data: taxRegions } = await query.graph({
    entity: "tax_region",
    fields: ["id", "country_code"],
  })
  const colombiaTaxRegion = taxRegions.find(
    (region) => region.country_code === "co"
  )

  if (colombiaTaxRegion) {
    const { data: taxRates } = await query.graph({
      entity: "tax_rate",
      fields: ["id", "name"],
      filters: { tax_region_id: colombiaTaxRegion.id },
    })

    if (!taxRates.some((rate) => rate.name === "IVA 19%")) {
      await createTaxRatesWorkflow(container).run({
        input: [
          {
            tax_region_id: colombiaTaxRegion.id,
            name: "IVA 19%",
            code: "IVA",
            rate: 19,
            is_default: true,
          },
        ],
      })
      logger.info("Created the default 19% IVA tax rate")
    }
  }

  const { data: existingTags } = await query.graph({
    entity: "product_tag",
    fields: ["id", "value"],
  })
  const missingTags = TAGS.filter(
    (value) => !existingTags.some((tag) => tag.value === value)
  )

  if (missingTags.length) {
    await createProductTagsWorkflow(container).run({
      input: { product_tags: missingTags.map((value) => ({ value })) },
    })
    logger.info(`Created ${missingTags.length} tag(s)`)
  }

  const { data: allTags } = await query.graph({
    entity: "product_tag",
    fields: ["id", "value"],
  })
  const tagByValue = new Map(allTags.map((tag) => [tag.value, tag]))

  // Stock is keyed by SKU so it can be repaired on a re-run even when the
  // product already exists.
  const stockBySku = new Map<string, number>()

  for (const product of SHOE_SEEDS) {
    for (const color of product.colors) {
      for (const size of product.sizes) {
        stockBySku.set(variantSku(product, color, size.size), size.stock)
      }
    }
  }

  const { data: alreadySeeded } = await query.graph({
    entity: "product",
    fields: ["handle"],
  })
  const takenHandles = new Set(
    alreadySeeded.map((product) => product.handle).filter(Boolean)
  )

  const products: Record<string, unknown>[] = []

  for (const product of SHOE_SEEDS) {
    if (takenHandles.has(product.handle)) {
      continue
    }

    const category = categories.find((item) => item.name === product.category)

    if (!category) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Category "${product.category}" is missing. Run \`medusa db:migrate\` first.`
      )
    }

    const tagIds = [
      ...new Set([product.gender, ...(product.tags ?? [])]),
    ]
      .map((value) => tagByValue.get(value)?.id)
      .filter((id): id is string => Boolean(id))

    const variants = product.colors.flatMap((color) =>
      product.sizes.map((size) => ({
        title: `${color} / ${size.size}`,
        sku: variantSku(product, color, size.size),
        options: {
          Talla: String(size.size),
          Color: color,
        },
        prices: [
          {
            amount: product.price,
            currency_code: "cop",
          },
        ],
        manage_inventory: true,
      }))
    )

    products.push({
      title: product.title,
      handle: product.handle,
      subtitle: product.subtitle,
      description: product.description,
      status: ProductStatus.PUBLISHED,
      thumbnail: imageUrl(product.images[0]),
      images: product.images.map((file) => ({ url: imageUrl(file) })),
      weight: product.weight,
      shipping_profile_id: shippingProfile.id,
      category_ids: [category.id],
      tag_ids: tagIds,
      sales_channels: [{ id: salesChannel.id }],
      options: [{ id: sizeOption.id }, { id: colorOption.id }],
      variants,
      metadata: {
        subtitle: product.subtitle,
        compare_at: product.compareAt ?? null,
        rating: product.rating,
        reviews: product.reviews,
        features: product.features,
        gender: product.gender,
        badge: product.badge ?? null,
        featured: product.featured ?? false,
        demo: true,
      },
    })
  }

  if (!products.length) {
    logger.info("Every demo product already exists. Checking inventory levels...")
  } else {
    let created = 0

    for (let start = 0; start < products.length; start += BATCH_SIZE) {
      const batch = products.slice(start, start + BATCH_SIZE)

      await createProductsWorkflow(container).run({
        input: { products: batch as never },
      })

      created += batch.length
      logger.info(`Created ${created}/${products.length} demo products`)
    }
  }

  const { data: inventoryItems } = await query.graph({
    entity: "inventory_item",
    fields: ["id", "sku"],
  })
  const relevantItems = inventoryItems.filter(
    (item) => typeof item.sku === "string" && stockBySku.has(item.sku)
  )

  const { data: existingLevels } = await query.graph({
    entity: "inventory_level",
    fields: ["inventory_item_id", "location_id"],
  })
  const existingKeys = new Set(
    existingLevels.map(
      (level) => `${level.inventory_item_id}:${level.location_id}`
    )
  )

  const levels = relevantItems
    .filter(
      (item) =>
        !existingKeys.has(`${item.id}:${stockLocation.id}`)
    )
    .map((item) => ({
      location_id: stockLocation.id,
      inventory_item_id: item.id,
      stocked_quantity: stockBySku.get(item.sku as string) ?? 0,
    }))

  if (levels.length) {
    await createInventoryLevelsWorkflow(container).run({
      input: { inventory_levels: levels },
    })
    logger.info(`Created ${levels.length} inventory level(s)`)
  }

  try {
    const search = container.resolve(Modules.SEARCH)
    const { data: allProducts } = await query.graph({
      entity: "product",
      fields: ["id"],
    })

    for (let start = 0; start < allProducts.length; start += INGEST_CHUNK_SIZE) {
      const chunk = allProducts.slice(start, start + INGEST_CHUNK_SIZE)

      await search.ingest({
        name: "product.created",
        data: chunk.map((product) => ({ id: product.id })),
      } as never)
    }

    logger.info(`Search index caught up for ${allProducts.length} product(s).`)
  } catch (error) {
    logger.warn(
      `Search index was not refreshed: ${
        error instanceof Error ? error.message : String(error)
      }`
    )
  }

  logger.info("Done. Open the Medusa admin to review the shoe catalogue.")
}
