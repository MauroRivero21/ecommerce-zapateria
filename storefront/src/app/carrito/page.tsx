"use client";

import Image from "next/image";
import Link from "next/link";
import { ProductGrid } from "@/components/product-grid";
import { SectionHeading } from "@/components/section-heading";
import { useCart } from "@/components/cart-provider";
import {
  ArrowRightIcon,
  LockIcon,
  MinusIcon,
  PlusIcon,
  TrashIcon,
  TruckIcon,
} from "@/components/icons";
import { site } from "@/lib/config";
import { formatCOP } from "@/lib/format";
import { featuredProducts } from "@/lib/products";

export default function CartPage() {
  const {
    items,
    count,
    subtotal,
    hydrated,
    removeItem,
    updateQuantity,
  } = useCart();

  const shipping =
    subtotal >= site.freeShippingThreshold ? 0 : site.standardShipping;
  const total = subtotal + shipping;

  if (!hydrated) {
    return (
      <div className="container-x py-12">
        <div className="h-10 w-52 animate-pulse bg-bone" />
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          <div className="space-y-3">
            {[1, 2].map((item) => (
              <div key={item} className="h-36 animate-pulse bg-bone" />
            ))}
          </div>
          <div className="h-72 animate-pulse bg-bone" />
        </div>
      </div>
    );
  }

  return (
    <div className="container-x py-8 md:py-12">
      <nav className="mb-6 text-[11px] text-muted" aria-label="Migas de pan">
        <Link href="/" className="hover:text-ink">
          Inicio
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">Carrito</span>
      </nav>

      <div className="flex items-end justify-between gap-4 border-b border-line pb-6">
        <div>
          <p className="eyebrow text-muted">Paso 1 de 2</p>
          <h1 className="display mt-2 text-[clamp(2.8rem,6vw,5rem)]">Tu carrito</h1>
        </div>
        <p className="pb-1 text-sm text-muted">
          {count} {count === 1 ? "artículo" : "artículos"}
        </p>
      </div>

      {items.length === 0 ? (
        <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-bone">
            <TruckIcon size={34} />
          </div>
          <h2 className="display mt-6 text-4xl">Aún no hay nada aquí</h2>
          <p className="mt-3 max-w-sm text-sm text-muted">
            Tu carrito está vacío. Explora la colección y encuentra el par que
            te va a acompañar en el próximo movimiento.
          </p>
          <Link href="/tienda" className="btn btn-primary mt-7">
            Explorar la colección
            <ArrowRightIcon size={16} />
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:gap-12">
          <div>
            <div className="mb-5 flex items-center gap-2 border border-line bg-bone/60 px-4 py-3 text-xs">
              <TruckIcon size={18} />
              {subtotal >= site.freeShippingThreshold ? (
                <p className="font-semibold">
                  ¡Felicidades! Tu pedido tiene envío gratis.
                </p>
              ) : (
                <p>
                  Agrega{" "}
                  <strong>{formatCOP(site.freeShippingThreshold - subtotal)}</strong>{" "}
                  más y obtén envío gratis.
                </p>
              )}
            </div>

            <ul className="divide-y divide-line border-y border-line">
              {items.map((item) => (
                <li key={item.key} className="flex gap-4 py-5 md:gap-6">
                  <Link
                    href={`/producto/${item.slug}`}
                    className="relative h-32 w-24 shrink-0 overflow-hidden bg-bone md:h-40 md:w-32"
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="(min-width: 768px) 128px, 96px"
                      className="object-cover"
                    />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <Link
                          href={`/producto/${item.slug}`}
                          className="text-base font-bold hover:underline"
                        >
                          {item.name}
                        </Link>
                        <p className="mt-1 text-xs text-muted">
                          Talla {item.size} · {item.color}
                        </p>
                      </div>
                      <p className="shrink-0 text-sm font-bold">
                        {formatCOP(item.price * item.quantity)}
                      </p>
                    </div>

                    <p className="mt-1 text-xs text-muted">
                      {formatCOP(item.price)} c/u
                    </p>

                    <div className="mt-auto flex items-center justify-between gap-3 pt-4">
                      <div className="flex items-center border border-line bg-white">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.key, item.quantity - 1)}
                          className="p-2.5 transition hover:bg-bone"
                          aria-label="Disminuir cantidad"
                        >
                          <MinusIcon size={13} />
                        </button>
                        <span className="w-8 text-center text-xs font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.key, item.quantity + 1)}
                          className="p-2.5 transition hover:bg-bone"
                          aria-label="Aumentar cantidad"
                        >
                          <PlusIcon size={13} />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.key)}
                        className="flex items-center gap-1.5 text-[11px] text-muted transition hover:text-danger"
                      >
                        <TrashIcon size={14} />
                        Eliminar
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <Link
              href="/tienda"
              className="mt-6 inline-flex items-center gap-2 text-xs font-bold tracking-[0.1em] uppercase underline-offset-4 hover:underline"
            >
              <span className="rotate-180">
                <ArrowRightIcon size={15} />
              </span>
              Seguir comprando
            </Link>
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="border border-line bg-white p-6">
              <h2 className="text-sm font-bold tracking-[0.12em] uppercase">
                Resumen del pedido
              </h2>
              <dl className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">Subtotal</dt>
                  <dd className="font-semibold">{formatCOP(subtotal)}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">Envío estándar</dt>
                  <dd className="font-semibold">
                    {shipping === 0 ? "Gratis" : formatCOP(shipping)}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 border-t border-line pt-3 text-base">
                  <dt className="font-bold">Total</dt>
                  <dd className="font-black">{formatCOP(total)}</dd>
                </div>
              </dl>
              <p className="mt-2 text-[11px] text-muted">IVA incluido.</p>

              <Link href="/checkout" className="btn btn-primary mt-6 w-full">
                Ir a pagar
                <ArrowRightIcon size={16} />
              </Link>

              <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-muted">
                <LockIcon size={13} />
                Pago cifrado y seguro con Wompi
              </div>

              <div className="mt-6 border-t border-line pt-4">
                <p className="text-[10px] font-semibold tracking-[0.12em] text-muted uppercase">
                  Aceptamos
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {["Visa", "Mastercard", "PSE", "Nequi", "Bancolombia"].map(
                    (method) => (
                      <span
                        key={method}
                        className="border border-line px-2 py-1 text-[9px] font-semibold tracking-wide text-muted uppercase"
                      >
                        {method}
                      </span>
                    ),
                  )}
                </div>
              </div>
            </div>

            <div className="mt-3 border border-line p-4 text-[11px] leading-relaxed text-muted">
              <p className="font-semibold text-ink">Cambios gratis por 30 días.</p>
              <p className="mt-1">
                Si la talla no es la correcta, el primer cambio corre por
                nuestra cuenta.
              </p>
            </div>
          </aside>
        </div>
      )}

      <section className="mt-16 border-t border-line pt-12 md:mt-24">
        <SectionHeading
          eyebrow="Tal vez te sirva"
          title="Completa tu rotación"
          href="/tienda"
        />
        <ProductGrid products={featuredProducts.slice(0, 4)} />
      </section>
    </div>
  );
}
