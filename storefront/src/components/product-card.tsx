"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/lib/types";
import { formatCOP, discountPercentage } from "@/lib/format";
import { useCart } from "./cart-provider";
import { CloseIcon, PlusIcon, StarIcon } from "./icons";

export function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  const { addItem } = useCart();
  const [quickAdd, setQuickAdd] = useState(false);
  const discount = discountPercentage(product.price, product.compareAt);

  const badgeClass =
    product.badge === "Nuevo"
      ? "bg-volt text-ink"
      : product.badge === "Oferta"
        ? "bg-danger text-white"
        : "bg-ink text-paper";

  return (
    <article className="group relative">
      <div className="relative aspect-[4/5] overflow-hidden bg-bone">
        <Link
          href={`/producto/${product.slug}`}
          className="absolute inset-0 z-0"
          aria-label={`Ver ${product.name}`}
        >
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-700 group-hover:scale-[1.04] group-hover:opacity-0"
          />
          <Image
            src={product.images[1] ?? product.images[0]}
            alt=""
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover opacity-0 transition duration-700 group-hover:scale-[1.04] group-hover:opacity-100"
          />
        </Link>

        <div className="pointer-events-none absolute top-3 left-3 z-10 flex flex-col items-start gap-1.5">
          {product.badge && (
            <span className={`px-2.5 py-1 text-[9px] font-bold tracking-[0.14em] uppercase ${badgeClass}`}>
              {product.badge}
            </span>
          )}
          {discount > 0 && product.badge !== "Oferta" && (
            <span className="bg-paper px-2.5 py-1 text-[9px] font-bold tracking-[0.14em] text-danger uppercase">
              -{discount}%
            </span>
          )}
        </div>

        {!quickAdd ? (
          <button
            type="button"
            onClick={() => setQuickAdd(true)}
            className="absolute right-3 bottom-3 z-20 flex items-center gap-2 bg-paper px-3.5 py-2.5 text-[10px] font-bold tracking-[0.12em] uppercase shadow-sm transition hover:bg-ink hover:text-paper md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100"
            aria-label={`Añadir ${product.name} rápido`}
          >
            <PlusIcon size={13} />
            Añadir
          </button>
        ) : (
          <div className="absolute inset-x-0 bottom-0 z-20 border-t border-line bg-paper p-3.5">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[10px] font-bold tracking-[0.12em] uppercase">
                Elige tu talla
              </p>
              <button
                type="button"
                onClick={() => setQuickAdd(false)}
                className="text-muted hover:text-ink"
                aria-label="Cerrar selección de talla"
              >
                <CloseIcon size={15} />
              </button>
            </div>
            <div className="mt-2.5 grid grid-cols-6 gap-1">
              {product.sizes.map(({ size, stock }) => (
                <button
                  key={size}
                  type="button"
                  disabled={stock === 0}
                  onClick={() => {
                    addItem(product, size, product.colors[0].name);
                    setQuickAdd(false);
                  }}
                  className="border border-line py-2 text-[11px] font-semibold transition hover:border-ink hover:bg-ink hover:text-paper disabled:cursor-not-allowed disabled:bg-bone disabled:text-muted/50 disabled:line-through"
                  aria-label={`Talla ${size}${stock === 0 ? " agotada" : ""}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Link href={`/producto/${product.slug}`} className="block">
            <h3 className="truncate text-sm font-bold tracking-tight hover:underline">
              {product.name}
            </h3>
          </Link>
          <p className="mt-0.5 truncate text-[11px] text-muted">{product.subtitle}</p>
          <div className="mt-1.5 flex items-center gap-2">
            <span className="flex items-center gap-1 text-[10px] text-muted">
              <StarIcon size={10} className="text-ink" />
              {product.rating.toFixed(1)}
              <span className="text-muted/70">({product.reviews})</span>
            </span>
            <span className="flex items-center gap-1">
              {product.colors.map((color) => (
                <span
                  key={color.name}
                  title={color.name}
                  className="h-2.5 w-2.5 rounded-full border border-ink/15"
                  style={{ backgroundColor: color.hex }}
                />
              ))}
            </span>
          </div>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-sm font-bold">{formatCOP(product.price)}</p>
          {product.compareAt && (
            <p className="text-[11px] text-muted line-through">
              {formatCOP(product.compareAt)}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
