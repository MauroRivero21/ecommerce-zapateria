"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { mainNav, site } from "@/lib/config";
import { useCart } from "./cart-provider";
import {
  ArrowRightIcon,
  BagIcon,
  CloseIcon,
  MenuIcon,
  SearchIcon,
} from "./icons";

const popularSearches = ["Running", "Blanco", "Retro", "Oferta", "Talla 42"];

export function SiteHeader() {
  const { count, hydrated, openCart } = useCart();
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen && !searchOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen, searchOpen]);

  useEffect(() => {
    if (!searchOpen) return;
    const timer = window.setTimeout(() => searchInput.current?.focus(), 80);
    return () => window.clearTimeout(timer);
  }, [searchOpen]);

  const submitSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const term = query.trim();
    if (!term) return;
    setSearchOpen(false);
    router.push(`/buscar?q=${encodeURIComponent(term)}`);
  };

  return (
    <>
      <div className="bg-ink text-paper">
        <div className="container-x flex h-9 items-center justify-between text-[10px] font-medium tracking-[0.14em] uppercase">
          <p>Envío gratis desde ${site.freeShippingThreshold.toLocaleString("es-CO")} COP</p>
          <p className="hidden sm:block">Cambios gratis por 30 días · Pago seguro con Wompi</p>
          <Link href="/ayuda" className="hidden underline-offset-4 hover:underline md:block">
            Ayuda
          </Link>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur-md">
        <div className="container-x flex h-[76px] items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-full p-2 transition hover:bg-bone lg:hidden"
              onClick={() => setMenuOpen(true)}
              aria-label="Abrir menú"
            >
              <MenuIcon size={22} />
            </button>

            <Link href="/" className="group flex items-center gap-2.5" aria-label={`${site.name} inicio`}>
              <span className="flex h-10 w-10 items-center justify-center bg-ink text-paper transition group-hover:bg-volt group-hover:text-ink">
                <span className="display text-xl leading-none">DR</span>
              </span>
              <span className="leading-none">
                <span className="block text-[12px] font-black tracking-[0.14em] whitespace-nowrap uppercase sm:text-[15px] sm:tracking-[0.16em]">
                  Daniel Restrepo
                </span>
                <span className="mt-1 hidden text-[9px] font-semibold tracking-[0.3em] text-muted uppercase sm:block">
                  Sneakers · Colombia
                </span>
              </span>
            </Link>
          </div>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Navegación principal">
            {mainNav.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`link-underline text-[11px] font-bold tracking-[0.16em] uppercase transition hover:text-ink ${
                  item.label === "Ofertas" ? "text-danger" : "text-ink/80"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="rounded-full p-2.5 transition hover:bg-bone"
              aria-label="Buscar productos"
            >
              <SearchIcon size={20} />
            </button>
            <button
              type="button"
              onClick={openCart}
              className="relative rounded-full p-2.5 transition hover:bg-bone"
              aria-label={`Abrir carrito${hydrated && count > 0 ? `, ${count} artículos` : ""}`}
            >
              <BagIcon size={20} />
              {hydrated && count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-ink px-1 text-[9px] font-bold text-paper">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-[80] flex flex-col bg-ink text-paper">
          <div className="container-x flex h-[76px] items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5" onClick={() => setMenuOpen(false)}>
              <span className="flex h-10 w-10 items-center justify-center bg-volt text-ink">
                <span className="display text-xl leading-none">DR</span>
              </span>
              <span className="text-[15px] font-black tracking-[0.16em] uppercase">
                Daniel Restrepo
              </span>
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="rounded-full border border-paper/25 p-2 transition hover:border-volt hover:text-volt"
              aria-label="Cerrar menú"
            >
              <CloseIcon size={20} />
            </button>
          </div>

          <nav className="container-x flex flex-1 flex-col justify-center gap-1 py-8" aria-label="Menú móvil">
            {mainNav.map((item, index) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="group flex items-center justify-between border-b border-paper/15 py-4"
              >
                <span className="display text-[clamp(2.4rem,9vw,4rem)] transition group-hover:text-volt">
                  {item.label}
                </span>
                <span className="text-xs text-paper/40">0{index + 1}</span>
              </Link>
            ))}
          </nav>

          <div className="container-x grid grid-cols-2 gap-4 border-t border-paper/15 py-6 text-xs">
            <div>
              <p className="eyebrow text-paper/50">Atención</p>
              <p className="mt-2">{site.email}</p>
              <p className="mt-1">{site.phone}</p>
            </div>
            <div className="text-right">
              <p className="eyebrow text-paper/50">Síguenos</p>
              <p className="mt-2">Instagram</p>
              <p className="mt-1">TikTok</p>
            </div>
          </div>
        </div>
      )}

      {searchOpen && (
        <div className="fixed inset-0 z-[80] bg-paper">
          <div className="container-x flex h-[76px] items-center justify-between border-b border-line">
            <p className="eyebrow">Buscar en {site.name}</p>
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="rounded-full border border-line p-2 transition hover:border-ink"
              aria-label="Cerrar búsqueda"
            >
              <CloseIcon size={18} />
            </button>
          </div>
          <div className="container-x py-10 md:py-16">
            <form onSubmit={submitSearch} className="flex items-center gap-3 border-b-2 border-ink pb-3">
              <SearchIcon size={28} />
              <input
                ref={searchInput}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="¿Qué estás buscando?"
                className="w-full bg-transparent text-2xl font-semibold outline-none placeholder:text-muted/60 md:text-4xl"
                aria-label="Término de búsqueda"
              />
              <button type="submit" className="btn btn-primary hidden sm:inline-flex">
                Buscar
                <ArrowRightIcon size={16} />
              </button>
            </form>
            <div className="mt-8">
              <p className="eyebrow text-muted">Búsquedas populares</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => {
                      setSearchOpen(false);
                      router.push(`/buscar?q=${encodeURIComponent(term)}`);
                    }}
                    className="rounded-full border border-line px-4 py-2 text-sm transition hover:border-ink hover:bg-ink hover:text-paper"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
