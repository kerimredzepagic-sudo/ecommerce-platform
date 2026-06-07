import { Metadata } from "next";
import { HeroSection, Hero } from "@/components/sections";
import { PoklonPaketiSection } from "@/components/sections/PoklonPaketiSection";
import { generatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Poklon Paketi",
  description:
    "Korporativni poklon paketi prirodnih proizvoda. Originals, Premium, Health i Energy linije za svaku priliku. Personalizacija i brza dostava.",
  path: "/poklon-paketi",
  keywords: [
    "poklon paketi",
    "korporativni pokloni",
    "poslovni pokloni",
    "premium paketi",
    "personalizirani pokloni",
  ],
});

export default function PoklonPaketiPage() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <HeroSection image="/image2.svg" className="h-[600px]">
        <div className="relative flex-1 flex items-center z-10">
          <Hero
            headTitle="Korporativni Pokloni"
            title="Posebna pažnja sa najboljim sastojcima"
            description="Pogledajte našu ponudu poklon paketa za korporativne klijente, poslovne partnere i posebne prilike. Personalizacija, premium kvalitet i brza dostava."
            textCenter
          />
        </div>
      </HeroSection>

      <PoklonPaketiSection />
    </div>
  );
}
