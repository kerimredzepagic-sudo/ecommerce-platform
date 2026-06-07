import { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { HeroSection } from "@/components/sections/HeroSection";
import { ApiBenefitsSection } from "@/components/sections/ApiBenefitsSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { generatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "API Terapija",
  description:
    "Prvi Api Wellness Centar u Bosni i Hercegovini. Udišite čist aerosol iz košnice za prirodno jačanje imuniteta. Apiterapija - revolucionarna metoda prirodnog liječenja.",
  path: "/api-terapija",
  keywords: [
    "api terapija",
    "apiterapija",
    "pčelinja terapija",
    "prirodno liječenje",
    "imunitet",
    "wellness centar",
    "blažuj",
  ],
});

export default function ApiTerapijaPage() {
  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 z-0">
      {/* Hero Section */}
      <HeroSection image="/honey-ginger.svg" className="h-[500px] sm:h-[600px] lg:h-[800px]">
        <div className="relative flex-1 flex items-center z-10">
          <Hero
            headTitle="Prvi Api Wellness Centar u Bosni i Hercegovini"
            title="Čist zrak iz košnice pčela iz netaknute prirode - prirodna terapija za vaš imunitet i zdravlje."
            description="Apiterapija, od latinske riječi APIS (pčela), predstavlja revolucionarnu metodu prirodnog liječenja. U našem centru u Blažuju, udišete čist aerosol proizveden direktno iz košnice, koristeći specijalizirane sterilne cijevi i maske za maksimalnu apsorpciju."
            linkText1="KONTAKTIRAJTE NAS"
            linkText2="SAZNAJTE VIŠE"
            linkHref1="/kontakt"
            linkHref2="#benefits"
          />
        </div>
      </HeroSection>

      {/* Benefits Section */}
      <ApiBenefitsSection />
      <TestimonialsSection />
    </div>
  );
}
