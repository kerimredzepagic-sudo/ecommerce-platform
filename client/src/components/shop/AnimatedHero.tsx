"use client";

import { useRef, useEffect } from "react";
import { SectionHeader } from "@/components/ui/section-header";
import gsap from "gsap";

// Line configuration with colors and descriptions
const LINE_CONFIG: Record<
  string,
  { color: string; label: string; title: string; description: string }
> = {
  premium: {
    color: "#673626",
    label: "SHOPKIT PREMIUM",
    title: "Premium Proizvodi",
    description: "Ekskluzivni proizvodi vrhunskog kvaliteta za zahtjevne kupce",
  },
  originals: {
    color: "#431E10",
    label: "SHOPKIT ORIGINALS",
    title: "Originalni Proizvodi",
    description: "Tradicionalni recepti sa autentičnim bosanskim ukusom",
  },
  health: {
    color: "#ED5926",
    label: "SHOPKIT HEALTH",
    title: "Zdravlje i Wellness",
    description: "Prirodni proizvodi za zdravlje i dobrobit",
  },
  energy: {
    color: "#ED5926",
    label: "SHOPKIT ENERGY",
    title: "Energija i Vitalnost",
    description: "Proizvodi bogati energijom za aktivan životni stil",
  },
};

interface AnimatedHeroProps {
  activeLine?: string;
}

export function AnimatedHero({ activeLine }: AnimatedHeroProps) {
  const containerRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const lineConfig = activeLine ? LINE_CONFIG[activeLine] : null;
  const isLineActive = !!lineConfig;

  useEffect(() => {
    if (headerRef.current) {
      gsap.set(headerRef.current, { opacity: 0, y: 30 });

      gsap.to(headerRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.4,
      });
    }
  }, []);

  return (
    <section
      ref={containerRef}
      className="py-12 border-b border-gray-100 transition-colors duration-500"
      style={{
        backgroundColor: lineConfig?.color || "transparent",
      }}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div ref={headerRef}>
          <SectionHeader
            label={lineConfig?.label || "NAJODABRANIJE ZA VAS"}
            title={lineConfig?.title || "Pazljivo pravljeno za Vas."}
            description={
              lineConfig?.description || "ShopKit Premium Proizvodi"
            }
            size="lg"
            theme={isLineActive ? "dark" : "light"}
          />
        </div>
      </div>
    </section>
  );
}
