import { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Static routes with their priorities and change frequencies
const staticRoutes: {
  path: string;
  priority: number;
  changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
}[] = [
  // Main corporate pages
  { path: "/", priority: 1.0, changeFrequency: "weekly" },
  { path: "/o-nama", priority: 0.8, changeFrequency: "monthly" },
  { path: "/kontakt", priority: 0.8, changeFrequency: "monthly" },
  { path: "/misijavizija", priority: 0.7, changeFrequency: "monthly" },
  { path: "/proizvodnja", priority: 0.7, changeFrequency: "monthly" },
  { path: "/poslovnice", priority: 0.7, changeFrequency: "monthly" },
  { path: "/mediji", priority: 0.6, changeFrequency: "monthly" },
  { path: "/novosti", priority: 0.7, changeFrequency: "weekly" },
  { path: "/faq", priority: 0.6, changeFrequency: "monthly" },

  // API Terapija
  { path: "/api-terapija", priority: 0.9, changeFrequency: "weekly" },

  // Product lines
  { path: "/linije/premium", priority: 0.8, changeFrequency: "monthly" },
  { path: "/linije/originals", priority: 0.8, changeFrequency: "monthly" },
  { path: "/linije/health", priority: 0.8, changeFrequency: "monthly" },
  { path: "/linije/energy", priority: 0.8, changeFrequency: "monthly" },

  // Pčelinjak
  { path: "/pcelinjak/trgovina", priority: 0.7, changeFrequency: "monthly" },
  { path: "/pcelinjak/caffe", priority: 0.7, changeFrequency: "monthly" },
  { path: "/pcelinjak/edukacija", priority: 0.7, changeFrequency: "monthly" },

  // Gift packages
  { path: "/poklon-paketi", priority: 0.9, changeFrequency: "weekly" },
  { path: "/team-building", priority: 0.8, changeFrequency: "monthly" },

  // Blog
  { path: "/blog", priority: 0.8, changeFrequency: "daily" },

  // Careers
  { path: "/karijera", priority: 0.7, changeFrequency: "weekly" },

  // Shop
  { path: "/shop", priority: 1.0, changeFrequency: "daily" },
  { path: "/shop/products", priority: 0.9, changeFrequency: "daily" },

  // Help pages
  { path: "/pomoc/dostava", priority: 0.5, changeFrequency: "monthly" },
  { path: "/pomoc/kako-naruciti", priority: 0.5, changeFrequency: "monthly" },
  { path: "/pomoc/narucivanje-telefonom", priority: 0.5, changeFrequency: "monthly" },
  { path: "/pomoc/opci-uslovi", priority: 0.4, changeFrequency: "yearly" },
  { path: "/pomoc/preuzimanje", priority: 0.5, changeFrequency: "monthly" },
  { path: "/pomoc/privatnost", priority: 0.4, changeFrequency: "yearly" },
  { path: "/pomoc/reklamacije", priority: 0.5, changeFrequency: "monthly" },
  { path: "/pomoc/sigurno-placanje", priority: 0.5, changeFrequency: "monthly" },
  { path: "/pomoc/sigurnost", priority: 0.4, changeFrequency: "yearly" },

  // About sub-pages
  { path: "/o-nama/politike", priority: 0.5, changeFrequency: "yearly" },
  { path: "/o-nama/strategije", priority: 0.5, changeFrequency: "yearly" },
];

// Fetch products from API
async function fetchProducts(): Promise<{ slug: string; updatedAt?: string }[]> {
  try {
    const response = await fetch(`${API_URL}/products?limit=1000&isActive=true`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!response.ok) {
      console.error("Failed to fetch products for sitemap");
      return [];
    }

    const data = await response.json();
    return (data.data || []).map((product: { slug: string; updatedAt?: string }) => ({
      slug: product.slug,
      updatedAt: product.updatedAt,
    }));
  } catch (error) {
    console.error("Error fetching products for sitemap:", error);
    return [];
  }
}

// Fetch blog posts from API
async function fetchBlogPosts(): Promise<{ slug: string; updatedAt?: string }[]> {
  try {
    const response = await fetch(`${API_URL}/blog/posts?limit=1000&status=published`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      console.error("Failed to fetch blog posts for sitemap");
      return [];
    }

    const data = await response.json();
    return (data.data || []).map((post: { slug: string; updatedAt?: string }) => ({
      slug: post.slug,
      updatedAt: post.updatedAt,
    }));
  } catch (error) {
    console.error("Error fetching blog posts for sitemap:", error);
    return [];
  }
}

// Fetch careers from API
async function fetchCareers(): Promise<{ slug: string; updatedAt?: string }[]> {
  try {
    const response = await fetch(`${API_URL}/careers?limit=100&isActive=true`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      console.error("Failed to fetch careers for sitemap");
      return [];
    }

    const data = await response.json();
    return (data.data || []).map((career: { slug: string; updatedAt?: string }) => ({
      slug: career.slug,
      updatedAt: career.updatedAt,
    }));
  } catch (error) {
    console.error("Error fetching careers for sitemap:", error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;
  const now = new Date();

  // Generate static routes
  const staticPages: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  // Fetch dynamic content in parallel
  const [products, blogPosts, careers] = await Promise.all([
    fetchProducts(),
    fetchBlogPosts(),
    fetchCareers(),
  ]);

  // Generate product pages
  const productPages: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${baseUrl}/shop/product/${product.slug}`,
    lastModified: product.updatedAt ? new Date(product.updatedAt) : now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Generate blog post pages
  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt ? new Date(post.updatedAt) : now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Generate career pages
  const careerPages: MetadataRoute.Sitemap = careers.map((career) => ({
    url: `${baseUrl}/karijera/${career.slug}`,
    lastModified: career.updatedAt ? new Date(career.updatedAt) : now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...productPages, ...blogPages, ...careerPages];
}
