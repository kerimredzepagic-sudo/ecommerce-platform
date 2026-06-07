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

export function AnimatedPromotionalBanner() {
  const sectionRef = useRef<HTMLElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animate banner container on scroll
    gsap.fromTo(
      bannerRef.current,
      { opacity: 0, scale: 0.95 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      }
    );

    // Animate text content on scroll
    gsap.fromTo(
      textRef.current,
      { opacity: 0, x: -50 },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        delay: 0.3,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none none",
        },
      }
    );

    // Animate quote on scroll
    gsap.fromTo(
      quoteRef.current,
      { opacity: 0, x: 50 },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        delay: 0.5,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none none",
        },
      }
    );
  }, []);

  return (
    <section ref={sectionRef} className="py-16">
      <div className="max-w-screen-extended mx-auto px-6">
        <div
          ref={bannerRef}
          className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-brand-orange to-orange-600 min-h-[400px]"
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image src="/ajvar.png" alt="Ajvar" fill className="object-cover opacity-30" />
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between h-full p-8 lg:p-16">
            {/* Left Side - Text */}
            <div ref={textRef} className="flex-1 max-w-lg">
              <SectionHeader
                label="NAJTRAŽENIJI PROIZVOD"
                title="Domaca receptura i domace paprike - idealan spoj za savrsen ajvar"
                description="Autentičan bosanski ukus napravljen u skladnoj Pazar Premium proizvodnji od paprike uzorene na idealnoj i svježoj hranjici Od svežeg branja do pecerija paprike za 4 sata je naslanjeni"
                theme="brand"
                size="md"
              >
                <div className="flex flex-wrap gap-3 mt-6">
                  <Button className="font-oswald uppercase bg-white text-brand-orange hover:bg-gray-100">
                    POGLEDAJ KATEGORIJU
                  </Button>
                  <Button
                    variant="outline"
                    className="font-oswald uppercase border-white text-white hover:bg-white hover:text-brand-orange"
                  >
                    KORPORATIVNI POKLONI
                  </Button>
                </div>
              </SectionHeader>
            </div>

            {/* Right Side - Quote */}
            <div ref={quoteRef} className="flex-1 flex items-center justify-center mt-8 lg:mt-0">
              <div className="text-white text-right">
                <p className="font-serif text-2xl md:text-3xl italic leading-relaxed">
                  &ldquo;Paznja je luksuz.
                  <br />
                  Ovo je poklon koji
                  <br />
                  to razumije.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
