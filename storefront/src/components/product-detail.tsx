"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { site } from "@/lib/config";
import { discountPercentage, formatCOP } from "@/lib/format";
import type { Product } from "@/lib/types";
import { useCart } from "./cart-provider";
import {
  ArrowRightIcon,
  CheckIcon,
  ChevronDownIcon,
  CloseIcon,
  LockIcon,
  ReturnIcon,
  StarIcon,
  TruckIcon,
} from "./icons";

const sizeGuide = [
  { eu: 35, us: "4.5W / 3M", cm: "22.5" },
  { eu: 36, us: "5.5W / 4M", cm: "23.0" },
  { eu: 37, us: "6.5W / 5M", cm: "23.5" },
  { eu: 38, us: "7.5W / 6M", cm: "24.0" },
  { eu: 39, us: "8.5W / 7M", cm: "24.5" },
  { eu: 40, us: "9.0W / 7.5M", cm: "25.0" },
  { eu: 41, us: "10.0W / 8M", cm: "25.5" },
  { eu: 42, us: "9.0M", cm: "26.0" },
  { eu: 43, us: "10.0M", cm: "27.0" },
  { eu: 44, us: "11.0M", cm: "28.0" },
  { eu: 45, us: "12.0M", cm: "29.0" },
];

const reviews = [
  {
    name: "Mariana G.",
    rating: 5,
    date: "Hace 2 semanas",
    title: "Cómodas desde el primer día",
    text: "Las uso para caminar todo el día y no me han sacado una ampolla. La talla es fiel y el material se siente premium.",
  },
  {
    name: "Andrés R.",
    rating: 5,
    date: "Hace 1 mes",
    title: "Se ven mejor en persona",
    text: "El color es exactamente como en las fotos. Llegaron en 3 días a Medellín y el empaque impecable.",
  },
  {
    name: "Laura P.",
    rating: 4,
    date: "Hace 1 mes",
    title: "Muy livianas",
    text: "Para trotar suave funcionan perfecto. Pedí media talla más por recomendación y quedaron bien.",
  },
];

