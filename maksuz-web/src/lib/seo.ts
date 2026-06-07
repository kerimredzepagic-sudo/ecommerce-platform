import { Metadata } from "next";

// ============================================
// Site Configuration
// ============================================

export const siteConfig = {
  name: "Maksuz",
  tagline: "Prirodni Proizvodi",
  description:
    "Maksuz - Porodični proizvođači prirodnih delicija iz srca Bosne i Hercegovine. Med, pekmezi, sokovi, namazi i premium poklon paketi.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://maksuz.ba",
  ogImage: "/og-image.png",
  locale: "bs_BA",
  language: "bs",
  twitter: "@maksuzba",
  email: "info@maksuz.ba",
  phone: "+387 61 399 366",
  address: {
    street: "Hamdije Čemerlića 49",
    city: "Sarajevo",
    postalCode: "71000",
    country: "Bosna i Hercegovina",
  },
};

// ============================================
// Metadata Helpers
// ============================================

type MetadataParams = {
  title: string;
  description: string;
  path?: string;
  ogImage?: string;
  noIndex?: boolean;
  keywords?: string[];
};

/**
 * Generate metadata for a page with all necessary SEO fields
 */
export function generatePageMetadata({
  title,
  description,
  path = "",
  ogImage,
  noIndex = false,
  keywords = [],
}: MetadataParams): Metadata {
  const fullTitle = `${title} | ${siteConfig.name} - ${siteConfig.tagline}`;
  const url = `${siteConfig.url}${path}`;
  const image = ogImage || siteConfig.ogImage;
  const imageUrl = image.startsWith("http") ? image : `${siteConfig.url}${image}`;

  return {
    title: fullTitle,
    description,
    keywords: [
      "maksuz",
      "prirodni proizvodi",
      "med",
      "bosna",
      "hercegovina",
      "pekmez",
      "sokovi",
      "zdravlje",
      ...keywords,
    ],
    authors: [{ name: siteConfig.name }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      url,
      title: fullTitle,
      description,
      siteName: siteConfig.name,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [imageUrl],
      creator: siteConfig.twitter,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

/**
 * Generate metadata for product pages
 */
export function generateProductMetadata({
  name,
  description,
  slug,
  image,
  price,
  currency = "BAM",
  inStock = true,
}: {
  name: string;
  description: string;
  slug: string;
  image?: string;
  price?: number;
  currency?: string;
  inStock?: boolean;
}): Metadata {
  const shortDescription =
    description.length > 160
      ? description.substring(0, 157) + "..."
      : description;

  return generatePageMetadata({
    title: name,
    description: shortDescription,
    path: `/shop/product/${slug}`,
    ogImage: image,
    keywords: [name.toLowerCase(), "kupovina", "prirodni proizvod"],
  });
}

/**
 * Generate metadata for blog posts
 */
export function generateArticleMetadata({
  title,
  excerpt,
  slug,
  coverImage,
  publishedAt,
  author = "Maksuz Tim",
  tags = [],
}: {
  title: string;
  excerpt: string;
  slug: string;
  coverImage?: string;
  publishedAt?: string;
  author?: string;
  tags?: string[];
}): Metadata {
  const metadata = generatePageMetadata({
    title,
    description: excerpt,
    path: `/blog/${slug}`,
    ogImage: coverImage,
    keywords: tags,
  });

  return {
    ...metadata,
    openGraph: {
      ...metadata.openGraph,
      type: "article",
      publishedTime: publishedAt,
      authors: [author],
      tags,
    },
  };
}

/**
 * Generate metadata for career/job pages
 */
export function generateJobMetadata({
  title,
  description,
  slug,
  location,
  employmentType,
}: {
  title: string;
  description: string;
  slug: string;
  location?: string;
  employmentType?: string;
}): Metadata {
  const shortDescription =
    description.length > 160
      ? description.substring(0, 157) + "..."
      : description;

  return generatePageMetadata({
    title: `${title} - Karijera`,
    description: shortDescription,
    path: `/karijera/${slug}`,
    keywords: ["posao", "karijera", "zaposlenje", location || ""].filter(Boolean),
  });
}

// ============================================
// Structured Data (JSON-LD) Generators
// ============================================

/**
 * Organization schema for homepage and about page
 */
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    logo: `${siteConfig.url}/MAKSUZ_orange_logo.png`,
    email: siteConfig.email,
    telephone: siteConfig.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.street,
      addressLocality: siteConfig.address.city,
      postalCode: siteConfig.address.postalCode,
      addressCountry: "BA",
    },
    sameAs: [
      "https://www.facebook.com/maksuzba",
      "https://www.instagram.com/maksuzba",
    ],
  };
}

