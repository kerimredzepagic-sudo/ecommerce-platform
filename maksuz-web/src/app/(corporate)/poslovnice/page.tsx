import { Metadata } from "next";
import { HeroSection, Hero, LocationsCarousel } from "@/components/sections";
import { generatePageMetadata, generateLocalBusinessSchema } from "@/lib/seo";
import { JsonLd } from "@/components/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Poslovnice",
  description:
    "Pronađite najbližu Maksuz poslovnicu. Lokacije u Sarajevu (Grbavica, Ilidža), Zenici i Blažuju. Radno vrijeme, kontakti i mape.",
  path: "/poslovnice",
  keywords: ["poslovnice", "lokacije", "Sarajevo", "Zenica", "Ilidža", "Grbavica", "prodavnica", "kutak"],
});

export default function PoslovnicePage() {
  return (
    <div className="relative">
      <JsonLd data={generateLocalBusinessSchema()} />
      {/* Hero Section */}
      <HeroSection image="/image3.svg" className="h-[600px]">
        <div className="relative flex-1 flex items-center z-10">
          <Hero
            headTitle="Naše Poslovnice"
            title="Posjetite nas uživo i uvjerite se u kvalitetu"
            description="Pronađite najbližu Maksuz poslovnicu. Degustacije, stručni savjeti i kompletan asortiman na jednom mjestu."
            textCenter
          />
        </div>
      </HeroSection>

      <LocationsCarousel
        label="PRONAĐITE NAS"
        title="Naše lokacije"
        description="Posjetite nas na jednoj od naših lokacija širom Bosne i Hercegovine"
      />
    </div>
  );
}
