"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "./cart-provider";
import {
  ArrowRightIcon,
  CheckIcon,
  ReturnIcon,
  TruckIcon,
} from "./icons";
import { formatCOP, formatDate } from "@/lib/format";
import type { Order } from "@/lib/types";

export function OrderSuccess({
  reference,
  demo,
}: {
  reference: string;
  demo: boolean;
}) {
  const { clearCart } = useCart();
  const [order, setOrder] = useState<Order | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("dr_last_order");
      if (stored) {
        const parsed = JSON.parse(stored) as Order;
        if (!reference || parsed.reference === reference) {
          setOrder(parsed);
          clearCart();
        }
      }
    } catch {
      // Sin datos locales del pedido.
    } finally {
      setLoaded(true);
    }
  }, [reference, clearCart]);

  const isCod = order?.paymentMethod === "cod";
  const isDemo = demo || order?.demo;

  return (
    <div className="container-x py-10 md:py-16">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-volt">
            <CheckIcon size={30} />
          </span>
          <p className="eyebrow mt-6 text-muted">
            {isDemo ? "Pedido de demostración" : "Pedido recibido"}
          </p>
          <h1 className="display mt-3 text-[clamp(2.8rem,7vw,5.5rem)]">
            Gracias por moverte
            <span className="text-muted/50"> con nosotros.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted">
            {isCod
              ? "Tu pedido quedó registrado para pago contra entrega. Te contactaremos para confirmar la dirección y la fecha de entrega."
              : isDemo
                ? "Este es un pedido de prueba: no se procesó ningún pago real. Configura las llaves de Wompi para activar la pasarela."
                : "Estamos confirmando tu pago con Wompi. En cuanto se apruebe, prepararemos tu pedido y te enviaremos la guía por correo."}
          </p>
          {reference && (
            <p className="mt-5 inline-flex items-center gap-2 border border-line bg-white px-4 py-2 text-xs">
              <span className="text-muted">Referencia:</span>
              <strong className="tracking-wide">{reference}</strong>
            </p>
          )}
        </div>

        <div className="mt-10 grid gap-3 border border-line bg-white p-5 sm:grid-cols-4">
          {[
            { icon: CheckIcon, label: "Pedido creado", active: true },
            {
              icon: CheckIcon,
              label: isCod ? "Pago al recibir" : "Pago",
              active: !isDemo,
            },
            { icon: TruckIcon, label: "Preparación", active: false },
            { icon: ReturnIcon, label: "Entrega", active: false },
          ].map((step, index) => (
            <div key={step.label} className="flex items-center gap-3">
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                  step.active ? "bg-ink text-paper" : "bg-bone text-muted"
                }`}
              >
                {step.active ? <step.icon size={14} /> : index + 1}
              </span>
              <div>
                <p className="text-[10px] font-bold tracking-[0.08em] uppercase">
                  {step.label}
                </p>
                <p className="text-[10px] text-muted">
                  {step.active ? "Completado" : "Pendiente"}
                </p>
              </div>
            </div>
          ))}
        </div>

        {!loaded ? (
          <div className="mt-8 h-64 animate-pulse bg-bone" />
        ) : order ? (
          <div className="mt-8 grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
            <div className="border border-line bg-white p-6">
              <h2 className="text-xs font-bold tracking-[0.12em] uppercase">
                Resumen del pedido
              </h2>
              <ul className="mt-4 divide-y divide-line">
                {order.items.map((item) => (
                  <li key={item.key} className="flex gap-3 py-3">
                    <div className="relative h-20 w-16 shrink-0 overflow-hidden bg-bone">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold">{item.name}</p>
                      <p className="mt-0.5 text-[10px] text-muted">
                        Talla {item.size} · {item.color} · x{item.quantity}
                      </p>
                    </div>
                    <p className="text-xs font-semibold">
                      {formatCOP(item.price * item.quantity)}
                    </p>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex justify-between border-t border-line pt-4 text-sm">
                <span className="font-bold">Total</span>
                <span className="font-black">{formatCOP(order.total)}</span>
              </div>
              <p className="mt-1 text-[10px] text-muted">
                Creado el {formatDate(order.createdAt)}
              </p>
            </div>

            <div className="space-y-4">
              <div className="border border-line bg-white p-6">
                <h2 className="text-xs font-bold tracking-[0.12em] uppercase">
                  Entrega
                </h2>
                <p className="mt-3 text-sm font-semibold">
                  {order.customer.firstName} {order.customer.lastName}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-muted">
                  {order.customer.address}
                  <br />
                  {order.customer.city}, {order.customer.department}
                  <br />
                  {order.customer.phone}
                </p>
                <p className="mt-3 text-[11px] text-muted">
                  {order.shippingMethod === "express"
                    ? "Envío express · 1 a 2 días hábiles"
                    : "Envío estándar · 2 a 5 días hábiles"}
                </p>
              </div>
              <div className="border border-line bg-bone/50 p-5 text-[11px] leading-relaxed text-muted">
                <p className="font-semibold text-ink">¿Necesitas ayuda?</p>
                <p className="mt-1">
                  Escríbenos por WhatsApp o a hola@danielrestrepo.co con tu
                  referencia {order.reference}.
                </p>
                <Link
                  href="/ayuda#contacto"
                  className="mt-3 inline-flex items-center gap-1.5 font-semibold text-ink underline underline-offset-2"
                >
                  Centro de ayuda
                  <ArrowRightIcon size={13} />
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-8 border border-line bg-white p-8 text-center">
            <p className="text-sm text-muted">
              No encontramos el detalle de este pedido en este dispositivo. Si
              ya pagaste, revisa tu correo de confirmación o escríbenos con la
              referencia.
            </p>
          </div>
        )}

        <div className="mt-8 flex flex-wrap justify-center gap-2.5">
          <Link href="/tienda" className="btn btn-primary">
            Seguir comprando
            <ArrowRightIcon size={16} />
          </Link>
          <Link href="/" className="btn btn-outline">
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
