import { Metadata } from "next";
import { HeroSection, Hero } from "@/components/sections";
import { TrgovinaSection } from "@/components/sections/TrgovinaSection";
import { generatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Trgovina na Pčelinjaku",
  description:
    "Posjetite Maksuz trgovinu na pčelinjaku u Blažuju. Kompletan asortiman proizvoda, degustacije, stručni savjeti i ekskluzivne ponude.",
  path: "/pcelinjak/trgovina",
  keywords: ["trgovina", "pčelinjak", "degustacija", "kupovina", "direktno od proizvođača", "ponude"],
});

export default function TrgovinaPage() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <HeroSection image="/vegetables.svg" className="h-[600px]">
        <div className="relative flex-1 flex items-center z-10">
          <Hero
            headTitle="Maksuz Trgovina"
            title="Kupujte direktno od proizvođača"
            description="Posjetite našu trgovinu na pčelinjaku i pronađite kompletan asortiman Maksuz proizvoda. Degustacije, stručni savjeti i najbolje cijene."
            textCenter
          />
        </div>
      </HeroSection>

      <TrgovinaSection />
    </div>
  );
}
