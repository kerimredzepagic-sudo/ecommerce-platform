"use client";

import { useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BlogHero } from "@/components/blog/BlogHero";
import { AnimatedPromotionalBanner } from "@/components/shop/AnimatedPromotionalBanner";
import { AnimatedFooter } from "@/components/shop/AnimatedFooter";
import { HeroSection } from "@/components/sections/HeroSection";
import { Hero } from "@/components/sections/Hero";
import { useBlogPost } from "@/hooks/useShopApi";
import { formatProductContent } from "@/lib/formatContent";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

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

export default function BlogPostClient() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const { data: postData, isLoading, isError } = useBlogPost(slug);

  const articleRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const navigationRef = useRef<HTMLDivElement>(null);

  const post = postData?.data;

  useEffect(() => {
    if (!post) return;

    // Animate article content
    gsap.fromTo(
      contentRef.current,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: articleRef.current,
          start: "top 80%",
        },
      }
    );

    // Animate quote (if exists)
    if (quoteRef.current) {
      gsap.fromTo(
        quoteRef.current,
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: quoteRef.current,
            start: "top 85%",
          },
        }
      );
    }

    // Animate navigation
    if (navigationRef.current) {
      gsap.fromTo(
        navigationRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: {
            trigger: navigationRef.current,
            start: "top 90%",
          },
        }
      );
    }
  }, [post]);

  // Handle 404 or error
  if (isError || (!isLoading && !post)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Članak nije pronađen
          </h1>
          <p className="text-gray-600 mb-6">
            Članak koji tražite ne postoji ili je uklonjen.
          </p>
          <Link href="/blog" className="text-brand-orange hover:underline">
            ← Povratak na blog
          </Link>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Učitavanje članka...</div>
      </div>
    );
  }

  // Get related posts for navigation (use first two if available)
  const relatedPosts = post.relatedPosts || [];
  const prevPost = relatedPosts[0] || null;
  const nextPost = relatedPosts[1] || null;

  // Format content for display
  const formattedContent = formatProductContent(post.content);

  return (
    <div className="relative">
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

      {/* Article Section */}
      <article ref={articleRef} className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <div ref={contentRef}>
            {/* Category & Date */}
            <div className="flex items-center gap-4 mb-4">
              {post.category && (
                <span className="bg-brand-orange text-white text-xs font-oswald uppercase px-3 py-1 rounded">
                  {post.category.name}
                </span>
              )}
              <span className="font-poppins text-sm text-gray-500">
                {formatDate(post.publishedAt || post.scheduledAt)}
              </span>
              {post.readingTime && (
                <span className="font-poppins text-sm text-gray-500">
                  • {post.readingTime} min čitanja
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="font-oswald text-3xl md:text-4xl font-bold text-gray-900 mb-8">
              {post.title}
            </h1>

            {/* Featured Image */}
            {post.coverImage && (
              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-10">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* Excerpt/Introduction */}
            {post.excerpt && (
              <p className="font-poppins text-gray-700 text-lg leading-relaxed mb-8 italic">
                {post.excerpt}
              </p>
            )}

            {/* Content - HTML rendered */}
            <div
              className="font-poppins text-gray-700 text-base leading-relaxed prose prose-lg max-w-none
                prose-headings:font-oswald prose-headings:text-gray-900
                prose-h2:text-xl prose-h2:font-bold prose-h2:mb-4 prose-h2:mt-8
                prose-h3:text-lg prose-h3:font-bold prose-h3:mb-3 prose-h3:mt-6
                prose-p:mb-4 prose-p:leading-relaxed
                prose-strong:text-gray-900 prose-strong:font-semibold
                prose-a:text-brand-orange prose-a:no-underline hover:prose-a:underline
                prose-ul:list-disc prose-ul:ml-6 prose-ul:mb-4
                prose-ol:list-decimal prose-ol:ml-6 prose-ol:mb-4
                prose-li:mb-2
                prose-blockquote:border-l-4 prose-blockquote:border-brand-orange prose-blockquote:pl-6 prose-blockquote:py-2 prose-blockquote:my-6 prose-blockquote:italic
                prose-img:rounded-lg prose-img:my-6"
              dangerouslySetInnerHTML={{ __html: formattedContent }}
            />
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-8 pt-8 border-t border-gray-200">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="font-poppins text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Post Navigation */}
          {(prevPost || nextPost) && (
            <div
              ref={navigationRef}
              className="flex items-center justify-between border-t border-gray-200 pt-8 mt-12"
            >
              {/* Previous Post */}
              {prevPost ? (
                <Link
                  href={`/blog/${prevPost.slug}`}
                  className="group flex items-center gap-3 hover:text-brand-orange transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-100 group-hover:bg-brand-orange/10 flex items-center justify-center transition-colors">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-gray-600 group-hover:text-brand-orange"
                    >
                      <polyline points="15,18 9,12 15,6" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-poppins text-xs text-gray-500">
                      Prethodni članak
                    </p>
                    <p className="font-oswald font-bold text-gray-900 group-hover:text-brand-orange transition-colors max-w-[200px] truncate">
                      {prevPost.title}
                    </p>
                  </div>
                </Link>
              ) : (
                <div />
              )}

              {/* Next Post */}
              {nextPost ? (
                <Link
                  href={`/blog/${nextPost.slug}`}
                  className="group flex items-center gap-3 text-right hover:text-brand-orange transition-colors"
                >
                  <div>
                    <p className="font-poppins text-xs text-gray-500">
                      Sledeći članak
                    </p>
                    <p className="font-oswald font-bold text-gray-900 group-hover:text-brand-orange transition-colors max-w-[200px] truncate ml-auto">
                      {nextPost.title}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gray-100 group-hover:bg-brand-orange/10 flex items-center justify-center transition-colors">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-gray-600 group-hover:text-brand-orange"
                    >
                      <polyline points="9,18 15,12 9,6" />
                    </svg>
                  </div>
                </Link>
              ) : (
                <div />
              )}
            </div>
          )}
        </div>
      </article>

      <div className="w-full flex justify-center">
        <HeroSection
          image="/honey-ginger.svg"
          screen
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
