import { Metadata } from "next";
import { HeroSection, AboutPageSection, Hero } from "@/components/sections";
import { generatePageMetadata, generateLocalBusinessSchema } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = generatePageMetadata({
  title: "O Nama",
  description:
    "Upoznajte Maksuz - porodičnu kompaniju iz Bosne i Hercegovine koja proizvodi prirodne delicije od 2019. godine. Naša priča, tradicija i posvećenost kvaliteti.",
  path: "/o-nama",
  keywords: [
    "o nama",
    "maksuz priča",
    "porodična kompanija",
    "tradicija",
    "prirodni proizvodi BiH",
  ],
});

export default function AboutPage() {
  return (
    <div className="relative">
      <JsonLd data={generateLocalBusinessSchema()} />
      <HeroSection image="/image2.svg" className="h-[600px]">
        <div className="relative flex-1 flex items-center z-10">
          <Hero
            headTitle="O nama."
            title="Porodični proizvođači prirodnih delicija iz srca BiH"
            textCenter
          />
        </div>
      </HeroSection>

      <AboutPageSection />
    </div>
  );
}
