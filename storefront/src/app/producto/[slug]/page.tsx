import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ProductDetail } from "@/components/product-detail";
import { ProductGrid } from "@/components/product-grid";
import { SectionHeading } from "@/components/section-heading";
import { ArrowRightIcon } from "@/components/icons";
import { site } from "@/lib/config";
import {
  getProductBySlug,
  products,
  relatedProducts,
} from "@/lib/products";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Producto no encontrado" };

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: `${product.name} | Daniel Restrepo`,
      description: product.description,
      images: [{ url: product.images[0], width: 1200, height: 1200 }],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = relatedProducts(product);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images.map((image) => `${site.url}${image}`),
    description: product.description,
    sku: product.id,
    brand: { "@type": "Brand", name: "Daniel Restrepo" },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviews,
    },
    offers: {
      "@type": "Offer",
      url: `${site.url}/producto/${product.slug}`,
      priceCurrency: "COP",
      price: product.price,
      availability: product.sizes.some((size) => size.stock > 0)
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: "Daniel Restrepo" },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetail product={product} />

      <section className="container-x pb-16 md:pb-24">
        <SectionHeading
          eyebrow="Completa el look"
          title="También te puede gustar"
          href="/tienda"
          linkLabel="Ver tienda"
        />
        <ProductGrid products={related} />
        <div className="mt-10 flex justify-center">
          <Link href="/tienda" className="btn btn-outline">
            Seguir explorando
            <ArrowRightIcon size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
