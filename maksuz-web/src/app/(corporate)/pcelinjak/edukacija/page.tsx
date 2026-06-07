import { Metadata } from "next";
import { HeroSection, Hero } from "@/components/sections";
import { EdukacijaSection } from "@/components/sections/EdukacijaSection";
import { generatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Edukacija | Pčelinjak",
  description:
    "Edukativni programi na Maksuz pčelinjaku. Radionice o pčelama za djecu, škole i grupe. Naučite o pčelarstvu, medu i prirodi.",
  path: "/pcelinjak/edukacija",
  keywords: ["edukacija", "radionice", "pčele", "pčelarstvo", "škole", "djeca", "učenje", "priroda"],
});

export default function EdukacijaPage() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <HeroSection image="/apiTherapyGardening.svg" className="h-[600px]">
        <div className="relative flex-1 flex items-center z-10">
          <Hero
            headTitle="Edukacija"
            title="Učite o čudesnom svijetu pčela"
            description="Edukativni programi za sve uzraste. Od vrtićke djece do budućih pčelara - imamo program za svakoga."
            textCenter
          />
        </div>
      </HeroSection>

      <EdukacijaSection />
    </div>
  );
}
