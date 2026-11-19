"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useCart } from "./cart-provider";
import { site } from "@/lib/config";
import { formatCOP } from "@/lib/format";
import {
  ArrowRightIcon,
  CloseIcon,
  MinusIcon,
  PlusIcon,
  TrashIcon,
  TruckIcon,
} from "./icons";

export function CartDrawer() {
  const {
    items,
    count,
    subtotal,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
  } = useCart();
  const pathname = usePathname();

  useEffect(() => {
    closeCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeCart();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, closeCart]);

  if (!isOpen) return null;

  const remaining = Math.max(0, site.freeShippingThreshold - subtotal);
  const progress = Math.min(100, (subtotal / site.freeShippingThreshold) * 100);

  return (
    <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-label="Carrito de compras">
      <button
        type="button"
        aria-label="Cerrar carrito"
        onClick={closeCart}
        className="absolute inset-0 bg-ink/45 backdrop-blur-[2px]"
      />
      <aside className="absolute inset-y-0 right-0 flex w-full max-w-[440px] flex-col bg-paper shadow-2xl">
        <div className="flex items-center justify-between border-b border-line px-5 py-5">
          <div>
            <p className="eyebrow text-muted">Tu selección</p>
            <h2 className="mt-1 text-lg font-bold">
              Carrito <span className="text-muted">({count})</span>
            </h2>
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="rounded-full border border-line p-2 transition hover:border-ink"
            aria-label="Cerrar carrito"
          >
            <CloseIcon size={18} />
          </button>
        </div>

        {items.length > 0 && (
          <div className="border-b border-line bg-bone/50 px-5 py-4">
            <div className="flex items-center gap-2 text-xs">
              <TruckIcon size={17} />
              {remaining > 0 ? (
                <p>
                  Te faltan <strong>{formatCOP(remaining)}</strong> para el envío
                  gratis.
                </p>
              ) : (
                <p className="font-semibold">¡Tienes envío gratis en este pedido!</p>
              )}
            </div>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-line">
              <div
                className="h-full rounded-full bg-ink transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-bone">
              <TruckIcon size={28} />
            </div>
            <div>
              <p className="text-lg font-bold">Tu carrito está vacío</p>
              <p className="mt-1 text-sm text-muted">
                Encuentra tu próximo par y vuelve cuando estés listo.
              </p>
            </div>
            <Link href="/tienda" onClick={closeCart} className="btn btn-primary mt-2">
              Explorar tienda
              <ArrowRightIcon size={16} />
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5">
              <ul className="divide-y divide-line">
                {items.map((item) => (
                  <li key={item.key} className="flex gap-4 py-5">
                    <Link
                      href={`/producto/${item.slug}`}
                      onClick={closeCart}
                      className="relative h-28 w-24 shrink-0 overflow-hidden bg-bone"
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    </Link>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <Link
                            href={`/producto/${item.slug}`}
                            onClick={closeCart}
                            className="text-sm font-bold hover:underline"
                          >
                            {item.name}
                          </Link>
                          <p className="mt-1 text-xs text-muted">
                            Talla {item.size} · {item.color}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.key)}
                          className="text-muted transition hover:text-danger"
                          aria-label={`Eliminar ${item.name}`}
                        >
                          <TrashIcon size={16} />
                        </button>
                      </div>
                      <div className="mt-auto flex items-end justify-between gap-3 pt-3">
                        <div className="flex items-center border border-line bg-white">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.key, item.quantity - 1)}
                            className="p-2 transition hover:bg-bone"
                            aria-label="Disminuir cantidad"
                          >
                            <MinusIcon size={13} />
                          </button>
                          <span className="w-7 text-center text-xs font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.key, item.quantity + 1)}
                            className="p-2 transition hover:bg-bone"
                            aria-label="Aumentar cantidad"
                          >
                            <PlusIcon size={13} />
                          </button>
                        </div>
                        <p className="text-sm font-bold">
                          {formatCOP(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-line bg-paper px-5 py-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted">Subtotal</span>
                <span className="text-base font-bold">{formatCOP(subtotal)}</span>
              </div>
              <p className="mt-1 text-[11px] text-muted">
                Impuestos incluidos. El envío se calcula en el checkout.
              </p>
              <div className="mt-4 grid gap-2">
                <Link href="/checkout" onClick={closeCart} className="btn btn-primary w-full">
                  Ir a pagar
                  <ArrowRightIcon size={16} />
                </Link>
                <Link href="/carrito" onClick={closeCart} className="btn btn-outline w-full">
                  Ver carrito
                </Link>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
