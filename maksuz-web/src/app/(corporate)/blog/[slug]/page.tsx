import { Metadata } from "next";
import { Suspense } from "react";
import { generateArticleMetadata, generateArticleSchema, generateBreadcrumbSchema, siteConfig } from "@/lib/seo";
import { JsonLd } from "@/components/seo";
import BlogPostClient from "./BlogPostClient";

// API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

// Fetch blog post data for metadata generation
async function getBlogPost(slug: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/blog/posts/${slug}`, {
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
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return {
      title: "Članak nije pronađen | Maksuz Blog",
      description: "Traženi članak nije pronađen na našem blogu.",
      robots: { index: false, follow: false },
    };
  }

  // Get excerpt or clean description
  const cleanExcerpt = post.excerpt
    ? post.excerpt.replace(/<[^>]*>/g, "").substring(0, 160)
    : (post.content || "")
        .replace(/<[^>]*>/g, "")
        .substring(0, 160);

  return generateArticleMetadata({
    title: post.title,
    excerpt: cleanExcerpt || `Pročitajte članak "${post.title}" na Maksuz blogu.`,
    slug: post.slug,
    coverImage: post.coverImage,
    publishedAt: post.publishedAt || post.scheduledAt,
    author: post.author?.name || "Maksuz Tim",
    tags: post.tags || [],
  });
}

// Loading component
function BlogPostLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-gray-500">Učitavanje članka...</div>
    </div>
  );
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  // Generate JSON-LD structured data
  const articleSchema = post
    ? generateArticleSchema({
        title: post.title,
        excerpt: post.excerpt || "",
        slug: post.slug,
        coverImage: post.coverImage,
        publishedAt: post.publishedAt || post.scheduledAt,
        modifiedAt: post.updatedAt,
        author: post.author?.name || "Maksuz Tim",
      })
    : null;

  // Generate breadcrumb schema
  const breadcrumbSchema = post
    ? generateBreadcrumbSchema([
        { name: "Početna", url: "/" },
        { name: "Blog", url: "/blog" },
        { name: post.title, url: `/blog/${post.slug}` },
      ])
    : null;

  return (
    <>
      {/* Structured Data */}
      {articleSchema && <JsonLd data={articleSchema} />}
      {breadcrumbSchema && <JsonLd data={breadcrumbSchema} />}
      
      <Suspense fallback={<BlogPostLoading />}>
        <BlogPostClient />
      </Suspense>
    </>
  );
}
