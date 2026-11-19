import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRightIcon,
  CardIcon,
  ChevronDownIcon,
  ReturnIcon,
  TruckIcon,
  WhatsAppIcon,
} from "@/components/icons";
import { site } from "@/lib/config";

export const metadata: Metadata = {
  title: "Ayuda",
  description:
    "Envíos, cambios, guía de tallas, métodos de pago y contacto de Daniel Restrepo.",
};

const quickLinks = [
  { label: "Envíos", href: "#envios", icon: TruckIcon },
  { label: "Cambios", href: "#cambios", icon: ReturnIcon },
  { label: "Tallas", href: "#tallas", icon: ArrowRightIcon },
  { label: "Pagos", href: "#pagos", icon: CardIcon },
  { label: "Contacto", href: "#contacto", icon: WhatsAppIcon },
];

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

const faqs = [
  {
    question: "¿Cuánto tarda mi pedido?",
    answer:
      "El envío estándar tarda de 2 a 5 días hábiles y el express de 1 a 2 días hábiles en ciudades principales. Una vez despachamos, recibes la guía de rastreo por correo.",
  },
  {
    question: "¿Puedo cambiar mi talla?",
    answer:
      "Sí. Tienes 30 días calendario desde la entrega para solicitar un cambio. El primer cambio es gratis. El producto debe estar sin uso y en su empaque original.",
  },
  {
    question: "¿Cómo sé qué talla pedir?",
    answer:
      "Mide tu pie desde el talón hasta la punta del dedo más largo y compara con la tabla de tallas. Si estás entre dos tallas, te recomendamos elegir la mayor.",
  },
  {
    question: "¿Qué métodos de pago aceptan?",
    answer:
      "Aceptamos tarjetas débito y crédito, PSE, Nequi y Bancolombia a través de Wompi. También puedes pagar contra entrega en ciudades principales con un recargo de $8.000.",
  },
  {
    question: "¿Los productos son originales?",
    answer:
      "Todos nuestros pares son de producción propia y pasan por control de calidad antes de ser despachados. Cada pedido incluye su factura electrónica.",
  },
];

