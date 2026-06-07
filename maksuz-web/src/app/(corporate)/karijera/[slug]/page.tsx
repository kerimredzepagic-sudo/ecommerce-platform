import { Metadata } from "next";
import { Suspense } from "react";
import { generateJobMetadata, generateJobPostingSchema, generateBreadcrumbSchema, siteConfig } from "@/lib/seo";
import { JsonLd } from "@/components/seo";
import CareerPageClient from "./CareerPageClient";

// API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

// Fetch career data for metadata generation
async function getCareer(slug: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/careers/public/${slug}`, {
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
  const career = await getCareer(slug);

  if (!career) {
    return {
      title: "Pozicija nije pronađena | Maksuz Karijera",
      description: "Tražena pozicija nije pronađena ili više nije aktivna.",
      robots: { index: false, follow: false },
    };
  }

  // Get short description
  const cleanDescription = career.shortDescription
    ? career.shortDescription.replace(/<[^>]*>/g, "").substring(0, 160)
    : `Prijavite se za poziciju ${career.title} u kompaniji Maksuz.`;

  return generateJobMetadata({
    title: career.title,
    description: cleanDescription,
    slug: career.slug,
    location: career.location,
    employmentType: career.employmentType,
  });
}

// Loading component
function CareerPageLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-gray-500">Učitavanje pozicije...</div>
    </div>
  );
}

export default async function CareerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const career = await getCareer(slug);

  // Generate JSON-LD structured data
  const jobPostingSchema = career
    ? generateJobPostingSchema({
        title: career.title,
        description: career.fullDescription || career.shortDescription || "",
        slug: career.slug,
        location: career.location,
        employmentType: career.employmentType,
        datePosted: career.createdAt,
        validThrough: career.deadline,
      })
    : null;

  // Generate breadcrumb schema
  const breadcrumbSchema = career
    ? generateBreadcrumbSchema([
        { name: "Početna", url: "/" },
        { name: "Karijera", url: "/karijera" },
        { name: career.title, url: `/karijera/${career.slug}` },
      ])
    : null;

  return (
    <>
      {/* Structured Data */}
      {jobPostingSchema && <JsonLd data={jobPostingSchema} />}
      {breadcrumbSchema && <JsonLd data={breadcrumbSchema} />}
      
      <Suspense fallback={<CareerPageLoading />}>
        <CareerPageClient />
      </Suspense>
    </>
  );
}
