import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { HeroSection, Hero, LineProductsCarousel } from "@/components/sections";
import { SectionHeader } from "@/components/ui/section-header";
import { ArrowButton } from "@/components/ui/arrow-button";
import { Button } from "@/components/ui/button";
import { generatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Linija Originals",
  description:
    "Originals linija - naši najpopularniji tradicionalni proizvodi. Autentični bosanski ukusi, med, pekmezi i namazi za svaku priliku.",
  path: "/linije/originals",
  keywords: ["originals", "tradicionalni proizvodi", "autentični ukusi", "bosanski proizvodi", "med", "pekmez"],
});

export default function OriginalsLinePage() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <HeroSection image="/image1.svg" className="h-[500px] sm:h-[600px]">
        <div className="relative flex-1 flex items-center z-10">
          <Hero
            headTitle="Linija Originals"
            title="Autentični ukusi tradicije"
            description="Naša najpopularnija linija proizvoda. Tradicionalne recepture, prirodni sastojci i ukus koji pamtite od djetinjstva."
            textCenter
          />
        </div>
      </HeroSection>

      {/* Logo Showcase Section */}
      <section className="py-16 bg-gradient-to-b from-amber-50 to-orange-50">
        <div className="max-w-screen mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Logo */}
            <div className="flex-shrink-0">
              <div className="relative w-64 h-64 sm:w-80 sm:h-80">
                <Image
                  src="/maksuz_logos/MAKSUZ_Originals_no background.png"
                  alt="Maksuz Originals"
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
                title="Početak naše priče"
                description="Originals linija predstavlja srž Maksuz branda. Svaki proizvod je rezultat generacijskih recepata, pažljivo odabranih sirovina iz netaknute bosanske prirode i ljubavi prema tradicionalnim ukusima."
                size="md"
              >
                <ArrowButton
                  href="/shop/products?line=originals"
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
            label="KVALITETA"
            title="Garancije kvalitete"
            className="mb-12"
          />
          
          <div className="flex flex-col md:flex-row gap-8 md:gap-12">
            {/* Column 1 */}
            <div className="flex-1">
              <h3 className="font-poppins text-5xl md:text-6xl font-normal text-gray-900 mb-4">
                200+
              </h3>
              <div className="mb-6 flex items-center">
                <div className="w-4 h-4 bg-lime-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 bg-lime-500 rounded-full"></div>
                </div>
                <div className="flex-1 h-0 border-t border-dashed border-gray-300 ml-2"></div>
              </div>
              <h4 className="font-oswald text-xl md:text-2xl font-normal text-gray-900 mb-3">
                PROIZVODA
              </h4>
              <p className="text-gray-600 leading-relaxed">
                Više od 200 različitih proizvoda u Originals liniji za svaku priliku.
              </p>
            </div>

            {/* Column 2 */}
            <div className="flex-1">
              <h3 className="font-poppins text-5xl md:text-6xl font-normal text-gray-900 mb-4">
                100%
              </h3>
              <div className="mb-6 flex items-center">
                <div className="w-4 h-4 bg-lime-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 bg-lime-500 rounded-full"></div>
                </div>
                <div className="flex-1 h-0 border-t border-dashed border-gray-300 ml-2"></div>
              </div>
              <h4 className="font-oswald text-xl md:text-2xl font-normal text-gray-900 mb-3">
                PRIRODNO
              </h4>
              <p className="text-gray-600 leading-relaxed">
                Bez aditiva i konzervansa. Samo prirodni sastojci iz netaknute prirode.
              </p>
            </div>

            {/* Column 3 */}
            <div className="flex-1">
              <h3 className="font-poppins text-5xl md:text-6xl font-normal text-gray-900 mb-4">
                Uvijek!
              </h3>
              <div className="mb-6 flex items-center">
                <div className="w-4 h-4 bg-lime-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 bg-lime-500 rounded-full"></div>
                </div>
              </div>
              <h4 className="font-oswald text-xl md:text-2xl font-normal text-gray-900 mb-3">
                CERTIFICIRANO
              </h4>
              <p className="text-gray-600 leading-relaxed">
                HACCP i Halal certifikat garantuju kvalitetu svakog proizvoda.
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
            title="Originals Asortiman"
            description="Istražite bogat asortiman tradicionalnih proizvoda"
            centered
            theme="brand"
            size="md"
            className="mb-8 px-4"
          />

          <LineProductsCarousel line="originals" />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-screen mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <SectionHeader
              label="NARUČITE"
              title="Pronađite svoj omiljeni proizvod"
              description="Posjetite naš webshop i naručite Originals proizvode sa dostavom na kućnu adresu."
              centered
              size="md"
            >
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                <Button variant="brand" className="font-oswald uppercase" asChild>
                  <Link href="/shop/products?line=originals">KUPI ONLINE</Link>
                </Button>
                <Button
                  variant="outline"
                  className="font-oswald uppercase border-gray-300 text-gray-900 hover:bg-gray-50"
                  asChild
                >
                  <Link href="/poslovnice">PRONAĐI POSLOVNICU</Link>
                </Button>
              </div>
            </SectionHeader>
          </div>
        </div>
      </section>
    </div>
  );
}
