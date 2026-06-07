import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { HeroSection, Hero, LineProductsCarousel } from "@/components/sections";
import { SectionHeader } from "@/components/ui/section-header";
import { ArrowButton } from "@/components/ui/arrow-button";
import { Button } from "@/components/ui/button";
import { generatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Linija Premium",
  description:
    "Premium linija - ekskluzivni proizvodi najviše kvalitete. Luksuzan izbor za posebne prilike, poklon paketi i korporativni pokloni.",
  path: "/linije/premium",
  keywords: ["premium", "ekskluzivni proizvodi", "poklon", "luksuz", "kvalitet", "posebne prilike"],
});

export default function PremiumLinePage() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <HeroSection image="/image2.svg" className="h-[500px] sm:h-[600px]">
        <div className="relative flex-1 flex items-center z-10">
          <Hero
            headTitle="Linija Premium"
            title="Ekskluzivnost u svakom proizvodu"
            description="Premium linija predstavlja vrhunac naše proizvodnje. Pažljivo odabrani sastojci, ekskluzivna pakovanja i neponovljiv ukus."
            textCenter
          />
        </div>
      </HeroSection>

      {/* Logo Showcase Section */}
      <section className="py-16 bg-gradient-to-b from-purple-50 to-indigo-50">
        <div className="max-w-screen mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Logo */}
            <div className="flex-shrink-0">
              <div className="relative w-64 h-64 sm:w-80 sm:h-80">
                <Image
                  src="/maksuz_logos/MAKSUZ_Premium_light.png"
                  alt="Maksuz Premium"
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
                title="Za one koji traže najbolje"
                description="Premium linija je kreirana za one koji cijene kvalitetu iznad svega. Svaki proizvod prolazi rigoroznu kontrolu kvalitete i dolazi u elegantnom pakovanju koje ostavlja dojam."
                size="md"
              >
                <ArrowButton
                  href="/shop/products?line=premium"
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
            title="Premium standardi"
            className="mb-12"
          />
          
          <div className="flex flex-col md:flex-row gap-8 md:gap-12">
            {/* Column 1 */}
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
                ČISTI SASTOJCI
              </h4>
              <p className="text-gray-600 leading-relaxed">
                Samo najkvalitetnije sirovine bez ikakvih dodataka ili punila.
              </p>
            </div>

            {/* Column 2 */}
            <div className="flex-1">
              <h3 className="font-poppins text-5xl md:text-6xl font-normal text-gray-900 mb-4">
                Poklon
              </h3>
              <div className="mb-6 flex items-center">
                <div className="w-4 h-4 bg-lime-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 bg-lime-500 rounded-full"></div>
                </div>
                <div className="flex-1 h-0 border-t border-dashed border-gray-300 ml-2"></div>
              </div>
              <h4 className="font-oswald text-xl md:text-2xl font-normal text-gray-900 mb-3">
                ELEGANTNO PAKOVANJE
              </h4>
              <p className="text-gray-600 leading-relaxed">
                Idealno za poklon - svaki proizvod dolazi u premium pakovanju.
              </p>
            </div>

            {/* Column 3 */}
            <div className="flex-1">
              <h3 className="font-poppins text-5xl md:text-6xl font-normal text-gray-900 mb-4">
                Limitirano
              </h3>
              <div className="mb-6 flex items-center">
                <div className="w-4 h-4 bg-lime-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 bg-lime-500 rounded-full"></div>
                </div>
              </div>
              <h4 className="font-oswald text-xl md:text-2xl font-normal text-gray-900 mb-3">
                EKSKLUZIVNE SERIJE
              </h4>
              <p className="text-gray-600 leading-relaxed">
                Limitirane edicije i rijetki proizvodi za istinske gurmane.
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
            title="Premium Asortiman"
            description="Ekskluzivni proizvodi za zahtjevne kupce"
            centered
            theme="brand"
            size="md"
            className="mb-8 px-4"
          />

          <LineProductsCarousel line="premium" />
        </div>
      </section>

      {/* Gift CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-screen mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <SectionHeader
              label="POKLON PAKETI"
              title="Savršen poklon za posebne prilike"
              description="Premium proizvodi dolaze u elegantnom pakovanju. Pogledajte naše poklon pakete za poslovne partnere i drage osobe."
              centered
              size="md"
            >
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                <Button variant="brand" className="font-oswald uppercase" asChild>
                  <Link href="/poklon-paketi#premium">PREMIUM PAKETI</Link>
                </Button>
                <Button
                  variant="outline"
                  className="font-oswald uppercase border-gray-300 text-gray-900 hover:bg-gray-50"
                  asChild
                >
                  <Link href="/shop/products?line=premium">SVI PROIZVODI</Link>
                </Button>
              </div>
            </SectionHeader>
          </div>
        </div>
      </section>
    </div>
  );
}
