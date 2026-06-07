import { Metadata } from "next";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { generateProductMetadata, generateProductSchema, siteConfig, generateBreadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/seo";
import ProductPageClient from "./ProductPageClient";

// API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

// Fetch product data for metadata generation
async function getProduct(slug: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/shop/products/${slug}`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data;
  } catch {
    return null;
  }
}

// Generate dynamic metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id: slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return {
      title: "Proizvod nije pronađen | Maksuz",
      description: "Traženi proizvod nije pronađen u našoj ponudi.",
      robots: { index: false, follow: false },
    };
  }

  // Get short description
  const shortDescription = product.shortDescription || product.description;
  const cleanDescription = shortDescription
    ? shortDescription.replace(/<[^>]*>/g, "").substring(0, 160)
    : `Kupite ${product.name} na Maksuz webshopu. Prirodni proizvodi iz Bosne i Hercegovine.`;

  // Get primary image
  const primaryImage = product.images?.[0]?.url || `${siteConfig.url}/productimage.png`;

  return generateProductMetadata({
    name: product.name,
    description: cleanDescription,
    slug: product.slug,
    image: primaryImage,
    price: product.price,
    currency: "BAM",
    inStock: product.inStock,
  });
}

// Loading component
function ProductPageLoading() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-brand-orange" />
    </div>
  );
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: slug } = await params;
  const product = await getProduct(slug);

  // Generate JSON-LD structured data
  const productSchema = product
    ? generateProductSchema({
        name: product.name,
        description: product.shortDescription || product.description || "",
        slug: product.slug,
        image: product.images?.[0]?.url,
        price: product.price,
        currency: "BAM",
        inStock: product.inStock,
        sku: product.sku || product.slug,
        brand: "Maksuz",
      })
    : null;

  // Generate breadcrumb schema
  const breadcrumbSchema = product
    ? generateBreadcrumbSchema([
        { name: "Početna", url: "/" },
        { name: "Shop", url: "/shop" },
        { name: "Proizvodi", url: "/shop/products" },
        { name: product.name, url: `/shop/product/${product.slug}` },
      ])
    : null;

  return (
    <>
      {/* Structured Data */}
      {productSchema && <JsonLd data={productSchema} />}
      {breadcrumbSchema && <JsonLd data={breadcrumbSchema} />}
      
      <Suspense fallback={<ProductPageLoading />}>
        <ProductPageClient />
      </Suspense>
    </>
  );
}
