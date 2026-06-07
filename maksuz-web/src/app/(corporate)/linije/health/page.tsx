import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { HeroSection, Hero, LineProductsCarousel } from "@/components/sections";
import { SectionHeader } from "@/components/ui/section-header";
import { ArrowButton } from "@/components/ui/arrow-button";
import { Button } from "@/components/ui/button";
import { generatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Linija Health",
  description:
    "Health linija - proizvodi za zdravlje i imunitet. Propolis, polen, med i ljekovito bilje za jačanje organizma. Prirodna snaga za vaše zdravlje.",
  path: "/linije/health",
  keywords: ["health", "zdravlje", "imunitet", "propolis", "polen", "ljekovito bilje", "prirodna medicina"],
});

export default function HealthLinePage() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <HeroSection image="/honey-ginger.svg" className="h-[500px] sm:h-[600px]">
        <div className="relative flex-1 flex items-center z-10">
          <Hero
            headTitle="Linija Health"
            title="Prirodna snaga za vaše zdravlje"
            description="Health linija kombinira tradicionalne recepte i moderna znanja o prehrani. Proizvodi obogaćeni ljekovitim biljem, propolisom i polenom."
            textCenter
          />
        </div>
      </HeroSection>

      {/* Logo Showcase Section */}
      <section className="py-16 bg-gradient-to-b from-green-50 to-emerald-50">
        <div className="max-w-screen mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Logo */}
            <div className="flex-shrink-0">
              <div className="relative w-64 h-64 sm:w-80 sm:h-80">
                <Image
                  src="/maksuz_logos/MAKSUZ_Health_no background.png"
                  alt="Maksuz Health"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
            
            {/* Description */}
            <div className="flex-1">
              <SectionHeader
                label="O LINIJI"
                title="Zdravlje iz prirode"
                description="Health linija je kreirana za sve koji brinu o svom zdravlju. Prirodni proizvodi obogaćeni propolisom, polenom i ljekovitim biljem za jačanje imuniteta i opće zdravlje."
                size="md"
              >
                <ArrowButton
                  href="/shop/products?line=health"
                  className="bg-brand-orange text-white w-[220px]"
                  arrowVariant="white"
                >
                  Pogledaj Proizvode
                </ArrowButton>
              </SectionHeader>
            </div>
          </div>
        </div>
      </section>

      {/* Quality Section */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-screen mx-auto px-4">
          <SectionHeader
            label="ZDRAVSTVENE PREDNOSTI"
            title="Zašto odabrati Health liniju?"
            className="mb-12"
          />
          
          <div className="flex flex-col md:flex-row gap-8 md:gap-12">
            {/* Column 1 */}
            <div className="flex-1">
              <h3 className="font-poppins text-5xl md:text-6xl font-normal text-gray-900 mb-4">
                Imunitet
              </h3>
              <div className="mb-6 flex items-center">
                <div className="w-4 h-4 bg-lime-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 bg-lime-500 rounded-full"></div>
                </div>
                <div className="flex-1 h-0 border-t border-dashed border-gray-300 ml-2"></div>
              </div>
              <h4 className="font-oswald text-xl md:text-2xl font-normal text-gray-900 mb-3">
                JAČANJE OTPORNOSTI
              </h4>
              <p className="text-gray-600 leading-relaxed">
                Prirodni proizvodi koji pomažu u jačanju imunološkog sistema.
              </p>
            </div>

            {/* Column 2 */}
            <div className="flex-1">
              <h3 className="font-poppins text-5xl md:text-6xl font-normal text-gray-900 mb-4">
                Priroda
              </h3>
              <div className="mb-6 flex items-center">
                <div className="w-4 h-4 bg-lime-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 bg-lime-500 rounded-full"></div>
                </div>
                <div className="flex-1 h-0 border-t border-dashed border-gray-300 ml-2"></div>
              </div>
              <h4 className="font-oswald text-xl md:text-2xl font-normal text-gray-900 mb-3">
                BEZ ŠEĆERA
              </h4>
              <p className="text-gray-600 leading-relaxed">
                Prirodna slatkoća bez aditiva. Polen i med daju prirodnu energiju.
              </p>
            </div>

            {/* Column 3 */}
            <div className="flex-1">
              <h3 className="font-poppins text-5xl md:text-6xl font-normal text-gray-900 mb-4">
                Propolis
              </h3>
              <div className="mb-6 flex items-center">
                <div className="w-4 h-4 bg-lime-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 bg-lime-500 rounded-full"></div>
                </div>
              </div>
              <h4 className="font-oswald text-xl md:text-2xl font-normal text-gray-900 mb-3">
                PČELINJI PROIZVODI
              </h4>
              <p className="text-gray-600 leading-relaxed">
                Propolis i med pomažu kod prehlada i respiratornih problema.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Carousel */}
      <section className="py-16 bg-brand-orange rounded-2xl sm:rounded-32 mx-4 my-8">
        <div className="max-w-screen mx-auto">
          <SectionHeader
            label="PROIZVODI"
            title="Health Asortiman"
            description="Proizvodi za zdraviji životni stil"
            centered
            theme="brand"
            size="md"
            className="mb-8 px-4"
          />

          <LineProductsCarousel line="health" />
        </div>
      </section>

      {/* Api Terapija CTA */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-screen mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <SectionHeader
              label="API TERAPIJA"
              title="Iskusite Api Terapiju"
              description="Uz Health proizvode, posjetite naš Api Centar za prirodnu terapiju udisanja aerosola iz pčelinjih košnica. Idealno za respiratorne probleme i jačanje imuniteta."
              centered
              size="md"
            >
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                <Button variant="brand" className="font-oswald uppercase" asChild>
                  <Link href="/api-terapija">SAZNAJ VIŠE</Link>
                </Button>
                <Button
                  variant="outline"
                  className="font-oswald uppercase border-gray-300 text-gray-900 hover:bg-gray-50"
                  asChild
                >
                  <Link href="/shop/products?line=health">SVI PROIZVODI</Link>
                </Button>
              </div>
            </SectionHeader>
          </div>
        </div>
      </section>
    </div>
  );
}