export default function HelpPage() {
  return (
    <div className="container-x py-10 md:py-16">
      <nav className="mb-6 text-[11px] text-muted" aria-label="Migas de pan">
        <Link href="/" className="hover:text-ink">
          Inicio
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">Ayuda</span>
      </nav>

      <div className="max-w-3xl">
        <p className="eyebrow text-muted">Estamos para ayudarte</p>
        <h1 className="display mt-2 text-[clamp(2.8rem,7vw,5.5rem)]">
          Centro de ayuda
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">
          Todo lo que necesitas saber sobre envíos, cambios, tallas y pagos.
          Si no encuentras tu respuesta, escríbenos y te respondemos el mismo
          día hábil.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-5">
        {quickLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="flex items-center gap-2 border border-line bg-white px-3 py-3 text-xs font-semibold transition hover:border-ink hover:bg-ink hover:text-paper"
          >
            <link.icon size={17} />
            {link.label}
          </a>
        ))}
      </div>

      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_320px]">
        <div className="space-y-12">
          <section id="envios" className="scroll-mt-28">
            <h2 className="display text-4xl">Envíos</h2>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted">
              <p>
                Enviamos a todo Colombia con transportadoras aliadas. El costo
                del envío estándar es de{" "}
                <strong className="text-ink">$15.000</strong> y es{" "}
                <strong className="text-ink">gratis</strong> en compras desde{" "}
                <strong className="text-ink">$250.000</strong>.
              </p>
              <p>
                El envío express tiene un costo de{" "}
                <strong className="text-ink">$25.000</strong> y aplica para
                ciudades principales. Los tiempos se cuentan desde que el pedido
                es despachado, no desde la compra.
              </p>
              <p>
                Si tu pedido tiene pago contra entrega, el transportador te
                contactará para coordinar la entrega y el recaudo.
              </p>
            </div>
          </section>

          <section id="cambios" className="scroll-mt-28">
            <h2 className="display text-4xl">Cambios y devoluciones</h2>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted">
              <p>
                Tienes <strong className="text-ink">30 días calendario</strong>{" "}
                desde la entrega para cambiar tu talla o devolver el producto.
                El primer cambio es gratis; los siguientes tienen un costo de
                envío.
              </p>
              <p>
                El producto debe estar sin uso, con sus etiquetas y en el
                empaque original. Por higiene, no aceptamos cambios de productos
                usados al aire libre.
              </p>
              <p>
                Para iniciar un cambio escríbenos a{" "}
                <a href={`mailto:${site.email}`} className="text-ink underline underline-offset-2">
                  {site.email}
                </a>{" "}
                con tu número de pedido.
              </p>
            </div>
          </section>

          <section id="tallas" className="scroll-mt-28">
            <h2 className="display text-4xl">Guía de tallas</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Mide tu pie apoyado sobre una hoja, desde el talón hasta la punta
              del dedo más largo. Compara el resultado con la tabla:
            </p>
            <div className="mt-5 overflow-hidden border border-line bg-white">
              <table className="w-full border-collapse text-left text-xs">
                <thead className="bg-ink text-paper">
                  <tr className="text-[10px] tracking-[0.12em] uppercase">
                    <th className="px-4 py-3">EU</th>
                    <th className="px-4 py-3">US</th>
                    <th className="px-4 py-3">CM</th>
                  </tr>
                </thead>
                <tbody>
                  {sizeGuide.map((row) => (
                    <tr key={row.eu} className="border-b border-line last:border-0">
                      <td className="px-4 py-2.5 font-semibold">{row.eu}</td>
                      <td className="px-4 py-2.5 text-muted">{row.us}</td>
                      <td className="px-4 py-2.5 text-muted">{row.cm}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-[11px] text-muted">
              Si estás entre dos tallas, elige la mayor. Para running, considera
              media talla más si usas medias gruesas.
            </p>
          </section>

          <section id="pagos" className="scroll-mt-28">
            <h2 className="display text-4xl">Métodos de pago</h2>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {[
                ["Tarjetas débito y crédito", "Visa, Mastercard y Amex"],
                ["PSE", "Débito desde tu banco"],
                ["Nequi y Bancolombia", "Pago desde tu app"],
                ["Contra entrega", "Efectivo al recibir (ciudades principales)"],
              ].map(([title, text]) => (
                <div key={title} className="border border-line bg-white p-4">
                  <p className="text-xs font-bold">{title}</p>
                  <p className="mt-1 text-[11px] text-muted">{text}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Los pagos con tarjeta se procesan en la pasarela Wompi. Daniel
              Restrepo no almacena los datos de tu tarjeta. Recibes tu factura
              electrónica por correo.
            </p>
          </section>

          <section>
            <h2 className="display text-4xl">Preguntas frecuentes</h2>
            <div className="mt-4 divide-y divide-line border-y border-line">
              {faqs.map((faq) => (
                <details key={faq.question} className="group py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold">
                    {faq.question}
                    <ChevronDownIcon
                      size={16}
                      className="shrink-0 transition group-open:rotate-180"
                    />
                  </summary>
                  <p className="mt-3 text-xs leading-relaxed text-muted">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div id="contacto" className="scroll-mt-28 border border-line bg-ink p-6 text-paper">
            <p className="eyebrow text-volt">Contacto</p>
            <h2 className="display mt-2 text-3xl">Hablemos.</h2>
            <p className="mt-3 text-xs leading-relaxed text-paper/60">
              Lunes a viernes de 8:00 a 18:00. Sábados de 9:00 a 13:00.
            </p>
            <a
              href={`https://wa.me/${site.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="mt-5 flex items-center gap-2 border border-paper/20 px-3 py-3 text-xs transition hover:border-volt hover:text-volt"
            >
              <WhatsAppIcon size={17} />
              WhatsApp {site.phone}
            </a>
            <a
              href={`mailto:${site.email}`}
              className="mt-2 flex items-center gap-2 border border-paper/20 px-3 py-3 text-xs transition hover:border-volt hover:text-volt"
            >
              {site.email}
            </a>
            <Link
              href="/legal/cambios"
              className="mt-5 inline-flex items-center gap-1.5 text-[11px] text-paper/60 underline underline-offset-2 hover:text-paper"
            >
              Política de cambios completa
              <ArrowRightIcon size={13} />
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
