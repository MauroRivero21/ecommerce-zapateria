"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { categoryLabels, genderLabels } from "@/lib/config";
import { products } from "@/lib/products";
import { ArrowRightIcon, SearchIcon } from "./icons";
import { ProductGrid } from "./product-grid";

const suggestions = ["Running", "Blanco", "Retro", "Oferta", "Talla 42"];

export function SearchClient({ initialQuery }: { initialQuery: string }) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);

  const results = useMemo(() => {
    const term = initialQuery.trim().toLowerCase();
    if (!term) return [];

    return products.filter((product) => {
      const haystack = [
        product.name,
        product.subtitle,
        product.description,
        categoryLabels[product.category],
        genderLabels[product.gender],
        ...product.colors.map((color) => color.name),
        ...product.sizes.map((size) => `talla ${size.size}`),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(term);
    });
  }, [initialQuery]);

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const term = query.trim();
    if (!term) return;
    router.push(`/buscar?q=${encodeURIComponent(term)}`);
  };

  return (
    <div className="container-x py-10 md:py-16">
      <nav className="mb-6 text-[11px] text-muted" aria-label="Migas de pan">
        <Link href="/" className="hover:text-ink">
          Inicio
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">Buscar</span>
      </nav>

      <p className="eyebrow text-muted">Encuentra tu par</p>
      <h1 className="display mt-2 text-[clamp(2.8rem,7vw,5.5rem)]">Buscar</h1>

      <form onSubmit={submit} className="mt-7 flex max-w-3xl items-center gap-3 border-b-2 border-ink pb-3">
        <SearchIcon size={24} />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Nombre, categoría, color..."
          aria-label="Buscar productos"
          className="w-full bg-transparent text-lg font-semibold outline-none placeholder:text-muted/60 md:text-2xl"
        />
        <button type="submit" className="btn btn-primary shrink-0">
          Buscar
          <ArrowRightIcon size={15} />
        </button>
      </form>

      {!initialQuery && (
        <div className="mt-10">
          <p className="eyebrow text-muted">Prueba con</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => {
                  setQuery(suggestion);
                  router.push(`/buscar?q=${encodeURIComponent(suggestion)}`);
                }}
                className="rounded-full border border-line px-4 py-2 text-sm transition hover:border-ink hover:bg-ink hover:text-paper"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {initialQuery && (
        <div className="mt-10">
          <div className="flex flex-wrap items-end justify-between gap-3 border-b border-line pb-4">
            <p className="text-sm text-muted">
              {results.length} {results.length === 1 ? "resultado" : "resultados"}{" "}
              para <strong className="text-ink">“{initialQuery}”</strong>
            </p>
            <Link
              href="/tienda"
              className="text-[11px] font-bold tracking-[0.1em] uppercase underline-offset-4 hover:underline"
            >
              Ver toda la tienda
            </Link>
          </div>

          {results.length > 0 ? (
            <div className="mt-7">
              <ProductGrid products={results} priorityCount={4} />
            </div>
          ) : (
            <div className="mt-7 flex min-h-[320px] flex-col items-center justify-center border border-dashed border-line px-6 text-center">
              <p className="display text-4xl">Nada por aquí</p>
              <p className="mt-2 max-w-sm text-sm text-muted">
                No encontramos productos para “{initialQuery}”. Prueba con otra
                palabra o explora la colección completa.
              </p>
              <Link href="/tienda" className="btn btn-primary mt-6">
                Explorar tienda
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
