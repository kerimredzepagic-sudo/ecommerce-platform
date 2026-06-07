"use client";

import { useRef, useEffect } from "react";
import { Loader2 } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SectionHeader } from "../ui/section-header";
import { LocationCard } from "../LocationCard";
import { useStoreLocations } from "@/hooks/useShopApi";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface LocationsCarouselProps {
  showHeader?: boolean;
  label?: string;
  title?: string;
  description?: string;
}

export function LocationsCarousel({
  showHeader = true,
  label = "NAŠE POSLOVNICE",
  title = "Posjetite nas uživo",
  description = "Pronađite najbližu Maksuz poslovnicu i uvjerite se u kvalitetu naših proizvoda",
}: LocationsCarouselProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  // Fetch locations from API
  const { data: locationsData, isLoading } = useStoreLocations();
  const locations = locationsData?.data || [];

  useEffect(() => {
    if (isLoading || locations.length === 0) return;

    const ctx = gsap.context(() => {
      // Animate header
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // Animate cards with stagger slide-in from bottom
      if (cardsRef.current) {
        const cards = cardsRef.current.children;
        gsap.fromTo(
          cards,
          { opacity: 0, y: 50, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.15,
            ease: "back.out(1.2)",
            scrollTrigger: {
              trigger: cardsRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [isLoading, locations.length]);

  return (
    <section
      ref={sectionRef}
      className="w-full bg-white py-8 sm:py-12 md:py-16 overflow-hidden"
    >
      <div className="w-full px-3 sm:px-6 md:px-12 lg:px-20">
        {/* Heading */}
        {showHeader && (
          <div ref={headerRef} className="mb-8 sm:mb-12">
            <SectionHeader
              label={label}
              title={title}
              description={description}
              centered
              size="md"
            />
          </div>
        )}

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-brand-orange" />
          </div>
        ) : locations.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-gray-500 font-poppins">
              Nema dostupnih poslovnica
            </p>
          </div>
        ) : (
          <div
            ref={cardsRef}
            className="grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 md:gap-6 lg:gap-8 max-w-7xl mx-auto"
          >
            {locations.map((location) => (
              <LocationCard
                key={location.id}
                name={location.name}
                subtitle={location.subtitle}
                address={location.address}
                city={location.city}
                phone={location.phone}
                workingHours={location.workingHours}
                mapUrl={location.mapUrl}
                isHighlight={location.isHighlight}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