export function ProductDetail({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [imageIndex, setImageIndex] = useState(0);
  const [color, setColor] = useState(product.colors[0].name);
  const [size, setSize] = useState<number | null>(null);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const discount = discountPercentage(product.price, product.compareAt);

  useEffect(() => {
    if (!sizeGuideOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [sizeGuideOpen]);

  const selectedSize = product.sizes.find((item) => item.size === size);

  return (
    <div className="container-x py-6 md:py-10">
      <nav className="mb-6 text-[11px] text-muted" aria-label="Migas de pan">
        <Link href="/" className="hover:text-ink">
          Inicio
        </Link>
        <span className="mx-2">/</span>
        <Link href="/tienda" className="hover:text-ink">
          Tienda
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/tienda?categoria=${product.category}`}
          className="capitalize hover:text-ink"
        >
          {product.category}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
        <div>
          <div className="relative aspect-[4/5] overflow-hidden bg-bone">
            <Image
              src={product.images[imageIndex]}
              alt={`${product.name} ${product.colors[0].name}`}
              fill
              priority
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="object-cover"
            />
            {product.badge && (
              <span className="absolute top-4 left-4 bg-ink px-3 py-1.5 text-[10px] font-bold tracking-[0.14em] text-paper uppercase">
                {product.badge}
              </span>
            )}
            {discount > 0 && (
              <span className="absolute top-4 right-4 bg-volt px-3 py-1.5 text-[10px] font-bold tracking-[0.14em] text-ink uppercase">
                -{discount}%
              </span>
            )}
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {product.images.map((image, index) => (
              <button
                key={image}
                type="button"
                onClick={() => setImageIndex(index)}
                className={`relative aspect-square overflow-hidden bg-bone transition ${
                  imageIndex === index ? "ring-2 ring-ink" : "opacity-70 hover:opacity-100"
                }`}
                aria-label={`Ver imagen ${index + 1} de ${product.name}`}
              >
                <Image
                  src={image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 27vw, 50vw"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="eyebrow text-muted">{product.subtitle}</p>
          <h1 className="mt-2 text-[clamp(2rem,4vw,3.2rem)] leading-[1.05] font-black tracking-tight">
            {product.name}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, index) => (
                <StarIcon
                  key={index}
                  size={13}
                  filled={index < Math.round(product.rating)}
                  className={index < Math.round(product.rating) ? "text-ink" : "text-line"}
                />
              ))}
            </span>
            <span className="text-xs text-muted">
              {product.rating.toFixed(1)} · {product.reviews} reseñas
            </span>
          </div>

          <div className="mt-5 flex flex-wrap items-end gap-3">
            <p className="text-2xl font-black">{formatCOP(product.price)}</p>
            {product.compareAt && (
              <>
                <p className="pb-0.5 text-sm text-muted line-through">
                  {formatCOP(product.compareAt)}
                </p>
                <p className="pb-0.5 text-xs font-bold text-danger">
                  Ahorras {formatCOP(product.compareAt - product.price)}
                </p>
              </>
            )}
          </div>
          <p className="mt-1 text-[11px] text-muted">
            IVA incluido. Paga en cuotas con Wompi.
          </p>

          <div className="mt-7">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold tracking-[0.1em] uppercase">
                Color: <span className="font-normal text-muted">{color}</span>
              </p>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.colors.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => setColor(item.name)}
                  className={`flex items-center gap-2 border px-3 py-2 text-[11px] transition ${
                    color === item.name
                      ? "border-ink bg-ink text-paper"
                      : "border-line hover:border-ink"
                  }`}
                  aria-pressed={color === item.name}
                >
                  <span
                    className="h-3.5 w-3.5 rounded-full border border-ink/20"
                    style={{ backgroundColor: item.hex }}
                  />
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold tracking-[0.1em] uppercase">Talla</p>
              <button
                type="button"
                onClick={() => setSizeGuideOpen(true)}
                className="text-[11px] underline underline-offset-4 hover:text-muted"
              >
                Guía de tallas
              </button>
            </div>
            <div className="mt-3 grid grid-cols-5 gap-1.5 sm:grid-cols-7">
              {product.sizes.map((item) => {
                const soldOut = item.stock === 0;
                return (
                  <button
                    key={item.size}
                    type="button"
                    disabled={soldOut}
                    onClick={() => setSize(item.size)}
                    className={`relative border py-2.5 text-xs font-semibold transition ${
                      size === item.size
                        ? "border-ink bg-ink text-paper"
                        : "border-line hover:border-ink"
                    } ${soldOut ? "cursor-not-allowed bg-bone text-muted/50 line-through" : ""}`}
                    aria-pressed={size === item.size}
                    aria-label={`Talla ${item.size}${soldOut ? " agotada" : ""}`}
                  >
                    {item.size}
                  </button>
                );
              })}
            </div>
            {selectedSize && selectedSize.stock > 0 && selectedSize.stock <= 3 && (
              <p className="mt-2 text-[11px] font-semibold text-danger">
                Últimas {selectedSize.stock} unidades en esta talla.
              </p>
            )}
            {!size && (
              <p className="mt-2 text-[11px] text-muted">
                Selecciona tu talla para continuar.
              </p>
            )}
          </div>

          <button
            type="button"
            disabled={!size}
            onClick={() => {
              if (size) addItem(product, size, color);
            }}
            className="btn btn-primary mt-6 w-full disabled:cursor-not-allowed disabled:bg-line disabled:text-muted"
          >
            {size ? "Añadir al carrito" : "Selecciona una talla"}
            <ArrowRightIcon size={16} />
          </button>

          <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-muted">
            <LockIcon size={14} />
            Pago seguro · Wompi · PSE · Nequi
          </div>

          <div className="mt-7 grid gap-3 border-y border-line py-5 text-xs sm:grid-cols-3">
            <div className="flex items-center gap-2">
              <TruckIcon size={18} />
              <span>
                Envío gratis desde {formatCOP(site.freeShippingThreshold)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <ReturnIcon size={18} />
              <span>Cambios en 30 días</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckIcon size={18} />
              <span>Producto original</span>
            </div>
          </div>

          <div className="mt-2 divide-y divide-line">
            <Accordion title="Detalles del producto" defaultOpen>
              <p className="leading-relaxed text-muted">{product.description}</p>
              <ul className="mt-3 space-y-1.5">
                {product.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-ink" />
                    {feature}
                  </li>
                ))}
              </ul>
            </Accordion>
            <Accordion title="Envíos y entregas">
              <p className="leading-relaxed text-muted">
                Envío estándar de 2 a 5 días hábiles a todo Colombia. Envío
                express de 1 a 2 días hábiles en ciudades principales. Recibes
                tu guía de rastreo por correo cuando despachamos tu pedido.
              </p>
            </Accordion>
            <Accordion title="Cambios y devoluciones">
              <p className="leading-relaxed text-muted">
                Tienes 30 días calendario para cambiar tu talla o devolver el
                producto sin uso, en su empaque original. El primer cambio es
                gratis. Consulta la política completa en{" "}
                <Link href="/ayuda#cambios" className="underline underline-offset-2">
                  ayuda
                </Link>
                .
              </p>
            </Accordion>
          </div>
        </div>
      </div>

      <section className="mt-16 border-t border-line pt-10 md:mt-24">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow text-muted">Opiniones verificadas</p>
            <h2 className="display mt-2 text-4xl md:text-5xl">Lo que dicen</h2>
          </div>
          <div className="flex items-center gap-4">
            <p className="display text-5xl">{product.rating.toFixed(1)}</p>
            <div>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, index) => (
                  <StarIcon
                    key={index}
                    size={14}
                    filled={index < Math.round(product.rating)}
                    className={index < Math.round(product.rating) ? "text-ink" : "text-line"}
                  />
                ))}
              </div>
              <p className="mt-1 text-xs text-muted">{product.reviews} reseñas</p>
            </div>
          </div>
        </div>
        <div className="mt-8 grid gap-3 md:grid-cols-3">
          {reviews.map((review) => (
            <article key={review.name} className="border border-line bg-white p-5">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, index) => (
                  <StarIcon
                    key={index}
                    size={12}
                    filled={index < review.rating}
                    className={index < review.rating ? "text-ink" : "text-line"}
                  />
                ))}
              </div>
              <h3 className="mt-3 text-sm font-bold">{review.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted">{review.text}</p>
              <p className="mt-4 text-[10px] tracking-wide text-muted uppercase">
                {review.name} · {review.date}
              </p>
            </article>
          ))}
        </div>
      </section>

      {sizeGuideOpen && (
        <div
          className="fixed inset-0 z-[85] flex items-center justify-center bg-ink/50 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Guía de tallas"
        >
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto bg-paper p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow text-muted">Encuentra tu talla</p>
                <h2 className="display mt-1 text-3xl">Guía de tallas</h2>
              </div>
              <button
                type="button"
                onClick={() => setSizeGuideOpen(false)}
                className="rounded-full border border-line p-2"
                aria-label="Cerrar guía de tallas"
              >
                <CloseIcon size={17} />
              </button>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-muted">
              Mide tu pie desde el talón hasta la punta del dedo más largo. Si
              estás entre dos tallas, elige la mayor.
            </p>
            <table className="mt-5 w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-ink text-[10px] tracking-[0.1em] uppercase">
                  <th className="py-2.5">EU</th>
                  <th className="py-2.5">US</th>
                  <th className="py-2.5">CM</th>
                </tr>
              </thead>
              <tbody>
                {sizeGuide.map((row) => (
                  <tr key={row.eu} className="border-b border-line">
                    <td className="py-2.5 font-semibold">{row.eu}</td>
                    <td className="py-2.5 text-muted">{row.us}</td>
                    <td className="py-2.5 text-muted">{row.cm}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function Accordion({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details className="group py-4" open={defaultOpen}>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-xs font-bold tracking-[0.1em] uppercase">
        {title}
        <ChevronDownIcon
          size={16}
          className="transition group-open:rotate-180"
        />
      </summary>
      <div className="mt-3 text-xs leading-relaxed">{children}</div>
    </details>
  );
}
