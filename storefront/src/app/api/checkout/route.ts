import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { site } from "@/lib/config";
import { getProductById } from "@/lib/products";
import { orderTotal, paymentFee, shippingCost } from "@/lib/shipping";
import type { Customer, PaymentMethod, ShippingMethod } from "@/lib/types";

type IncomingItem = {
  productId: string;
  size: number;
  color: string;
  quantity: number;
};

type CheckoutBody = {
  items: IncomingItem[];
  customer: Customer;
  shippingMethod: ShippingMethod;
  paymentMethod: PaymentMethod;
};

const isNonEmpty = (value: unknown) =>
  typeof value === "string" && value.trim().length > 0;

export async function POST(request: Request) {
  let body: CheckoutBody;

  try {
    body = (await request.json()) as CheckoutBody;
  } catch {
    return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  if (!Array.isArray(body.items) || body.items.length === 0) {
    return NextResponse.json({ error: "Tu carrito está vacío." }, { status: 400 });
  }

  if (body.items.length > 20) {
    return NextResponse.json({ error: "Demasiados artículos." }, { status: 400 });
  }

  const customer = body.customer;
  const requiredFields: (keyof Customer)[] = [
    "firstName",
    "lastName",
    "email",
    "phone",
    "address",
    "city",
    "department",
  ];

  if (!customer || requiredFields.some((field) => !isNonEmpty(customer[field]))) {
    return NextResponse.json(
      { error: "Completa todos los datos de envío." },
      { status: 400 },
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) {
    return NextResponse.json({ error: "El correo no es válido." }, { status: 400 });
  }

  if (body.shippingMethod !== "standard" && body.shippingMethod !== "express") {
    return NextResponse.json({ error: "Método de envío inválido." }, { status: 400 });
  }

  if (body.paymentMethod !== "wompi" && body.paymentMethod !== "cod") {
    return NextResponse.json({ error: "Método de pago inválido." }, { status: 400 });
  }

  let subtotal = 0;

  for (const item of body.items) {
    const product = getProductById(item.productId);
    if (!product) {
      return NextResponse.json(
        { error: "Uno de los productos ya no está disponible." },
        { status: 400 },
      );
    }

    const size = product.sizes.find((entry) => entry.size === item.size);
    if (!size || size.stock <= 0) {
      return NextResponse.json(
        { error: `La talla ${item.size} de ${product.name} está agotada.` },
        { status: 400 },
      );
    }

    if (!product.colors.some((color) => color.name === item.color)) {
      return NextResponse.json(
        { error: "El color seleccionado no está disponible." },
        { status: 400 },
      );
    }

    const quantity = Math.floor(Number(item.quantity));
    if (!Number.isFinite(quantity) || quantity < 1 || quantity > 10) {
      return NextResponse.json(
        { error: "Cantidad inválida en el carrito." },
        { status: 400 },
      );
    }

    if (quantity > size.stock) {
      return NextResponse.json(
        { error: `No hay suficientes unidades de ${product.name} en talla ${item.size}.` },
        { status: 400 },
      );
    }

    subtotal += product.price * quantity;
  }

  const shipping = shippingCost(subtotal, body.shippingMethod);
  const fee = paymentFee(body.paymentMethod);
  const total = orderTotal(subtotal, body.shippingMethod, body.paymentMethod);
  const reference = `DR-${Date.now().toString(36).toUpperCase()}-${Math.random()
    .toString(36)
    .slice(2, 6)
    .toUpperCase()}`;

  const publicKey = process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY;
  const integritySecret = process.env.WOMPI_INTEGRITY_SECRET;

  if (body.paymentMethod === "cod" || !publicKey || !integritySecret) {
    return NextResponse.json({
      mode: "demo",
      reference,
      subtotal,
      shipping,
      fee,
      total,
      message:
        body.paymentMethod === "cod"
          ? "Pedido registrado para pago contra entrega."
          : "Modo demo: configura las llaves de Wompi para procesar pagos reales.",
    });
  }

  const amountInCents = total * 100;
  const signature = createHash("sha256")
    .update(`${reference}${amountInCents}COP${integritySecret}`)
    .digest("hex");

  const params = new URLSearchParams({
    "public-key": publicKey,
    currency: "COP",
    "amount-in-cents": String(amountInCents),
    reference,
    "signature:integrity": signature,
    "redirect-url": `${site.url}/checkout/exito?pedido=${reference}`,
    "customer-data:email": customer.email,
    "customer-data:full-name": `${customer.firstName} ${customer.lastName}`,
    "customer-data:phone-number": customer.phone.replace(/\D/g, ""),
    "customer-data:phone-number-prefix": "+57",
    "shipping-address:address-line-1": customer.address,
    "shipping-address:city": customer.city,
    "shipping-address:region": customer.department,
    "shipping-address:country": "CO",
    "shipping-address:phone-number": customer.phone.replace(/\D/g, ""),
  });

  return NextResponse.json({
    mode: "wompi",
    reference,
    subtotal,
    shipping,
    fee,
    total,
    checkoutUrl: `https://checkout.wompi.co/p/?${params.toString()}`,
  });
}
