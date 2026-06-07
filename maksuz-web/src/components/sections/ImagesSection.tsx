"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export const ImagesSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (imagesRef.current) {
        const images = imagesRef.current.children;
        
        // Staggered image reveal with scale and fade
        gsap.fromTo(
          images,
          { opacity: 0, scale: 1.1, y: 30 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
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
    <div ref={sectionRef} className="w-full h-[400px] overflow-hidden">
      <div
        ref={imagesRef}
        className="w-full h-full grid gap-0"
        style={{ gridTemplateColumns: "25% 1fr 25%" }}
      >
        <div className="relative w-full h-full overflow-hidden">
          <Image
            src="/image1.svg"
            alt="Ajvar"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="relative w-full h-full overflow-hidden">
          <Image
            src="/image2.svg"
            alt="Ajvar"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="relative w-full h-full overflow-hidden">
          <Image
            src="/image3.svg"
            alt="Ajvar"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </div>
  );
};
