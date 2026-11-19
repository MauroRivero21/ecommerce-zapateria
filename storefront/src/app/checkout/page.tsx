"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/components/cart-provider";
import {
  ArrowRightIcon,
  CardIcon,
  CheckIcon,
  LockIcon,
  ReturnIcon,
  ShieldIcon,
  TruckIcon,
} from "@/components/icons";
import { site } from "@/lib/config";
import { formatCOP } from "@/lib/format";
import { orderTotal, paymentFee, shippingCost } from "@/lib/shipping";
import type {
  Customer,
  Order,
  PaymentMethod,
  ShippingMethod,
} from "@/lib/types";

const departments = [
  "Amazonas",
  "Antioquia",
  "Arauca",
  "Atlántico",
  "Bolívar",
  "Boyacá",
  "Caldas",
  "Caquetá",
  "Casanare",
  "Cauca",
  "Cesar",
  "Chocó",
  "Córdoba",
  "Cundinamarca",
  "Guainía",
  "Guaviare",
  "Huila",
  "La Guajira",
  "Magdalena",
  "Meta",
  "Nariño",
  "Norte de Santander",
  "Putumayo",
  "Quindío",
  "Risaralda",
  "San Andrés y Providencia",
  "Santander",
  "Sucre",
  "Tolima",
  "Valle del Cauca",
  "Vaupés",
  "Vichada",
  "Bogotá D.C.",
];

const emptyCustomer: Customer = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  department: "",
  notes: "",
};

