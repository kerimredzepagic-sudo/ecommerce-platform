"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SectionHeader } from "../ui/section-header";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const certificates = [
  {
    id: 1,
    name: "HACCP",
    image: "/HACCP.jpg",
    description:
      "Sistem analize opasnosti i kritičnih kontrolnih tačaka za sigurnost hrane",
  },
  {
    id: 2,
    name: "Halal",
    image: "/halal_certifikat.jpg",
    description:
      "Certifikat koji garantuje usklađenost sa islamskim propisima",
  },
  {
    id: 3,
    name: "ISO 9001",
    image: "/ISO9001.jpeg",
    description: "Međunarodni standard za sistem upravljanja kvalitetom",
  },
];

export const CertificatesSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

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

      // Animate certificate cards with stagger pop-in
      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll(".certificate-card");
        gsap.fromTo(
          cards,
          { opacity: 0, scale: 0.85, y: 40 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.15,
            ease: "back.out(1.4)",
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
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full py-16 sm:py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div ref={headerRef} className="mb-12 md:mb-16">
          <SectionHeader
            label="NAJODABRANIJE ZA VAS"
            title="Stvari koje nas definisu svakog dana."
            description="Naša posvećenost kvaliteti potvrđena je međunarodno priznatim certifikatima koji garantuju sigurnost, kvalitet i autentičnost naših proizvoda."
            centered
          />
        </div>

        {/* Certificate Cards Grid */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="certificate-card group bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
            >
              {/* Certificate Image */}
              <div className="relative w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 mx-auto mb-6">
                <Image
                  src={cert.image}
                  alt={`${cert.name} certifikat`}
                  fill
                  className="object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Certificate Info */}
              <div className="text-center">
                <h3 className="font-oswald text-xl md:text-2xl font-medium text-gray-900 mb-2">
                  {cert.name}
                </h3>
                <p className="font-poppins text-sm md:text-base text-gray-500 leading-relaxed">
                  {cert.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
