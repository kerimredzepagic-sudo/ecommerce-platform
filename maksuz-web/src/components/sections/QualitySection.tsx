"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "../ui/button";
import { SectionHeader } from "../ui/section-header";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export const QualitySection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const columnsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate header
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

      // Animate columns with stagger
      if (columnsRef.current) {
        const columns = columnsRef.current.children;
        gsap.fromTo(
          columns,
          { opacity: 0, y: 50, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: columnsRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={sectionRef}
      className="w-full bg-gray-100 flex items-center justify-center py-16"
    >
      <div className="w-full max-w-screen px-4">
        {/* Header Section */}
        <div ref={headerRef} className="mb-12">
          <SectionHeader
            label="KVALITETA PROIZVODA"
            title="Garancije kvalitete"
          >
            <div className="flex gap-4 mt-6">
              <Button variant="brand" className="font-oswald uppercase" asChild>
                <Link href="/o-nama#kvaliteta">VIŠE</Link>
              </Button>
              <Button
                variant="outline"
                className="font-oswald uppercase border-gray-300 text-gray-900 hover:bg-gray-50"
                asChild
              >
                <Link href="/kontakt">KONTAKT</Link>
              </Button>
            </div>
          </SectionHeader>
        </div>

        {/* Three-Column Information Section */}
        <div className="px-8">
          <div
            ref={columnsRef}
            className="flex flex-col md:flex-row gap-8 md:gap-12"
          >
            {/* Column 1 - 2022 */}
            <div className="flex-1">
              <h3 className="font-poppins text-5xl md:text-6xl font-normal text-gray-900 mb-4">
                2022
              </h3>
              <div className="mb-6 flex items-center">
                <div className="w-4 h-4 bg-lime-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 bg-lime-500 rounded-full"></div>
                </div>
                {/* Dotted line extending to the right */}
                <div className="flex-1 h-0 border-t border-dashed border-gray-300 ml-2"></div>
              </div>
              <h4 className="font-oswald text-xl md:text-2xl font-normal text-gray-900 mb-3">
                HACCP certifikat
              </h4>
              <p className="text-gray-600 leading-relaxed">
                This helps clients understand what to expect and builds
                confidence.
              </p>
            </div>

            {/* Column 2 - 2023 */}
            <div className="flex-1">
              <h3 className="font-poppins text-5xl md:text-6xl font-normal text-gray-900 mb-4">
                2023
              </h3>
              <div className="mb-6 flex items-center">
                <div className="w-4 h-4 bg-lime-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 bg-lime-500 rounded-full"></div>
                </div>
                {/* Dotted line extending to the right */}
                <div className="flex-1 h-0 border-t border-dashed border-gray-300 ml-2"></div>
              </div>
              <h4 className="font-oswald text-xl md:text-2xl font-normal text-gray-900 mb-3">
                Halal certifikat
              </h4>
              <p className="text-gray-600 leading-relaxed">
                we focus on regenerative farming techniques and efficient crop
                rotation strategies.
              </p>
            </div>

            {/* Column 3 - Uvijek! */}
            <div className="flex-1">
              <h3 className="font-poppins text-5xl md:text-6xl font-normal text-gray-900 mb-4">
                Uvijek!
              </h3>
              <div className="mb-6 flex items-center">
                <div className="w-4 h-4 bg-lime-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 bg-lime-500 rounded-full"></div>
                </div>
              </div>
              <h4 className="font-oswald text-xl md:text-2xl font-normal text-gray-900 mb-3">
                Domaća proizvodnja
              </h4>
              <p className="text-gray-600 leading-relaxed">
                Sirovi med sadrži proteine, minerale, vitamine i enzime te ima
                prirodna antifungalna i antivirusna svojstva
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
