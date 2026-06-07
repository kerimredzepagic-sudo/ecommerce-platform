"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowButton } from "../ui/arrow-button";
import { SectionHeader } from "../ui/section-header";
import { FeaturedServices } from "./FeaturedServices";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export const About = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const services = [
    {
      title: "Bogat asortiman proizvoda",
      subtitle: "PROIZVODI",
      image: "/ajvar.png",
      buttonText: "Pogledaj Proizvode",
      href: "/shop",
    },
    {
      title: "Korporativni poklon paketi",
      subtitle: "POKLONI",
      image: "/korporativni_premium_paket.jpg",
      buttonText: "Pogledaj Proizvode",
      href: "/shop/korporativni-pokloni",
    },
    {
      title: "Api terapija",
      subtitle: "WELLNESS",
      image: "/api_terapijaV2.jpg",
      buttonText: "Pogledaj Proizvode",
      href: "/api-terapija",
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate image from left
      gsap.fromTo(
        imageRef.current,
        { opacity: 0, x: -60, scale: 0.95 },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        },
      );

      // Animate text from right
      gsap.fromTo(
        textRef.current,
        { opacity: 0, x: 60 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          delay: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full flex flex-col relative items-center mt-8 sm:mt-12 md:mt-16"
    >
      {/* Top Section - About Us */}
      <div className="bg-gray-50 py-4 sm:py-8 md:py-8 absolute w-full max-w-screen top-0 rounded-2xl sm:rounded-32">
        <div className="w-full justify-center items-center px-4 sm:px-6 md:px-8 bg-[#F4F6F0]">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
            {/* Left Side - Image */}
            <div ref={imageRef} className="flex-1 w-full">
              <div className="relative w-full h-[250px] sm:h-[300px] md:h-[400px] lg:h-[500px] rounded-lg overflow-hidden">
                <Image
                  src="/image2.svg"
                  alt="Maksuz apiterapija building"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Right Side - Text Content */}
            <div ref={textRef} className="flex-1 flex flex-col gap-6">
              <SectionHeader
                label="O NAMA"
                title="Naša Priča"
                description="Prije sedam godina, iz jedne porodične ideje i ljubavi prema hrani i zdravoj ishrani, nastao je Maksuz, domaći bh. brend s posebnom namjerom. Vođeni uvjerenjem da hrana nije samo potreba, već odraz kvalitete života i brige o sebi i drugima, počeli smo stvarati proizvode koji su pronašli put do ljudskog srca i postali simbol povezivanja i poklanjanja. Zahvaljujući bogatom asortimanu od preko 100 proizvoda i unikatnim poklon-paketima, Maksuz je danas dio porodičnih trpeza i darivanja širom Bosne i Hercegovine, ali i na tržištima izvan nje."
                size="md"
              />
              <ArrowButton
                href="/o-nama"
                className="bg-brand-orange text-white w-[200px]"
                arrowVariant="white"
              >
                Vise O Nama
              </ArrowButton>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - Services */}
      <FeaturedServices
        services={services}
        className="mt-[400px] pt-[250px] sm:mt-[580px] sm:pt-[180px] md:mt-[650px] md:pt-[160px] lg:mt-[450px] lg:pt-[200px]"
        extended
        label="NAŠA PONUDA"
        title="Ono po čemu nas prepoznajete"
        description="Prirodni med, zdrava hrana, ekskluzivni pokloni i tradicionalna api terapija"
      />
    </section>
  );
};
