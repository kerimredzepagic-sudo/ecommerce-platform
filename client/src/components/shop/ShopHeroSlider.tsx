"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useShopSlides, ShopSlide } from "@/hooks/useShopApi";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Loader2, ShoppingBag, Users, ArrowRight } from "lucide-react";
import gsap from "gsap";

// Fallback slide when no slides are configured
const fallbackSlide: ShopSlide = {
  id: "fallback",
  title: "SHOPKIT – brend koji spaja tradiciju, inovacije i ljubav prema hrani u unikatne, zdrave proizvode sa bh. potpisom.",
  subtitle: "",
  description: "Premium med, domaći pekmezi, zdravi namazi i još mnogo toga. Svi naši proizvodi su HACCP i Halal certifikovani.",
  headTitle: "DOBRODOŠLI U SHOPKIT SHOP.",
  backgroundType: "video",
  backgroundUrl: "/7015764_Car_Jeep_1280x720.mp4",
  buttonPrimaryText: "Pogledaj proizvode",
  buttonPrimaryLink: "/shop/products",
  buttonSecondaryText: "O NAMA",
  buttonSecondaryLink: "/o-nama",
  order: 0,
  isActive: true,
  location: "shop",
};

export function ShopHeroSlider() {
  const { data: slidesData, isLoading } = useShopSlides("shop");
  const slides = slidesData?.data?.length ? slidesData.data : [fallbackSlide];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [progressKey, setProgressKey] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const slide = slides[currentSlide];

  // Auto-rotate slides
  useEffect(() => {
    if (isAutoPlaying && slides.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setProgressKey((prev) => prev + 1); // Reset progress bar
      }, 6000); // 6 seconds per slide
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAutoPlaying, slides.length]);

  // Animate content on slide change
  useEffect(() => {
    if (contentRef.current) {
      const elements = contentRef.current.querySelectorAll(".animate-content");
      gsap.fromTo(
        elements,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
        }
      );
    }
  }, [currentSlide]);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
    setProgressKey((prev) => prev + 1); // Reset progress bar
    setIsAutoPlaying(false);
    // Resume auto-play after 10 seconds of inactivity
    setTimeout(() => setIsAutoPlaying(true), 10000);
  }, []);

  const nextSlide = useCallback(() => {
    goToSlide((currentSlide + 1) % slides.length);
  }, [currentSlide, slides.length, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide((currentSlide - 1 + slides.length) % slides.length);
  }, [currentSlide, slides.length, goToSlide]);

  if (isLoading) {
    return (
      <div className="px-1 sm:px-2 md:px-3 lg:px-4 pt-1">
        <section className="relative h-[550px] sm:h-[600px] md:h-[700px] lg:h-[800px] w-full flex items-center justify-center bg-gray-100 rounded-2xl lg:rounded-3xl">
          <Loader2 className="w-8 h-8 animate-spin text-brand-orange" />
        </section>
      </div>
    );
  }

  return (
    <div className="px-1 sm:px-2 md:px-3 lg:px-2 pt-1 md:pt-2">
      <section className="relative h-[550px] sm:h-[600px] md:h-[700px] lg:h-[800px] w-full overflow-hidden rounded-2xl lg:rounded-3xl">
        {/* Background Media */}
        {slide.backgroundType === "video" ? (
          <video
            key={slide.id + "-video"}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={slide.backgroundUrl} type="video/mp4" />
          </video>
        ) : (
          <div className="absolute inset-0">
            <Image
              key={slide.id + "-image"}
              src={slide.backgroundUrl}
              alt={slide.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Gradient Overlay - Warm brown/sepia tint */}
        <div
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{
            background:
              "linear-gradient(135deg, rgba(40, 25, 15, 0.85) 0%, rgba(60, 35, 20, 0.6) 50%, rgba(30, 20, 10, 0.4) 100%)",
          }}
        />

        {/* Content */}
        <div className="relative z-10 h-full max-w-screen mx-auto px-6 sm:px-8 md:px-12 lg:px-16 flex items-center">
          <div ref={contentRef} className="max-w-3xl space-y-6">
            {/* Head Title (Orange text above) */}
            {slide.headTitle && (
              <p className="animate-content text-brand-orange font-oswald text-base sm:text-lg md:text-xl lg:text-28 font-semibold uppercase tracking-wide">
                {slide.headTitle}
              </p>
            )}

            {/* Main Title */}
            <h1 className="animate-content font-poppins text-xl sm:text-2xl md:text-3xl lg:text-4xl font-normal leading-tight lg:leading-snug tracking-[-0.5px] lg:tracking-[-1px] text-white">
              {slide.title}
            </h1>

            {/* Description */}
            {slide.description && (
              <p className="animate-content font-poppins text-sm sm:text-base md:text-lg text-white/90 max-w-2xl">
                {slide.description}
              </p>
            )}

            {/* Buttons */}
            <div className="animate-content flex flex-wrap gap-5 pt-6">
              {slide.buttonPrimaryText && slide.buttonPrimaryLink && (
                <Link href={slide.buttonPrimaryLink}>
                  <Button
                    variant="brand"
                    size="lg"
                    className="font-oswald uppercase text-sm sm:text-base px-4 py-3 sm:px-6 sm:py-4 md:px-8 md:py-6 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group"
                  >
                    <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 hidden sm:inline" />
                    {slide.buttonPrimaryText}
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-1 sm:ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              )}
              {slide.buttonSecondaryText && slide.buttonSecondaryLink && (
                <Link href={slide.buttonSecondaryLink}>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-2 border-white text-white bg-white/10 backdrop-blur-sm hover:bg-white hover:text-gray-900 font-oswald uppercase text-sm sm:text-base px-4 py-3 sm:px-6 sm:py-4 md:px-8 md:py-6 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group"
                  >
                    <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 hidden sm:inline" />
                    {slide.buttonSecondaryText}
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-1 sm:ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        {slides.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-colors"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-colors"
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Slide Indicators */}
        {slides.length > 1 && (
          <div className="absolute bottom-10 sm:bottom-12 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={cn(
                  "w-3 h-3 rounded-full transition-all duration-300",
                  index === currentSlide
                    ? "bg-brand-orange w-8"
                    : "bg-white/50 hover:bg-white/70"
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Progress Bar - with rounded bottom corners */}
        {slides.length > 1 && (
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/20 z-20 rounded-b-2xl lg:rounded-b-3xl overflow-hidden">
            <div
              key={progressKey}
              className="h-full bg-brand-orange"
              style={{
                animation: isAutoPlaying ? 'progressBar 6s linear forwards' : 'none',
                width: isAutoPlaying ? '0%' : '0%',
              }}
            />
            <style jsx>{`
              @keyframes progressBar {
                from {
                  width: 0%;
                }
                to {
                  width: 100%;
                }
              }
            `}</style>
          </div>
        )}
      </section>
    </div>
  );
}
