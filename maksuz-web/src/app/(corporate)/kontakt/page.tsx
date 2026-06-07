import { Metadata } from "next";
import { HeroSection, ContactPageSection, Hero, LocationsCarousel } from "@/components/sections";
import { generatePageMetadata, generateLocalBusinessSchema } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = generatePageMetadata({
  title: "Kontakt",
  description:
    "Kontaktirajte Maksuz tim za sve upite, narudžbe i sugestije. Pronađite naše poslovnice, telefon, email i radno vrijeme.",
  path: "/kontakt",
  keywords: [
    "kontakt",
    "maksuz kontakt",
    "telefon",
    "email",
    "poslovnice",
    "radno vrijeme",
  ],
});

export default function ContactPage() {
  return (
    <div className="relative">
      <JsonLd data={generateLocalBusinessSchema()} />
      <HeroSection image="/image2.svg" className="h-[600px]">
        <div className="relative flex-1 flex items-center z-10">
          <Hero
            headTitle="Kontaktirajte nas."
            title="Tu smo za sva vaša pitanja, sugestije i narudžbe"
            textCenter
          />
        </div>
      </HeroSection>

      <ContactPageSection />
      <LocationsCarousel />
    </div>
  );
}
