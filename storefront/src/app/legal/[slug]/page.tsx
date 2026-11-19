import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { site } from "@/lib/config";

type LegalDocument = {
  title: string;
  intro: string;
  sections: { title: string; paragraphs: string[] }[];
};

const documents: Record<string, LegalDocument> = {
  terminos: {
    title: "Términos y condiciones",
    intro:
      "Estos términos regulan el uso del sitio web y la compra de productos de Daniel Restrepo. Al navegar o comprar aceptas estas condiciones.",
    sections: [
      {
        title: "1. Uso del sitio",
        paragraphs: [
          "El sitio es operado por Daniel Restrepo Sneakers S.A.S. y está destinado a personas mayores de edad que compren para uso personal o regalo, no para reventa.",
          "No está permitido usar el sitio para actividades fraudulentas, interferir con su funcionamiento o extraer información de forma automatizada sin autorización.",
        ],
      },
      {
        title: "2. Productos y precios",
        paragraphs: [
          "Las imágenes son ilustrativas. Los colores pueden variar ligeramente según la pantalla y el lote de producción.",
          "Todos los precios están expresados en pesos colombianos (COP) e incluyen IVA. Nos reservamos el derecho de corregir errores de digitación y de modificar precios sin afectar pedidos ya confirmados.",
        ],
      },
      {
        title: "3. Pedidos y pagos",
        paragraphs: [
          "Un pedido se considera confirmado cuando el pago es aprobado por la pasarela o cuando se registra un pedido contra entrega. Recibirás un correo con la confirmación y la referencia.",
          "Los pagos con tarjeta, PSE, Nequi y Bancolombia se procesan a través de Wompi. No almacenamos datos de tarjetas. La factura electrónica se emite conforme a la normativa de la DIAN.",
        ],
      },
      {
        title: "4. Envíos y entrega",
        paragraphs: [
          "Los tiempos de entrega son estimados y pueden variar por condiciones logísticas, clima o fuerza mayor. La transportadora es la responsable de la entrega una vez despachado el pedido.",
          "Si el pedido no puede entregarse por datos incorrectos o ausencia del destinatario, se intentará contactar al cliente. Un nuevo despacho puede generar costos adicionales.",
        ],
      },
      {
        title: "5. Propiedad intelectual",
        paragraphs: [
          "La marca, los diseños, las fotografías y los textos del sitio son propiedad de Daniel Restrepo Sneakers S.A.S. o de sus licenciantes. No pueden reproducirse sin autorización escrita.",
        ],
      },
      {
        title: "6. Ley aplicable",
        paragraphs: [
          "Estos términos se rigen por las leyes de la República de Colombia, en especial el Estatuto del Consumidor (Ley 1480 de 2011). Cualquier controversia se resolverá ante las autoridades competentes.",
        ],
      },
    ],
  },
  privacidad: {
    title: "Política de privacidad",
    intro:
      "En Daniel Restrepo tratamos tus datos personales con transparencia y solo para las finalidades necesarias. Esta política explica qué hacemos y cómo puedes ejercer tus derechos.",
    sections: [
      {
        title: "1. Responsable del tratamiento",
        paragraphs: [
          "Daniel Restrepo Sneakers S.A.S., identificada con NIT pendiente de asignación, con domicilio en Medellín, Colombia, es la responsable del tratamiento de los datos recolectados en este sitio.",
          `Puedes contactarnos en ${site.email} o en el teléfono ${site.phone}.`,
        ],
      },
      {
        title: "2. Datos que recopilamos",
        paragraphs: [
          "Recopilamos datos de identificación y contacto (nombre, correo, teléfono), dirección de envío, información del pedido y datos de navegación como páginas visitadas y dispositivo.",
          "No almacenamos datos completos de tarjetas. La información de pago es procesada directamente por la pasarela Wompi.",
        ],
      },
      {
        title: "3. Finalidades",
        paragraphs: [
          "Usamos los datos para procesar pedidos, gestionar envíos y cambios, atender solicitudes, emitir facturas, prevenir fraudes y enviar comunicaciones comerciales cuando hayas autorizado su envío.",
          "También podemos usar datos agregados y anónimos para mejorar la experiencia del sitio y medir campañas.",
        ],
      },
      {
        title: "4. Tus derechos",
        paragraphs: [
          "Como titular puedes conocer, actualizar, rectificar y suprimir tus datos, solicitar prueba de la autorización, revocar el consentimiento y presentar quejas ante la Superintendencia de Industria y Comercio.",
          "Para ejercer estos derechos escríbenos a nuestro correo de contacto con tu solicitud y documento de identidad. Responderemos en los plazos legales.",
        ],
      },
      {
        title: "5. Seguridad y conservación",
        paragraphs: [
          "Aplicamos medidas técnicas y administrativas razonables para proteger la información. Conservamos los datos mientras exista la relación comercial o durante los plazos exigidos por la ley.",
        ],
      },
      {
        title: "6. Cookies",
        paragraphs: [
          "Usamos cookies propias y de terceros para recordar tu carrito, analizar el tráfico y personalizar contenido. Puedes configurar tu navegador para rechazarlas; algunas funciones podrían dejar de operar.",
        ],
      },
    ],
  },
  datos: {
    title: "Autorización de tratamiento de datos",
    intro:
      "Al marcar la casilla de aceptación y finalizar una compra, autorizas a Daniel Restrepo Sneakers S.A.S. a tratar tus datos personales conforme a la Ley 1581 de 2012.",
    sections: [
      {
        title: "1. Alcance de la autorización",
        paragraphs: [
          "Autorizas el tratamiento de tus datos de identificación, contacto, dirección y pedido para las finalidades descritas en la política de privacidad.",
          "La autorización es previa, expresa e informada. Puedes revocarla en cualquier momento, salvo cuando exista un deber legal o contractual de conservar la información.",
        ],
      },
      {
        title: "2. Transferencias y encargados",
        paragraphs: [
          "Para operar el sitio compartimos datos con proveedores de hosting, pasarela de pagos, transporte y facturación electrónica, quienes actúan bajo obligaciones de confidencialidad.",
          "No vendemos ni cedemos tus datos a terceros para fines publicitarios ajenos a Daniel Restrepo.",
        ],
      },
      {
        title: "3. Canales de atención",
        paragraphs: [
          `Puedes ejercer tus derechos escribiendo a ${site.email} o al WhatsApp ${site.phone}. Incluye tu nombre completo, documento, correo y una descripción clara de la solicitud.`,
        ],
      },
      {
        title: "4. Vigencia",
        paragraphs: [
          "Esta autorización permanece vigente durante la relación comercial y el tiempo necesario para cumplir obligaciones legales. Después de ese plazo, tus datos serán eliminados o anonimizados.",
        ],
      },
    ],
  },
  cambios: {
    title: "Política de cambios y devoluciones",
    intro:
      "Queremos que tu par quede perfecto. Si la talla o el modelo no son lo que esperabas, tienes 30 días calendario para solicitar un cambio o devolución.",
    sections: [
      {
        title: "1. Plazo",
        paragraphs: [
          "El plazo corre desde la fecha de entrega registrada por la transportadora. Las solicitudes recibidas después de 30 días calendario no aplican para cambio, salvo garantía legal por defecto de fábrica.",
        ],
      },
      {
        title: "2. Condiciones",
        paragraphs: [
          "El producto debe estar sin uso, con la suela limpia, etiquetas y empaque original. No aceptamos cambios de productos usados, lavados o modificados.",
          "Por razones de higiene, los productos deben probarse sobre una superficie limpia y con medias.",
        ],
      },
      {
        title: "3. Procedimiento",
        paragraphs: [
          `Escríbenos a ${site.email} con tu número de pedido y el motivo. Te enviaremos una guía para recoger el producto o las instrucciones para enviarlo.`,
          "Una vez recibido y verificado el producto, despachamos el cambio o procesamos la devolución.",
        ],
      },
      {
        title: "4. Costos",
        paragraphs: [
          "El primer cambio de talla es gratis. Los cambios adicionales y las devoluciones por decisión del cliente pueden generar el costo del envío de retorno.",
          "Si el producto presenta un defecto de fábrica, asumimos todos los costos de transporte y te ofrecemos cambio o devolución del dinero.",
        ],
      },
      {
        title: "5. Reembolsos",
        paragraphs: [
          "Los reembolsos se realizan por el mismo medio de pago utilizado, dentro de los 15 días hábiles siguientes a la aprobación de la devolución. Los tiempos de abono dependen de la entidad financiera.",
        ],
      },
      {
        title: "6. Garantía legal",
        paragraphs: [
          "Además de esta política, tienes derecho a la garantía legal por defectos de calidad o idoneidad conforme al Estatuto del Consumidor. La garantía no cubre el desgaste normal por uso.",
        ],
      },
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(documents).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const document = documents[slug];
  if (!document) return { title: "Documento no encontrado" };

  return {
    title: document.title,
    description: document.intro,
  };
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const document = documents[slug];
  if (!document) notFound();

  return (
    <div className="container-x py-10 md:py-16">
      <nav className="mb-6 text-[11px] text-muted" aria-label="Migas de pan">
        <Link href="/" className="hover:text-ink">
          Inicio
        </Link>
        <span className="mx-2">/</span>
        <Link href="/ayuda" className="hover:text-ink">
          Legal
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{document.title}</span>
      </nav>

      <div className="max-w-3xl">
        <p className="eyebrow text-muted">Información legal</p>
        <h1 className="display mt-2 text-[clamp(2.6rem,6vw,4.8rem)]">
          {document.title}
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-muted">{document.intro}</p>
        <p className="mt-4 text-[11px] text-muted">
          Última actualización: enero de 2026 · {site.legalName}
        </p>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[240px_1fr] lg:gap-16">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <p className="eyebrow text-muted">Contenido</p>
          <nav className="mt-3 space-y-2 border-l border-line">
            {document.sections.map((section) => (
              <a
                key={section.title}
                href={`#${section.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                className="block border-l border-transparent pl-3 text-xs text-muted transition hover:border-ink hover:text-ink"
              >
                {section.title}
              </a>
            ))}
          </nav>
        </aside>

        <div className="max-w-2xl space-y-8">
          {document.sections.map((section) => (
            <section
              key={section.title}
              id={section.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}
              className="scroll-mt-28"
            >
              <h2 className="text-base font-bold">{section.title}</h2>
              <div className="mt-2 space-y-3 text-sm leading-relaxed text-muted">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}

          <div className="border-t border-line pt-6 text-xs text-muted">
            <p>
              ¿Tienes preguntas? Escríbenos a{" "}
              <a href={`mailto:${site.email}`} className="text-ink underline underline-offset-2">
                {site.email}
              </a>{" "}
              o visita el{" "}
              <Link href="/ayuda" className="text-ink underline underline-offset-2">
                centro de ayuda
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
