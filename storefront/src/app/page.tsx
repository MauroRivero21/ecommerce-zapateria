import Image from "next/image";
import Link from "next/link";
import { ProductGrid } from "@/components/product-grid";
import { SectionHeading } from "@/components/section-heading";
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  CardIcon,
  ReturnIcon,
  ShieldIcon,
  SparkIcon,
  TruckIcon,
} from "@/components/icons";
import { site } from "@/lib/config";
import { featuredProducts, newArrivals } from "@/lib/products";

const categories = [
  {
    name: "Running",
    description: "Amortiguación para cada kilómetro",
    image: "/products/cat-running.jpg",
    href: "/tienda?categoria=running",
  },
  {
    name: "Lifestyle",
    description: "Del entrenamiento a la calle",
    image: "/products/cat-lifestyle.jpg",
    href: "/tienda?categoria=lifestyle",
  },
  {
    name: "Training",
    description: "Estabilidad para levantar más",
    image: "/products/cat-training.jpg",
    href: "/tienda?categoria=training",
  },
];

const benefits = [
  {
    icon: TruckIcon,
    title: "Envío gratis",
    text: `En compras desde $${new Intl.NumberFormat("es-CO").format(site.freeShippingThreshold)} COP.`,
  },
  {
    icon: ReturnIcon,
    title: "Cambios gratis",
    text: "Tienes 30 días para encontrar tu talla perfecta.",
  },
  {
    icon: ShieldIcon,
    title: "Pago seguro",
    text: "Tarjetas, PSE, Nequi y Bancolombia con Wompi.",
  },
  {
    icon: CardIcon,
    title: "Cuotas sin enredos",
    text: "Paga a tu ritmo con las cuotas de tu banco.",
  },
];

const marqueeWords = ["Run", "Train", "Street", "Comfort", "Movement"];

