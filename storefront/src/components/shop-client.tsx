"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { categoryLabels, genderLabels } from "@/lib/config";
import { formatCOP } from "@/lib/format";
import {
  allColors,
  allSizes,
  products,
} from "@/lib/products";
import type { Category, Gender } from "@/lib/types";
import { CheckIcon, CloseIcon, FilterIcon } from "./icons";
import { ProductCard } from "./product-card";

type SortOption = "destacados" | "precio-asc" | "precio-desc" | "calificacion" | "nuevos";

const sortLabels: Record<SortOption, string> = {
  destacados: "Destacados",
  "precio-asc": "Precio: menor a mayor",
  "precio-desc": "Precio: mayor a menor",
  calificacion: "Mejor calificados",
  nuevos: "Novedades",
};

const MIN_PRICE = 250_000;
const MAX_PRICE = 550_000;

export function ShopClient({
  initialCategory,
  initialGender,
  initialQuery = "",
  initialOffer = false,
  initialNew = false,
}: {
  initialCategory?: Category;
  initialGender?: Gender;
  initialQuery?: string;
  initialOffer?: boolean;
  initialNew?: boolean;
}) {
  const [categories, setCategories] = useState<Category[]>(
    initialCategory ? [initialCategory] : [],
  );
  const [genders, setGenders] = useState<Gender[]>(
    initialGender ? [initialGender] : [],
  );
  const [sizes, setSizes] = useState<number[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);
  const [onlyOffers, setOnlyOffers] = useState(initialOffer);
  const [onlyNew, setOnlyNew] = useState(initialNew);
  const [sort, setSort] = useState<SortOption>(initialNew ? "nuevos" : "destacados");
  const [mobileFilters, setMobileFilters] = useState(false);

  useEffect(() => {
    if (!mobileFilters) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileFilters]);

  const toggle = <T,>(value: T, list: T[], setList: (next: T[]) => void) => {
    setList(list.includes(value) ? list.filter((item) => item !== value) : [...list, value]);
  };

  const filtered = useMemo(() => {
    const term = initialQuery.trim().toLowerCase();

    const result = products.filter((product) => {
      if (categories.length > 0 && !categories.includes(product.category)) return false;

      if (genders.length > 0) {
        const matchesGender =
          genders.includes(product.gender) ||
          (product.gender === "unisex" &&
            (genders.includes("hombre") || genders.includes("mujer")));
        if (!matchesGender) return false;
      }

      if (
        sizes.length > 0 &&
        !product.sizes.some((size) => size.stock > 0 && sizes.includes(size.size))
      ) {
        return false;
      }

      if (
        colors.length > 0 &&
        !product.colors.some((color) => colors.includes(color.name))
      ) {
        return false;
      }

      if (product.price > maxPrice) return false;
      if (onlyOffers && !product.compareAt) return false;
      if (onlyNew && !product.isNew) return false;

      if (term) {
        const haystack = [
          product.name,
          product.subtitle,
          product.description,
          categoryLabels[product.category],
          genderLabels[product.gender],
          ...product.colors.map((color) => color.name),
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(term)) return false;
      }

      return true;
    });

    return result.sort((a, b) => {
      switch (sort) {
        case "precio-asc":
          return a.price - b.price;
        case "precio-desc":
          return b.price - a.price;
        case "calificacion":
          return b.rating - a.rating;
        case "nuevos":
          return Number(Boolean(b.isNew)) - Number(Boolean(a.isNew));
        default:
          return Number(Boolean(b.isFeatured)) - Number(Boolean(a.isFeatured));
      }
    });
  }, [
    categories,
    genders,
    sizes,
    colors,
    maxPrice,
    onlyOffers,
    onlyNew,
    sort,
    initialQuery,
  ]);

  const activeCount =
    categories.length +
    genders.length +
    sizes.length +
    colors.length +
    (maxPrice < MAX_PRICE ? 1 : 0) +
    (onlyOffers ? 1 : 0) +
    (onlyNew ? 1 : 0);

  const clearAll = () => {
    setCategories([]);
    setGenders([]);
    setSizes([]);
    setColors([]);
    setMaxPrice(MAX_PRICE);
    setOnlyOffers(false);
    setOnlyNew(false);
  };

  const heading = initialQuery
    ? `“${initialQuery}”`
    : onlyOffers
      ? "Ofertas"
      : onlyNew
        ? "Novedades"
        : categories.length === 1
          ? categoryLabels[categories[0]]
          : genders.length === 1
            ? genderLabels[genders[0]]
            : "La colección";

  const filters = (
    <div className="space-y-7">
      <FilterGroup title="Categoría">
        {(Object.keys(categoryLabels) as Category[]).map((category) => (
          <FilterRow
            key={category}
            label={categoryLabels[category]}
            active={categories.includes(category)}
            onClick={() => toggle(category, categories, setCategories)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Género">
        {(Object.keys(genderLabels) as Gender[]).map((gender) => (
          <FilterRow
            key={gender}
            label={genderLabels[gender]}
            active={genders.includes(gender)}
            onClick={() => toggle(gender, genders, setGenders)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Talla">
        <div className="grid grid-cols-5 gap-1.5">
          {allSizes.map((size) => {
            const active = sizes.includes(size);
            return (
              <button
                key={size}
                type="button"
                onClick={() => toggle(size, sizes, setSizes)}
                className={`border py-2 text-xs font-semibold transition ${
                  active
                    ? "border-ink bg-ink text-paper"
                    : "border-line hover:border-ink"
                }`}
                aria-pressed={active}
              >
                {size}
              </button>
            );
          })}
        </div>
      </FilterGroup>

      <FilterGroup title="Color">
        <div className="flex flex-wrap gap-2">
          {allColors.map((color) => {
            const active = colors.includes(color.name);
            return (
              <button
                key={color.name}
                type="button"
                onClick={() => toggle(color.name, colors, setColors)}
                className={`flex items-center gap-2 border px-2.5 py-1.5 text-[11px] transition ${
                  active ? "border-ink bg-ink text-paper" : "border-line hover:border-ink"
                }`}
                aria-pressed={active}
              >
                <span
                  className="h-3 w-3 rounded-full border border-ink/20"
                  style={{ backgroundColor: color.hex }}
                />
                {color.name}
              </button>
            );
          })}
        </div>
      </FilterGroup>

      <FilterGroup title="Precio">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted">Hasta</span>
          <span className="font-bold">{formatCOP(maxPrice)}</span>
        </div>
        <input
          type="range"
          min={MIN_PRICE}
          max={MAX_PRICE}
          step={10_000}
          value={maxPrice}
          onChange={(event) => setMaxPrice(Number(event.target.value))}
          className="mt-3 w-full accent-ink"
          aria-label="Precio máximo"
        />
      </FilterGroup>

      <FilterGroup title="Colecciones">
        <FilterRow
          label="Solo ofertas"
          active={onlyOffers}
          onClick={() => setOnlyOffers((value) => !value)}
        />
        <FilterRow
          label="Recién llegados"
          active={onlyNew}
          onClick={() => setOnlyNew((value) => !value)}
        />
      </FilterGroup>

      {activeCount > 0 && (
        <button
          type="button"
          onClick={clearAll}
          className="text-xs font-bold tracking-[0.1em] text-danger uppercase underline-offset-4 hover:underline"
        >
          Limpiar filtros ({activeCount})
        </button>
      )}
    </div>
  );

  return (
    <div className="container-x py-8 md:py-12">
      <nav className="mb-6 text-[11px] text-muted" aria-label="Migas de pan">
        <Link href="/" className="hover:text-ink">
          Inicio
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">Tienda</span>
        {categories.length === 1 && (
          <>
            <span className="mx-2">/</span>
            <span className="text-ink">{categoryLabels[categories[0]]}</span>
          </>
        )}
      </nav>

      <div className="flex flex-col gap-4 border-b border-line pb-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow text-muted">Daniel Restrepo · SS26</p>
          <h1 className="display mt-2 text-[clamp(2.8rem,6vw,5rem)]">{heading}</h1>
          <p className="mt-2 text-sm text-muted">
            {filtered.length} {filtered.length === 1 ? "par encontrado" : "pares encontrados"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileFilters(true)}
            className="btn btn-outline gap-2 px-4 py-3 lg:hidden"
          >
            <FilterIcon size={17} />
            Filtros
            {activeCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-ink px-1 text-[10px] text-paper">
                {activeCount}
              </span>
            )}
          </button>
          <label className="sr-only" htmlFor="sort">
            Ordenar productos
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(event) => setSort(event.target.value as SortOption)}
            className="field w-auto min-w-[190px] cursor-pointer bg-paper py-2.5 text-xs"
          >
            {(Object.keys(sortLabels) as SortOption[]).map((option) => (
              <option key={option} value={option}>
                {sortLabels[option]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[220px_1fr] lg:gap-10">
        <aside className="hidden lg:block">
          <div className="sticky top-28">{filters}</div>
        </aside>

        <div>
          {activeCount > 0 && (
            <div className="mb-6 flex flex-wrap items-center gap-2">
              {categories.map((category) => (
                <ActiveChip
                  key={category}
                  label={categoryLabels[category]}
                  onRemove={() => toggle(category, categories, setCategories)}
                />
              ))}
              {genders.map((gender) => (
                <ActiveChip
                  key={gender}
                  label={genderLabels[gender]}
                  onRemove={() => toggle(gender, genders, setGenders)}
                />
              ))}
              {sizes.map((size) => (
                <ActiveChip
                  key={size}
                  label={`Talla ${size}`}
                  onRemove={() => toggle(size, sizes, setSizes)}
                />
              ))}
              {colors.map((color) => (
                <ActiveChip
                  key={color}
                  label={color}
                  onRemove={() => toggle(color, colors, setColors)}
                />
              ))}
              {onlyOffers && (
                <ActiveChip label="Ofertas" onRemove={() => setOnlyOffers(false)} />
              )}
              {onlyNew && (
                <ActiveChip label="Novedades" onRemove={() => setOnlyNew(false)} />
              )}
              <button
                type="button"
                onClick={clearAll}
                className="ml-1 text-[11px] text-muted underline underline-offset-2 hover:text-ink"
              >
                Limpiar todo
              </button>
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="flex min-h-[380px] flex-col items-center justify-center border border-dashed border-line px-6 text-center">
              <p className="display text-4xl">Sin resultados</p>
              <p className="mt-2 max-w-sm text-sm text-muted">
                No encontramos pares con esos filtros. Prueba con otra talla, color
                o limpia la búsqueda.
              </p>
              <button type="button" onClick={clearAll} className="btn btn-primary mt-6">
                Limpiar filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-3 gap-y-9 md:grid-cols-3 md:gap-x-5">
              {filtered.map((product, index) => (
                <ProductCard key={product.id} product={product} priority={index < 3} />
              ))}
            </div>
          )}
        </div>
      </div>

      {mobileFilters && (
        <div className="fixed inset-0 z-[75] flex flex-col bg-paper lg:hidden">
          <div className="flex items-center justify-between border-b border-line px-5 py-5">
            <div>
              <p className="eyebrow text-muted">Refinar</p>
              <p className="mt-1 text-lg font-bold">Filtros</p>
            </div>
            <button
              type="button"
              onClick={() => setMobileFilters(false)}
              className="rounded-full border border-line p-2"
              aria-label="Cerrar filtros"
            >
              <CloseIcon size={18} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-6">{filters}</div>
          <div className="border-t border-line p-4">
            <button
              type="button"
              onClick={() => setMobileFilters(false)}
              className="btn btn-primary w-full"
            >
              Ver {filtered.length} resultados
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="eyebrow mb-2 text-muted">{title}</h2>
      {children}
    </div>
  );
}

function FilterRow({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex w-full items-center justify-between border-b border-line py-2.5 text-left text-sm transition ${
        active ? "font-semibold" : "text-ink/75 hover:text-ink"
      }`}
    >
      {label}
      <span
        className={`flex h-4 w-4 items-center justify-center border transition ${
          active ? "border-ink bg-ink text-paper" : "border-line"
        }`}
      >
        {active && <CheckIcon size={10} />}
      </span>
    </button>
  );
}

function ActiveChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="flex items-center gap-1.5 rounded-full border border-ink bg-ink px-3 py-1.5 text-[10px] font-semibold tracking-wide text-paper uppercase">
      {label}
      <button type="button" onClick={onRemove} aria-label={`Quitar filtro ${label}`}>
        <CloseIcon size={12} />
      </button>
    </span>
  );
}
