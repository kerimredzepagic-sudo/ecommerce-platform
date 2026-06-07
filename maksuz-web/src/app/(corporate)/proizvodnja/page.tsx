import { Metadata } from "next";
import { HeroSection, Hero } from "@/components/sections";
import { ProizvodnjaSection } from "@/components/sections/ProizvodnjaSection";
import { generatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Proizvodnja",
  description:
    "Saznajte više o Maksuz proizvodnom procesu. HACCP certificirana proizvodnja prirodnih proizvoda u srcu BiH. Kontrola kvalitete i tradicija.",
  path: "/proizvodnja",
  keywords: ["proizvodnja", "HACCP", "certifikat", "kvaliteta", "kontrola", "tradicija", "proces"],
});

export default function ProizvodnjaPage() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <HeroSection image="/image4.svg" className="h-[600px]">
        <div className="relative flex-1 flex items-center z-10">
          <Hero
            headTitle="Naša Proizvodnja"
            title="Od prirode do vašeg stola"
            description="Savremena proizvodnja koja poštuje tradiciju. HACCP certificirani pogon, kontrolirani procesi i ljubav prema kvaliteti u svakom koraku."
            textCenter
          />
        </div>
      </HeroSection>

      <ProizvodnjaSection />
    </div>
  );
}
