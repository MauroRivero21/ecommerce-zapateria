import Link from "next/link";
import { paymentMethods, site } from "@/lib/config";
import { InstagramIcon, TikTokIcon, WhatsAppIcon } from "./icons";
import { NewsletterForm } from "./newsletter-form";

const columns = [
  {
    title: "Tienda",
    links: [
      { label: "Hombre", href: "/tienda?genero=hombre" },
      { label: "Mujer", href: "/tienda?genero=mujer" },
      { label: "Running", href: "/tienda?categoria=running" },
      { label: "Lifestyle", href: "/tienda?categoria=lifestyle" },
      { label: "Ofertas", href: "/tienda?oferta=1" },
    ],
  },
  {
    title: "Ayuda",
    links: [
      { label: "Envíos", href: "/ayuda#envios" },
      { label: "Cambios y devoluciones", href: "/ayuda#cambios" },
      { label: "Guía de tallas", href: "/ayuda#tallas" },
      { label: "Métodos de pago", href: "/ayuda#pagos" },
      { label: "Contacto", href: "/ayuda#contacto" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Términos y condiciones", href: "/legal/terminos" },
      { label: "Política de privacidad", href: "/legal/privacidad" },
      { label: "Tratamiento de datos", href: "/legal/datos" },
      { label: "Política de cambios", href: "/legal/cambios" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="bg-ink text-paper">
      <div className="container-x border-b border-paper/15 py-14 md:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <div>
            <p className="eyebrow text-volt">Newsletter</p>
            <h2 className="display mt-3 text-[clamp(2.6rem,6vw,5.5rem)]">
              No te detengas<span className="text-volt">.</span>
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-paper/60">
              Drops, lanzamientos y entrenamientos. Sin ruido, solo lo que vale
              la pena.
            </p>
          </div>
          <div className="lg:pb-2">
            <NewsletterForm dark />
          </div>
        </div>
      </div>

      <div className="container-x grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Link href="/" className="flex items-center gap-2.5" aria-label={`${site.name} inicio`}>
            <span className="flex h-11 w-11 items-center justify-center bg-volt text-ink">
              <span className="display text-xl leading-none">DR</span>
            </span>
            <span className="text-[15px] font-black tracking-[0.16em] uppercase">
              Daniel Restrepo
            </span>
          </Link>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-paper/55">
            Sneakers para running, training y calle. Diseñados en Colombia,
            hechos para moverse sin excusas.
          </p>
          <div className="mt-6 flex items-center gap-2">
            <a
              href={site.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-paper/20 transition hover:border-volt hover:text-volt"
            >
              <InstagramIcon size={16} />
            </a>
            <a
              href={site.tiktok}
              target="_blank"
              rel="noreferrer"
              aria-label="TikTok"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-paper/20 transition hover:border-volt hover:text-volt"
            >
              <TikTokIcon size={16} />
            </a>
            <a
              href={`https://wa.me/${site.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-paper/20 transition hover:border-volt hover:text-volt"
            >
              <WhatsAppIcon size={16} />
            </a>
          </div>
        </div>

        {columns.map((column) => (
          <div key={column.title}>
            <h3 className="eyebrow text-paper/45">{column.title}</h3>
            <ul className="mt-4 space-y-2.5">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-paper/75 transition hover:text-volt"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="container-x flex flex-col gap-5 border-t border-paper/15 py-6 md:flex-row md:items-center md:justify-between">
        <p className="text-[11px] text-paper/40">
          © {new Date().getFullYear()} {site.legalName}. Todos los derechos reservados.
        </p>
        <div className="flex flex-wrap items-center gap-1.5">
          {paymentMethods.map((method) => (
            <span
              key={method}
              className="rounded border border-paper/20 px-2 py-1 text-[9px] font-semibold tracking-wide text-paper/60 uppercase"
            >
              {method}
            </span>
          ))}
        </div>
        <p className="text-[11px] text-paper/40">Hecho en Colombia 🇨🇴</p>
      </div>
    </footer>
  );
}
