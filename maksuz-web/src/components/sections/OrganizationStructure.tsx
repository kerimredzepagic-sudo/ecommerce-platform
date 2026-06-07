"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SectionHeader } from "../ui/section-header";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function OrganizationStructure() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<SVGSVGElement>(null);
  const leftBranchRef = useRef<HTMLDivElement>(null);
  const rightBranchRef = useRef<HTMLDivElement>(null);
  const leftLeavesRef = useRef<HTMLDivElement>(null);
  const rightLeavesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Create a timeline for coordinated animations
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none none",
        },
      });

      // Header fade in
      tl.fromTo(
        headerRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
      );

      // Root node scale up with bounce
      tl.fromTo(
        rootRef.current,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.5)" },
        "-=0.2"
      );

      // SVG lines fade in
      tl.fromTo(
        linesRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: "power2.out" },
        "-=0.1"
      );

      // Branch nodes staggered fade in
      tl.fromTo(
        [leftBranchRef.current, rightBranchRef.current],
        { opacity: 0, y: 30, scale: 0.8 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          stagger: 0.15,
          ease: "back.out(1.2)",
        },
        "-=0.2"
      );

      // Leaf nodes pop in
      if (leftLeavesRef.current && rightLeavesRef.current) {
        const leftLeaves = leftLeavesRef.current.children;
        const rightLeaves = rightLeavesRef.current.children;

        tl.fromTo(
          [...Array.from(leftLeaves), ...Array.from(rightLeaves)],
          { opacity: 0, y: 20, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.4,
            stagger: 0.1,
            ease: "back.out(1.3)",
          },
          "-=0.2"
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full bg-gradient-to-b from-white via-gray-50/50 to-white py-20 md:py-28 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div ref={headerRef} className="mb-16 md:mb-20">
          <SectionHeader
            label="STRUKTURA"
            title="Maksuz Grupa"
            description="Porodica brendova i kompanija koje čine Maksuz ekosistem"
            centered
          />
        </div>

        {/* Organization Tree */}
        <div className="relative flex flex-col items-center">
          {/* Root Node - MAKSUZ */}
          <div
            ref={rootRef}
            className="relative z-10 bg-gray-900 text-white font-oswald text-2xl md:text-3xl lg:text-4xl px-10 md:px-14 py-5 md:py-6 rounded-2xl shadow-2xl cursor-default hover:scale-105 transition-transform duration-300"
          >
            MAKSUZ
          </div>

          {/* SVG Connecting Lines */}
          <svg
            ref={linesRef}
            className="absolute top-[70px] md:top-[80px] left-1/2 -translate-x-1/2 w-full max-w-4xl h-[280px] md:h-[320px] pointer-events-none"
            viewBox="0 0 800 320"
            fill="none"
            preserveAspectRatio="xMidYMin meet"
          >
            {/* Vertical line from root */}
            <path
              d="M400 0 L400 60"
              stroke="#d1d5db"
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* Horizontal connector */}
            <path
              d="M200 60 L600 60"
              stroke="#d1d5db"
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* Left vertical to D.O.O. */}
            <path
              d="M200 60 L200 100"
              stroke="#d1d5db"
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* Right vertical to O.S.P.D */}
            <path
              d="M600 60 L600 100"
              stroke="#d1d5db"
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* Left sub-branches */}
            <path
              d="M200 160 L200 200"
              stroke="#e5e7eb"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M120 200 L280 200"
              stroke="#e5e7eb"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M120 200 L120 240"
              stroke="#e5e7eb"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M280 200 L280 240"
              stroke="#e5e7eb"
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* Right sub-branches */}
            <path
              d="M600 160 L600 200"
              stroke="#e5e7eb"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M520 200 L680 200"
              stroke="#e5e7eb"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M520 200 L520 240"
              stroke="#e5e7eb"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M680 200 L680 240"
              stroke="#e5e7eb"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>

          {/* Branch Level */}
          <div className="relative z-10 flex justify-center gap-16 md:gap-32 lg:gap-48 mt-16 md:mt-20">
            {/* Left Branch - MAKSUZ D.O.O. */}
            <div className="flex flex-col items-center">
              <div
                ref={leftBranchRef}
                className="bg-gradient-to-r from-brand-orange to-orange-500 text-white font-oswald text-base md:text-lg lg:text-xl px-6 md:px-8 py-3 md:py-4 rounded-xl shadow-lg cursor-default hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                MAKSUZ D.O.O.
              </div>

              {/* Left Leaf Nodes */}
              <div
                ref={leftLeavesRef}
                className="flex gap-3 md:gap-4 mt-16 md:mt-20"
              >
                {/* MAKSUZ KUTAK */}
                <div className="bg-white border border-gray-100 rounded-xl px-4 md:px-6 py-4 md:py-5 text-center shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-default">
                  <p className="font-oswald text-sm md:text-base text-gray-900 uppercase font-medium">
                    Maksuz Kutak
                  </p>
                  <p className="font-poppins text-xs text-gray-400 mt-1">
                    (Prodajni objekti)
                  </p>
                </div>

                {/* FRANŠIZE */}
                <div className="bg-white border border-gray-100 rounded-xl px-4 md:px-6 py-4 md:py-5 text-center shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-default">
                  <p className="font-oswald text-sm md:text-base text-gray-900 uppercase font-medium">
                    Franšize
                  </p>
                </div>
              </div>
            </div>

            {/* Right Branch - MAKSUZ O.S.P.D */}
            <div className="flex flex-col items-center">
              <div
                ref={rightBranchRef}
                className="bg-gradient-to-r from-brand-orange to-orange-500 text-white font-oswald text-base md:text-lg lg:text-xl px-6 md:px-8 py-3 md:py-4 rounded-xl shadow-lg cursor-default hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                MAKSUZ O.S.P.D
              </div>

              {/* Right Leaf Nodes */}
              <div
                ref={rightLeavesRef}
                className="flex gap-3 md:gap-4 mt-16 md:mt-20"
              >
                {/* PROIZVODNJA */}
                <div className="bg-white border border-gray-100 rounded-xl px-4 md:px-6 py-4 md:py-5 text-center shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-default">
                  <p className="font-oswald text-sm md:text-base text-gray-900 uppercase font-medium">
                    Proizvodnja
                  </p>
                </div>

                {/* MAKSUZ PČELINJAK I API CENTAR */}
                <div className="bg-white border border-gray-100 rounded-xl px-4 md:px-6 py-4 md:py-5 text-center shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-default">
                  <p className="font-oswald text-sm md:text-base text-gray-900 uppercase font-medium">
                    Maksuz Pčelinjak
                  </p>
                  <p className="font-oswald text-sm md:text-base text-gray-900 uppercase font-medium">
                    i Api Centar
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