export default function CheckoutPage() {
  const { items, subtotal, hydrated, clearCart } = useCart();
  const router = useRouter();
  const [customer, setCustomer] = useState<Customer>(emptyCustomer);
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>("standard");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("wompi");
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shipping = shippingCost(subtotal, shippingMethod);
  const fee = paymentFee(paymentMethod);
  const total = orderTotal(subtotal, shippingMethod, paymentMethod);

  const update = (field: keyof Customer, value: string) => {
    setCustomer((current) => ({ ...current, [field]: value }));
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!accepted) {
      setError("Debes aceptar los términos y la política de privacidad.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.productId,
            size: item.size,
            color: item.color,
            quantity: item.quantity,
          })),
          customer,
          shippingMethod,
          paymentMethod,
        }),
      });

      const data = (await response.json()) as {
        error?: string;
        mode?: string;
        reference: string;
        subtotal: number;
        shipping: number;
        fee: number;
        total: number;
        checkoutUrl?: string;
      };

      if (!response.ok) {
        throw new Error(data.error ?? "No pudimos procesar tu pedido.");
      }

      const order: Order = {
        reference: data.reference,
        createdAt: new Date().toISOString(),
        items,
        customer,
        shippingMethod,
        paymentMethod,
        subtotal: data.subtotal,
        shipping: data.shipping,
        total: data.total,
        status: "pendiente",
        demo: data.mode === "demo",
      };

      try {
        window.localStorage.setItem("dr_last_order", JSON.stringify(order));
        const history = JSON.parse(
          window.localStorage.getItem("dr_orders") ?? "[]",
        ) as Order[];
        window.localStorage.setItem(
          "dr_orders",
          JSON.stringify([order, ...history].slice(0, 30)),
        );
      } catch {
        // El pedido igualmente se envía al servidor.
      }

      if (data.checkoutUrl) {
        window.location.assign(data.checkoutUrl);
        return;
      }

      clearCart();
      router.push(
        `/checkout/exito?pedido=${encodeURIComponent(data.reference)}${
          data.mode === "demo" ? "&demo=1" : ""
        }`,
      );
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Ocurrió un error inesperado. Intenta de nuevo.",
      );
      setLoading(false);
    }
  };

  if (!hydrated) {
    return (
      <div className="container-x py-12">
        <div className="h-10 w-56 animate-pulse bg-bone" />
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div className="h-[520px] animate-pulse bg-bone" />
          <div className="h-80 animate-pulse bg-bone" />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-x flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-bone">
          <TruckIcon size={34} />
        </div>
        <h1 className="display mt-6 text-4xl">No hay nada para pagar</h1>
        <p className="mt-3 max-w-sm text-sm text-muted">
          Tu carrito está vacío. Agrega un par antes de pasar al checkout.
        </p>
        <Link href="/tienda" className="btn btn-primary mt-7">
          Explorar la colección
          <ArrowRightIcon size={16} />
        </Link>
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
        <Link href="/carrito" className="hover:text-ink">
          Carrito
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">Checkout</span>
      </nav>

      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
        <div>
          <p className="eyebrow text-muted">Paso 2 de 2</p>
          <h1 className="display mt-2 text-[clamp(2.8rem,6vw,5rem)]">Checkout</h1>
        </div>
        <div className="flex items-center gap-2 pb-1 text-[11px] text-muted">
          <LockIcon size={14} />
          Compra protegida · Datos cifrados
        </div>
      </div>

      <form onSubmit={submit} className="mt-8 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
        <div className="space-y-8">
          <section>
            <SectionTitle number="01" title="Contacto" />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Correo electrónico"
                type="email"
                autoComplete="email"
                required
                value={customer.email}
                onChange={(value) => update("email", value)}
                placeholder="tu@correo.com"
              />
              <Field
                label="Teléfono"
                type="tel"
                autoComplete="tel"
                required
                value={customer.phone}
                onChange={(value) => update("phone", value)}
                placeholder="300 123 4567"
              />
            </div>
            <p className="mt-2 text-[11px] text-muted">
              Te enviaremos la confirmación y la guía de envío a este correo.
            </p>
          </section>

          <section>
            <SectionTitle number="02" title="Dirección de envío" />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Nombre"
                autoComplete="given-name"
                required
                value={customer.firstName}
                onChange={(value) => update("firstName", value)}
                placeholder="Daniel"
              />
              <Field
                label="Apellido"
                autoComplete="family-name"
                required
                value={customer.lastName}
                onChange={(value) => update("lastName", value)}
                placeholder="Restrepo"
              />
              <div className="sm:col-span-2">
                <Field
                  label="Dirección"
                  autoComplete="street-address"
                  required
                  value={customer.address}
                  onChange={(value) => update("address", value)}
                  placeholder="Calle 123 # 45-67, apto 101"
                />
              </div>
              <Field
                label="Ciudad"
                autoComplete="address-level2"
                required
                value={customer.city}
                onChange={(value) => update("city", value)}
                placeholder="Medellín"
              />
              <div>
                <label htmlFor="department" className="label">
                  Departamento
                </label>
                <select
                  id="department"
                  required
                  autoComplete="address-level1"
                  value={customer.department}
                  onChange={(event) => update("department", event.target.value)}
                  className="field cursor-pointer"
                >
                  <option value="">Selecciona</option>
                  {departments.map((department) => (
                    <option key={department} value={department}>
                      {department}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="notes" className="label">
                  Notas para la entrega (opcional)
                </label>
                <textarea
                  id="notes"
                  rows={2}
                  value={customer.notes}
                  onChange={(event) => update("notes", event.target.value)}
                  className="field resize-none"
                  placeholder="Torre, apartamento, indicaciones..."
                />
              </div>
            </div>
          </section>

          <section>
            <SectionTitle number="03" title="Método de envío" />
            <div className="grid gap-2.5">
              <RadioCard
                name="shipping"
                checked={shippingMethod === "standard"}
                onChange={() => setShippingMethod("standard")}
                title="Envío estándar"
                description="2 a 5 días hábiles · Todo Colombia"
                price={
                  shippingCost(subtotal, "standard") === 0
                    ? "Gratis"
                    : formatCOP(shippingCost(subtotal, "standard"))
                }
                icon={<TruckIcon size={20} />}
              />
              <RadioCard
                name="shipping"
                checked={shippingMethod === "express"}
                onChange={() => setShippingMethod("express")}
                title="Envío express"
                description="1 a 2 días hábiles · Ciudades principales"
                price={formatCOP(site.expressShipping)}
                icon={<TruckIcon size={20} />}
              />
            </div>
          </section>

          <section>
            <SectionTitle number="04" title="Pago" />
            <div className="grid gap-2.5">
              <RadioCard
                name="payment"
                checked={paymentMethod === "wompi"}
                onChange={() => setPaymentMethod("wompi")}
                title="Wompi"
                description="Tarjetas, PSE, Nequi y Bancolombia. Pago seguro."
                price=""
                icon={<CardIcon size={20} />}
                recommended
              />
              <RadioCard
                name="payment"
                checked={paymentMethod === "cod"}
                onChange={() => setPaymentMethod("cod")}
                title="Pago contra entrega"
                description={`Pagas cuando recibes · Recargo ${formatCOP(site.cashOnDeliveryFee)}`}
                price=""
                icon={<TruckIcon size={20} />}
              />
            </div>

            {paymentMethod === "wompi" ? (
              <div className="mt-3 flex items-start gap-2 border border-line bg-bone/50 p-3 text-[11px] leading-relaxed text-muted">
                <ShieldIcon size={17} className="mt-0.5 shrink-0" />
                <p>
                  Al confirmar, te redirigimos a la pasarela de Wompi para
                  completar el pago. Daniel Restrepo nunca almacena los datos de
                  tu tarjeta.
                </p>
              </div>
            ) : (
              <div className="mt-3 flex items-start gap-2 border border-line bg-bone/50 p-3 text-[11px] leading-relaxed text-muted">
                <TruckIcon size={17} className="mt-0.5 shrink-0" />
                <p>
                  Pagas en efectivo al transportador cuando recibes tu pedido.
                  Disponible en ciudades principales.
                </p>
              </div>
            )}
          </section>

          <section>
            <label className="flex cursor-pointer items-start gap-3 text-xs leading-relaxed">
              <input
                type="checkbox"
                checked={accepted}
                onChange={(event) => setAccepted(event.target.checked)}
                className="mt-0.5 h-4 w-4 accent-ink"
                required
              />
              <span className="text-muted">
                Acepto los{" "}
                <Link href="/legal/terminos" className="text-ink underline underline-offset-2">
                  términos y condiciones
                </Link>
                , la{" "}
                <Link href="/legal/privacidad" className="text-ink underline underline-offset-2">
                  política de privacidad
                </Link>{" "}
                y la{" "}
                <Link href="/legal/cambios" className="text-ink underline underline-offset-2">
                  política de cambios
                </Link>
                .
              </span>
            </label>
          </section>

          {error && (
            <p
              role="alert"
              className="border border-danger/30 bg-danger/5 px-4 py-3 text-xs text-danger"
            >
              {error}
            </p>
          )}
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="border border-line bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold tracking-[0.12em] uppercase">
                Tu pedido
              </h2>
              <Link
                href="/carrito"
                className="text-[11px] text-muted underline underline-offset-2 hover:text-ink"
              >
                Editar
              </Link>
            </div>

            <ul className="mt-5 space-y-4">
              {items.map((item) => (
                <li key={item.key} className="flex gap-3">
                  <div className="relative h-20 w-16 shrink-0 overflow-hidden bg-bone">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                    <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-ink px-1 text-[9px] font-bold text-paper">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-bold">{item.name}</p>
                    <p className="mt-0.5 text-[10px] text-muted">
                      Talla {item.size} · {item.color}
                    </p>
                    <p className="mt-1 text-xs font-semibold">
                      {formatCOP(item.price * item.quantity)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <dl className="mt-5 space-y-2.5 border-t border-line pt-4 text-xs">
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Subtotal</dt>
                <dd className="font-semibold">{formatCOP(subtotal)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Envío</dt>
                <dd className="font-semibold">
                  {shipping === 0 ? "Gratis" : formatCOP(shipping)}
                </dd>
              </div>
              {fee > 0 && (
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">Contra entrega</dt>
                  <dd className="font-semibold">{formatCOP(fee)}</dd>
                </div>
              )}
              <div className="flex justify-between gap-4 border-t border-line pt-3 text-base">
                <dt className="font-bold">Total</dt>
                <dd className="font-black">{formatCOP(total)}</dd>
              </div>
            </dl>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary mt-6 w-full disabled:cursor-wait disabled:opacity-70"
            >
              {loading
                ? "Procesando..."
                : paymentMethod === "wompi"
                  ? `Pagar ${formatCOP(total)}`
                  : "Confirmar pedido"}
              {!loading && <ArrowRightIcon size={16} />}
            </button>

            <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-muted">
              <LockIcon size={13} />
              Pago cifrado · Wompi
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2 border-t border-line pt-4 text-center text-[9px] text-muted">
              <div className="flex flex-col items-center gap-1.5">
                <ShieldIcon size={17} />
                Compra segura
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <ReturnIcon size={17} />
                Cambios 30 días
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <CheckIcon size={17} />
                Originales
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-center gap-2 border border-line p-3 text-[10px] text-muted">
            <LockIcon size={13} />
            Tus datos se transmiten de forma segura.
          </div>
        </aside>
      </form>
    </div>
  );
}

function SectionTitle({ number, title }: { number: string; title: string }) {
  return (
    <div className="mb-4 flex items-center gap-3 border-b border-line pb-3">
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink text-[10px] font-bold text-paper">
        {number}
      </span>
      <h2 className="text-xs font-bold tracking-[0.14em] uppercase">{title}</h2>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  const id = label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div>
      <label htmlFor={id} className="label">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        className="field"
      />
    </div>
  );
}

function RadioCard({
  name,
  checked,
  onChange,
  title,
  description,
  price,
  icon,
  recommended = false,
}: {
  name: string;
  checked: boolean;
  onChange: () => void;
  title: string;
  description: string;
  price: string;
  icon: React.ReactNode;
  recommended?: boolean;
}) {
  return (
    <label
      className={`flex cursor-pointer items-center gap-3 border p-4 transition ${
        checked ? "border-ink bg-ink text-paper" : "border-line bg-white hover:border-ink/40"
      }`}
    >
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
          checked ? "border-volt bg-volt text-ink" : "border-line"
        }`}
      >
        {checked && <CheckIcon size={12} />}
      </span>
      <span className={checked ? "text-paper/70" : "text-muted"}>{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold tracking-[0.06em] uppercase">
            {title}
          </span>
          {recommended && (
            <span className="bg-volt px-1.5 py-0.5 text-[8px] font-bold tracking-[0.1em] text-ink uppercase">
              Recomendado
            </span>
          )}
        </span>
        <span
          className={`mt-0.5 block text-[11px] ${
            checked ? "text-paper/55" : "text-muted"
          }`}
        >
          {description}
        </span>
      </span>
      {price && <span className="text-xs font-bold whitespace-nowrap">{price}</span>}
    </label>
  );
}
