"use client";

import { useRef, useEffect } from "react";
import { TestimonialCard } from "./TestimonialCard";
import { SectionHeader } from "@/components/ui/section-header";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface TestimonialData {
  customerName: string;
  customerImage: string;
  customerTitle?: string;
  reviewText: string;
}

const testimonials: TestimonialData[] = [
  {
    customerName: "Amina Hasanović",
    customerImage: "/womanAvatar.png", // Placeholder - replace with actual customer images
    customerTitle: "Redovan klijent",
    reviewText:
      "Odličan tretman! Osećam se mnogo bolje nakon samo nekoliko sesija. Preporučujem svima!",
  },
  {
    customerName: "Marko Petrović",
    customerImage: "/womanAvatar.png",
    customerTitle: "Prvi tretman",
    reviewText:
      "Profesionalni pristup i vrhunska usluga. Disajni putevi su mi se značajno poboljšali.",
  },
  {
    customerName: "Lejla Delić",
    customerImage: "/womanAvatar.png",
    customerTitle: "Paket tretmana",
    reviewText:
      "Fantastičan doživljaj! Tim je jako stručan i uslužan. Definitivno ću se vratiti.",
  },
  {
    customerName: "Emir Kovačević",
    customerImage: "/womanAvatar.png",
    customerTitle: "Redovan klijent",
    reviewText:
      "Najbolji api wellness centar u BiH. Kvalitet i profesionalizam na najvišem nivou.",
  },
  {
    customerName: "Sara Mehić",
    customerImage: "/womanAvatar.png",
    customerTitle: "Prvi tretman",
    reviewText:
      "Prekrasno iskustvo! Osećam se energičnije i zdravije. Hvala Maksuz timu!",
  },
  {
    customerName: "Nedim Berberović",
    customerImage: "/womanAvatar.png",
    customerTitle: "Paket tretmana",
    reviewText:
      "Odlična atmosfera i vrhunska usluga. Preporučujem svima koji traže prirodno liječenje.",
  },
];

export function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Duplicate testimonials for seamless infinite loop
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  useEffect(() => {
    // Animate header with staggered effect
    if (headerRef.current) {
      const subtitle = headerRef.current.querySelector("p");
      const title = headerRef.current.querySelector("h2");

      if (subtitle) {
        gsap.fromTo(
          subtitle,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      if (title) {
        gsap.fromTo(
          title,
          { opacity: 0, y: 30, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            delay: 0.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }

    // Animate carousel container - fade in with scale
    if (carouselRef.current) {
      gsap.fromTo(
        carouselRef.current,
        { opacity: 0, y: 50, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          delay: 0.4,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      // Animate initial visible testimonial cards with stagger
      // Select all cards from the animated wrapper (direct children)
      const animatedWrapper = carouselRef.current.querySelector(
        ".testimonial-scroll-wrapper"
      );
      if (animatedWrapper && animatedWrapper.children) {
        // Get direct children elements
        const cards = Array.from(animatedWrapper.children);
        // Only animate the first set of cards (not the duplicated ones)
        const firstSetOfCards = cards.slice(0, testimonials.length);

        gsap.fromTo(
          firstSetOfCards,
          { opacity: 0, y: 60, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            delay: 0.6,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }

    // Cleanup ScrollTrigger instances on unmount
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        trigger.kill();
      });
    };
  }, []);

  return (
    <section ref={sectionRef} className="w-full py-16 px-4">
      {/* Header Section - Centered */}
      <div
        ref={headerRef}
        className="mb-16 max-w-screen-extended mx-auto"
      >
        <SectionHeader
          label="REFERENCE"
          title="Šta naši klijenti kažu"
          centered
        />
      </div>

      {/* Carousel Container - max-w-screen with overflow hidden */}
      <div
        ref={carouselRef}
        className="mx-auto max-w-screen-extended pt-[10px] overflow-x-hidden overflow-y-visible"
      >
        {/* Continuous scrolling wrapper */}
        <div
          className="testimonial-scroll-wrapper flex gap-3 sm:gap-6 items-start"
          style={{
            animation: "scroll 15s linear infinite",
          }}
        >
          {duplicatedTestimonials.map((testimonial, index) => (
            <div key={index} className="flex-shrink-0 w-[160px] sm:w-[280px] md:w-[350px]">
              <TestimonialCard
                customerName={testimonial.customerName}
                customerImage={testimonial.customerImage}
                customerTitle={testimonial.customerTitle}
                reviewText={testimonial.reviewText}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
