import { Metadata } from "next";
import { HeroSection, Hero } from "@/components/sections";
import { MisijaVizijaSection } from "@/components/sections/MisijaVizijaSection";
import { generatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Misija i Vizija",
  description:
    "Otkrijte vrijednosti koje vode Maksuz. Naša misija je očuvanje tradicije i proizvodnja zdravih, prirodnih proizvoda za sve generacije.",
  path: "/misijavizija",
  keywords: [
    "misija",
    "vizija",
    "vrijednosti",
    "tradicija",
    "kvaliteta",
  ],
});

export default function MisijaVizijaPage() {
  return (
    <div className="relative">
      <HeroSection image="/garden.svg" className="h-[600px]">
        <div className="relative flex-1 flex items-center z-10">
          <Hero
            headTitle="Misija i Vizija"
            title="Naše vrijednosti koje nas vode u svemu što radimo"
            textCenter
          />
        </div>
      </HeroSection>

      <MisijaVizijaSection />
    </div>
  );
}
