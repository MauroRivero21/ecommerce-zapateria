import type { Metadata } from "next";
import { ShopClient } from "@/components/shop-client";
import { categoryLabels, genderLabels } from "@/lib/config";
import type { Category, Gender } from "@/lib/types";

export const metadata: Metadata = {
  title: "Tienda",
  description:
    "Explora toda la colección de sneakers Daniel Restrepo: running, training y lifestyle. Filtra por talla, color y género.",
};

type SearchParams = {
  categoria?: string;
  genero?: string;
  q?: string;
  oferta?: string;
  nuevo?: string;
};

export default async function TiendaPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const category = params.categoria as Category | undefined;
  const gender = params.genero as Gender | undefined;

  return (
    <ShopClient
      key={`${category ?? ""}-${gender ?? ""}-${params.q ?? ""}-${params.oferta ?? ""}-${params.nuevo ?? ""}`}
      initialCategory={category && category in categoryLabels ? category : undefined}
      initialGender={gender && gender in genderLabels ? gender : undefined}
      initialQuery={params.q ?? ""}
      initialOffer={params.oferta === "1"}
      initialNew={params.nuevo === "1"}
    />
  );
}