export default function HomePage() {
  return (
    <>
      <section className="relative flex min-h-[calc(100svh-112px)] flex-col overflow-hidden bg-ink text-paper">
        <Image
          src="/products/hero.jpg"
          alt="Corredores entrenando al atardecer"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/60 via-transparent to-transparent" />

        <div className="container-x relative mt-auto flex flex-col pb-8 pt-28">
          <div className="max-w-5xl animate-fade-up">
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-volt" />
              <p className="eyebrow text-volt">Drop 01 · SS26</p>
            </div>
            <h1 className="display mt-5 text-[clamp(4.2rem,13vw,12rem)]">
              Hecho para
              <br />
              <span className="text-volt">moverse</span>
            </h1>
            <div className="mt-7 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <p className="max-w-sm text-sm leading-relaxed text-paper/75">
                Running, training y calle. Una colección construida para
                acompañarte cuando las excusas se acaban.
              </p>
              <div className="flex flex-wrap gap-2.5">
                <Link href="/tienda?genero=hombre" className="btn btn-volt">
                  Comprar hombre
                  <ArrowRightIcon size={16} />
                </Link>
                <Link
                  href="/tienda?genero=mujer"
                  className="btn border border-paper/40 text-paper hover:border-paper hover:bg-paper hover:text-ink"
                >
                  Comprar mujer
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-paper/20 pt-5">
            <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-[10px] font-semibold tracking-[0.16em] text-paper/60 uppercase">
              <span>Envío gratis desde $250.000</span>
              <span>Cambios en 30 días</span>
              <span>Pago 100% seguro</span>
            </div>
            <p className="flex items-center gap-2 text-[10px] tracking-[0.18em] text-paper/50 uppercase">
              <SparkIcon size={13} className="text-volt" />
              Nueva colección 2026
            </p>
          </div>
        </div>
      </section>

      <div className="overflow-hidden border-y border-ink bg-volt py-3.5 text-ink">
        <div className="flex w-max animate-marquee items-center">
          {[...marqueeWords, ...marqueeWords, ...marqueeWords, ...marqueeWords].map(
            (word, index) => (
              <span
                key={`${word}-${index}`}
                className="flex items-center gap-8 pr-8 text-sm font-black tracking-[0.18em] uppercase"
              >
                {word}
                <span className="text-base leading-none">✦</span>
              </span>
            ),
          )}
        </div>
      </div>

      <section className="container-x py-16 md:py-24">
        <SectionHeading
          eyebrow="Encuentra tu terreno"
          title="Elige cómo te mueves"
          href="/tienda"
          linkLabel="Ver catálogo"
        />
        <div className="grid gap-3 md:grid-cols-3 md:gap-5">
          {categories.map((category, index) => (
            <Link
              key={category.name}
              href={category.href}
              className="group relative aspect-[4/5] overflow-hidden bg-bone"
            >
              <Image
                src={category.image}
                alt={category.name}
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                className="object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 text-paper md:p-6">
                <div>
                  <p className="text-[10px] font-semibold tracking-[0.2em] text-paper/60 uppercase">
                    0{index + 1}
                  </p>
                  <h3 className="display mt-1 text-4xl md:text-5xl">{category.name}</h3>
                  <p className="mt-1 text-xs text-paper/70">{category.description}</p>
                </div>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-paper/40 transition group-hover:border-volt group-hover:bg-volt group-hover:text-ink">
                  <ArrowUpRightIcon size={17} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-x pb-16 md:pb-24">
        <SectionHeading
          eyebrow="Los favoritos"
          title="Lo más buscado"
          href="/tienda"
          linkLabel="Ver todos"
        />
        <ProductGrid products={featuredProducts.slice(0, 8)} priorityCount={4} />
      </section>

      <section className="bg-ink text-paper">
        <div className="grid lg:grid-cols-2">
          <div className="relative min-h-[380px] overflow-hidden lg:min-h-[640px]">
            <Image
              src="/products/campaign.jpg"
              alt="Corredora subiendo escaleras"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent lg:bg-gradient-to-r" />
            <div className="absolute bottom-5 left-5 bg-volt px-3 py-2 text-[10px] font-bold tracking-[0.16em] text-ink uppercase">
              DR Run Club · 2026
            </div>
          </div>
          <div className="flex flex-col justify-center px-5 py-14 md:px-12 lg:px-16 lg:py-20">
            <p className="eyebrow text-volt">Más que zapatillas</p>
            <h2 className="display mt-4 text-[clamp(2.8rem,5.5vw,5rem)]">
              Kilómetros
              <br />
              que se sienten<span className="text-volt">.</span>
            </h2>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-paper/65">
              Diseñamos cada par pensando en el movimiento real: el sprint final,
              la vuelta a la manzana y el día que decides no quedarte quieto.
              Únete al Run Club y entrena con nosotros.
            </p>
            <div className="mt-8 flex flex-wrap gap-2.5">
              <Link href="/tienda?categoria=running" className="btn btn-volt">
                Explorar running
                <ArrowRightIcon size={16} />
              </Link>
              <Link
                href="/ayuda#contacto"
                className="btn border border-paper/35 text-paper hover:border-paper hover:bg-paper hover:text-ink"
              >
                Conocer el club
              </Link>
            </div>
            <div className="mt-12 grid grid-cols-3 gap-4 border-t border-paper/15 pt-6">
              {[
                ["+12K", "Pares vendidos"],
                ["4.8/5", "Calificación"],
                ["30 días", "Para cambios"],
              ].map(([value, label]) => (
                <div key={label}>
                  <p className="display text-3xl text-volt md:text-4xl">{value}</p>
                  <p className="mt-1 text-[10px] tracking-[0.12em] text-paper/50 uppercase">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container-x py-16 md:py-24">
        <SectionHeading
          eyebrow="Recién llegados"
          title="El nuevo drop"
          href="/tienda?nuevo=1"
          linkLabel="Ver novedades"
        />
        <ProductGrid products={newArrivals} />
      </section>

      <section className="border-y border-line bg-bone/60">
        <div className="container-x grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="flex gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-paper">
                <benefit.icon size={21} />
              </span>
              <div>
                <h3 className="text-xs font-bold tracking-[0.1em] uppercase">
                  {benefit.title}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-muted">
                  {benefit.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container-x py-16 text-center md:py-24">
        <p className="eyebrow text-muted">Diseñados en Colombia</p>
        <p className="display mx-auto mt-4 max-w-5xl text-[clamp(2.6rem,7vw,6.5rem)]">
          Para la calle. Para el run. <span className="text-muted/50">Para ti.</span>
        </p>
        <Link href="/tienda" className="btn btn-primary mt-8">
          Encuentra tu par
          <ArrowRightIcon size={16} />
        </Link>
      </section>
    </>
  );
}
