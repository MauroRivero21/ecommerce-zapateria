import { createHash } from "node:crypto";
import { NextResponse } from "next/server";

type WompiEvent = {
  event?: string;
  data?: {
    transaction?: {
      id?: string;
      status?: string;
      reference?: string;
      amount_in_cents?: number;
      currency?: string;
      payment_method_type?: string;
    };
  };
  sent_at?: string;
  timestamp?: number;
  signature?: {
    properties?: string[];
    checksum?: string;
  };
};

const getByPath = (source: unknown, path: string): unknown => {
  return path.split(".").reduce<unknown>((current, key) => {
    if (current && typeof current === "object" && key in current) {
      return (current as Record<string, unknown>)[key];
    }
    return undefined;
  }, source);
};

export async function POST(request: Request) {
  let event: WompiEvent;

  try {
    event = (await request.json()) as WompiEvent;
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const secret = process.env.WOMPI_EVENTS_SECRET;
  const properties = event.signature?.properties ?? [];
  const checksum = event.signature?.checksum;

  if (secret && checksum && properties.length > 0) {
    const values = properties.map((property) => {
      const fromData = getByPath(event.data, property);
      const value = fromData ?? getByPath(event, property);
      return value === undefined || value === null ? "" : String(value);
    });

    const expected = createHash("sha256")
      .update(`${values.join("")}${event.timestamp ?? ""}${secret}`)
      .digest("hex");

    if (expected.toLowerCase() !== checksum.toLowerCase()) {
      return NextResponse.json({ error: "Firma inválida." }, { status: 401 });
    }
  }

  const transaction = event.data?.transaction;

  if (event.event === "transaction.updated" && transaction?.status === "APPROVED") {
    // TODO: cuando el pedido viva en Medusa, marcar la orden como pagada aquí
    // usando transaction.reference. Nunca confíes en el monto que llega del
    // cliente: valida contra la orden guardada en tu base de datos.
    console.info(
      `[wompi] Pago aprobado ref=${transaction.reference} tx=${transaction.id}`,
    );
  }

  return NextResponse.json({ received: true });
}