/**
 * LocalBusiness schema for contact and location pages
 */
export function generateLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteConfig.url}/#localbusiness`,
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    logo: `${siteConfig.url}/MAKSUZ_orange_logo.png`,
    image: `${siteConfig.url}/og-image.png`,
    email: siteConfig.email,
    telephone: siteConfig.phone,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.street,
      addressLocality: siteConfig.address.city,
      postalCode: siteConfig.address.postalCode,
      addressCountry: "BA",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 43.8563,
      longitude: 18.4131,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "17:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "09:00",
        closes: "14:00",
      },
    ],
  };
}

/**
 * Product schema for product detail pages
 */
export function generateProductSchema({
  name,
  description,
  slug,
  image,
  price,
  currency = "BAM",
  inStock = true,
  sku,
  brand = "Maksuz",
}: {
  name: string;
  description: string;
  slug: string;
  image?: string;
  price: number;
  currency?: string;
  inStock?: boolean;
  sku?: string;
  brand?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image: image || `${siteConfig.url}/productimage.png`,
    sku: sku || slug,
    brand: {
      "@type": "Brand",
      name: brand,
    },
    offers: {
      "@type": "Offer",
      url: `${siteConfig.url}/shop/product/${slug}`,
      priceCurrency: currency,
      price: price.toFixed(2),
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: siteConfig.name,
      },
    },
  };
}

/**
 * Article schema for blog posts
 */
export function generateArticleSchema({
  title,
  excerpt,
  slug,
  coverImage,
  publishedAt,
  modifiedAt,
  author = "Maksuz Tim",
}: {
  title: string;
  excerpt: string;
  slug: string;
  coverImage?: string;
  publishedAt?: string;
  modifiedAt?: string;
  author?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: excerpt,
    image: coverImage || `${siteConfig.url}/og-image.png`,
    url: `${siteConfig.url}/blog/${slug}`,
    datePublished: publishedAt,
    dateModified: modifiedAt || publishedAt,
    author: {
      "@type": "Person",
      name: author,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/MAKSUZ_orange_logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteConfig.url}/blog/${slug}`,
    },
  };
}

/**
 * JobPosting schema for career pages
 */
export function generateJobPostingSchema({
  title,
  description,
  slug,
  location,
  employmentType,
  datePosted,
  validThrough,
}: {
  title: string;
  description: string;
  slug: string;
  location?: string;
  employmentType?: string;
  datePosted?: string;
  validThrough?: string;
}) {
  const employmentTypeMap: Record<string, string> = {
    "full-time": "FULL_TIME",
    "part-time": "PART_TIME",
    contract: "CONTRACTOR",
    internship: "INTERN",
  };

  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title,
    description,
    url: `${siteConfig.url}/karijera/${slug}`,
    datePosted: datePosted || new Date().toISOString(),
    validThrough: validThrough,
    employmentType: employmentType
      ? employmentTypeMap[employmentType] || "FULL_TIME"
      : "FULL_TIME",
    hiringOrganization: {
      "@type": "Organization",
      name: siteConfig.name,
      sameAs: siteConfig.url,
      logo: `${siteConfig.url}/MAKSUZ_orange_logo.png`,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: location || siteConfig.address.city,
        addressCountry: "BA",
      },
    },
  };
}

/**
 * BreadcrumbList schema
 */
export function generateBreadcrumbSchema(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${siteConfig.url}${item.url}`,
    })),
  };
}

/**
 * FAQPage schema
 */
export function generateFAQSchema(
  faqs: { question: string; answer: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/**
 * WebSite schema with search action
 */
export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/shop/products?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}
