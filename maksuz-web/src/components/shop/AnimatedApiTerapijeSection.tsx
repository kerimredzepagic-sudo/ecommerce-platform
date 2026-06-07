"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/section-header";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ApiProduct {
  id: string;
  name: string;
  description: string;
  image: string;
  discount?: number;
}

const apiProducts: ApiProduct[] = [
  { id: "1", name: "API MINI", description: "20 Minuta", image: "/productimage.png" },
  { id: "2", name: "API FULL", description: "Proizvod koji liječe dušu...", image: "/productimage.png" },
  { id: "3", name: "PAKET 4 TRETMANA", description: "Proizvod koji liječe dušu...", image: "/productimage.png", discount: 10 },
  { id: "4", name: "PAKET 8 TRETMANA", description: "Proizvod koji liječe dušu...", image: "/productimage.png", discount: 20 },
];

function ApiCard({
  name,
  description,
  image,
  discount,
}: {
  name: string;
  description: string;
  image: string;
  discount?: number;
}) {
  return (
    <div className="flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-200 relative">
      {discount && (
        <div className="absolute top-3 right-3 z-10">
          <span className="bg-brand-orange text-white text-xs font-oswald font-bold px-2 py-1 rounded">
            -{discount}% AKCIJA
          </span>
        </div>
      )}
      <div className="flex items-center justify-center p-4 min-h-[180px] bg-gray-50">
        <Image src={image} alt={name} width={150} height={150} className="object-contain" />
      </div>
      <div className="flex flex-col p-4">
        <h4 className="font-oswald font-bold text-gray-900 uppercase text-base mb-1">{name}</h4>
        <p className="font-poppins text-gray-500 text-xs mb-3 line-clamp-2">{description}</p>
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            className="font-oswald text-xs uppercase border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white"
          >
            Vise O Api Terapij
          </Button>
          <button className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-orange hover:bg-brand-orange/90 transition-colors shadow-md hover:scale-110 duration-200">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M6 7H18L17 14H7L6 7ZM6 7L5 3H3M9 19C9.55228 19 10 18.5523 10 18C10 17.4477 9.55228 17 9 17C8.44772 17 8 17.4477 8 18C8 18.5523 8.44772 19 9 19ZM17 19C17.5523 19 18 18.5523 18 18C18 17.4477 17.5523 17 17 17C16.4477 17 16 17.4477 16 18C16 18.5523 16.4477 19 17 19Z"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export function AnimatedApiTerapijeSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animate header on scroll
    gsap.fromTo(
      headerRef.current,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      }
    );

    // Animate cards on scroll
    if (gridRef.current) {
      const cards = gridRef.current.children;
      gsap.fromTo(
        cards,
        { opacity: 0, y: 60, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          stagger: 0.15,
          ease: "back.out(1.2)",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    }
  }, []);

  return (
    <section ref={sectionRef} className="py-16 bg-gray-50">
      <div className="max-w-screen-extended mx-auto px-6">
        {/* Header */}
        <div ref={headerRef} className="mb-12">
          <SectionHeader
            label="NAJODABRANIJE ZA VAS"
            title="Api Terapije"
            centered
          />
        </div>

        {/* Products Grid */}
        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {apiProducts.map((product) => (
            <div key={product.id}>
              <ApiCard
                name={product.name}
                description={product.description}
                image={product.image}
                discount={product.discount}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
