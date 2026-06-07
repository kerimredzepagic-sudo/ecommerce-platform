"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BlogCard, BlogPost } from "@/components/blog/BlogCard";
import { cn } from "@/lib/utils";
import { Hero, HeroSection, SectionHeader } from "@/components";
import { FeaturedServices } from "@/components/sections/FeaturedServices";
import { useBlogPosts, useBlogCategories } from "@/hooks/useShopApi";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const services = [
  {
    title: "Bogat asortiman proizvoda",
    subtitle: "PROIZVODI",
    image: "/slika_proizvodnje.jpg",
    buttonText: "Pogledaj Ponudu",
    href: "/shop",
  },
  {
    title: "Korporativni poklon paketi",
    subtitle: "POKLONI",
    image: "/korporativni_premium_paket.jpg",
    buttonText: "Pogledaj Pakete",
    href: "/poklon-paketi",
  },
  {
    title: "Api terapija",
    subtitle: "PČELINJAK",
    image: "/api_terapijaV2.jpg",
    buttonText: "Saznaj Više",
    href: "/api-terapija",
  },
];

// Format date from ISO string to readable format
function formatDate(dateString?: string): string {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("bs-BA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
}

export default function BlogPageClient() {
  const [activeFilter, setActiveFilter] = useState("Sve");
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Fetch blog posts and categories
  const {
    data: postsData,
    isLoading: postsLoading,
    isError: postsError,
  } = useBlogPosts({
    limit: 50, // Get a reasonable amount of posts
  });
  const { data: categoriesData } = useBlogCategories();

  // Map backend data to frontend format
  const blogPosts: BlogPost[] = useMemo(() => {
    if (!postsData?.data) return [];

    // Ensure data is an array
    const postsArray = Array.isArray(postsData.data) ? postsData.data : [];

    return postsArray.map((post) => ({
      id: post.id,
      title: post.title,
      excerpt: post.excerpt,
      image: post.coverImage,
      category: post.category?.name || "Bez kategorije",
      date: formatDate(post.publishedAt || post.scheduledAt),
      slug: post.slug,
    }));
  }, [postsData]);

  // Build category filter list
  const filterCategories = useMemo(() => {
    const categories = ["Sve"];
    if (categoriesData?.data) {
      categoriesData.data.forEach((cat) => {
        if (cat.isActive) {
          categories.push(cat.name);
        }
      });
    }
    return categories;
  }, [categoriesData]);

  // Filter posts by selected category
  const filteredPosts = useMemo(() => {
    if (activeFilter === "Sve") {
      return blogPosts;
    }
    return blogPosts.filter((post) => post.category === activeFilter);
  }, [blogPosts, activeFilter]);

  useEffect(() => {
    // Animate header
    gsap.fromTo(
      headerRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      }
    );

    // Animate filters
    gsap.fromTo(
      filtersRef.current,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        delay: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      }
    );
  }, []);

  useEffect(() => {
    // Animate cards when filter changes
    if (gridRef.current) {
      const cards = gridRef.current.children;
      gsap.fromTo(
        cards,
        { opacity: 0, y: 40, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: "power3.out",
        }
      );
    }
  }, [activeFilter]);

  return (
    <div className="relative pb-16">
      {/* Hero Section */}
      <HeroSection image="/honey-ginger.svg" className="h-[600px]">
        <div className="relative flex-1 flex items-center z-10">
          <Hero
            headTitle="Kontaktirajte nas."
            title="Tu smo za sva vaša pitanja, sugestije i narudžbe"
            textCenter
          />
        </div>
      </HeroSection>

      {/* Blog Grid Section */}
      <section ref={sectionRef} className="py-16">
        <div className="max-w-screen mx-auto px-6">
          {/* Header */}
          <div ref={headerRef} className="mb-8">
            <SectionHeader
              label="NAJODABRANIJE ZA VAS"
              title="Budite uvijek u toku sa receptima i novostima."
              centered
              size="md"
            />
          </div>

          {/* Filters */}
          <div
            ref={filtersRef}
            className="flex flex-wrap justify-center items-center gap-2 mb-10"
          >
            <p className="font-oswald text-sm text-gray-600 mr-1">
              Brzi Filteri
            </p>
            {filterCategories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveFilter(category)}
                className={cn(
                  "font-oswald text-xs px-3 py-1.5 rounded-full border transition-all duration-300",
                  activeFilter === category
                    ? "bg-brand-orange text-white border-brand-orange"
                    : "bg-white text-gray-700 border-gray-300 hover:border-brand-orange hover:text-brand-orange"
                )}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Blog Grid */}
          {postsLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-gray-500">Učitavanje članaka...</div>
            </div>
          ) : postsError ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-red-500">
                <p>Greška pri učitavanju članaka.</p>
                <p className="text-sm mt-2">
                  {postsError
                    ? typeof postsError === "object" &&
                      postsError !== null &&
                      "message" in postsError
                      ? String((postsError as { message: string }).message)
                      : String(postsError)
                    : "Pokušajte ponovo."}
                </p>
                {process.env.NODE_ENV === "development" && (
                  <pre className="text-xs mt-4 text-left bg-gray-100 p-4 rounded">
                    {JSON.stringify(postsError, null, 2)}
                  </pre>
                )}
              </div>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-gray-500">
                Nema članaka za prikaz.{" "}
                {activeFilter !== "Sve" && "Pokušajte s drugim filterom."}
              </div>
            </div>
          ) : (
            <div
              ref={gridRef}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {filteredPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Section */}
      <div className="w-full flex justify-center">
        <FeaturedServices
          services={services}
          title="Ono po čemu nas prepoznajete"
          description="Istražite našu ponudu"
          extended
        />
      </div>

      {/* Promotional Banner */}
      <div className="w-full flex justify-center">
        <HeroSection
          image="/honey-ginger.svg"
          extended
          className="rounded-32 mt-8 px-16 h-[600px]"
        >
          <div className="flex items-center justify-center h-full">
            <Hero
              headTitle="Korporativni pokloni."
              title="Autentični pokloni koji ostavljaju utisak."
              description="Posebna pažnja sa najboljim sastojcima - brandirani pokloni od  prirodnih proizvoda za vaše partnere i zaposlene."
              linkText1="Pogledaj kategoriju"
              linkText2="KORPORATIVNI POKLONI"
              linkHref1="/poklon-paketi"
              linkHref2="/team-building"
            />
          </div>
        </HeroSection>
      </div>
    </div>
  );
}
