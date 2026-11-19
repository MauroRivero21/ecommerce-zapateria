import type { Metadata } from "next";
import { SearchClient } from "@/components/search-client";

export const metadata: Metadata = {
  title: "Buscar",
  description: "Busca tus próximos sneakers por nombre, categoría, color o talla.",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const query = params.q ?? "";

  return <SearchClient key={query} initialQuery={query} />;
}
