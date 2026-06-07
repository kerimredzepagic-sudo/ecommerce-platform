import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { HeroSection, Hero, LineProductsCarousel } from "@/components/sections";
import { SectionHeader } from "@/components/ui/section-header";
import { ArrowButton } from "@/components/ui/arrow-button";
import { Button } from "@/components/ui/button";
import { generatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Linija Energy",
  description:
    "Energy linija - prirodna energija za aktivan životni stil. Suho voće, orašasti plodovi i medne mješavine bez kofeina i umjetnih stimulansa.",
  path: "/linije/energy",
  keywords: ["energy", "energija", "aktivan stil", "suho voće", "orašasti plodovi", "sportaši", "prirodna energija"],
});

export default function EnergyLinePage() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <HeroSection image="/image3.svg" className="h-[500px] sm:h-[600px]">
        <div className="relative flex-1 flex items-center z-10">
          <Hero
            headTitle="Linija Energy"
            title="Prirodna energija za pobjednike"
            description="Energy linija je kreirana za sve koji traže prirodnu energiju bez umjetnih stimulansa. Suho voće, orašasti plodovi i medne mješavine."
            textCenter
          />
        </div>
      </HeroSection>

      {/* Logo Showcase Section */}
      <section className="py-16 bg-gradient-to-b from-orange-50 to-red-50">
        <div className="max-w-screen mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Logo - with orange background since it's white */}
            <div className="flex-shrink-0">
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 bg-brand-orange rounded-3xl p-8">
                <Image
                  src="/maksuz_logos/MAKSUZ_white Energy.png"
                  alt="Maksuz Energy"
                  fill
                  className="object-contain p-4"
                  priority
                />
              </div>
            </div>
            
            {/* Description */}
            <div className="flex-1">
              <SectionHeader
                label="O LINIJI"
                title="Energija bez kompromisa"
                description="Za razliku od energetskih pića i suplemenata, naši Energy proizvodi daju energiju kroz kompleksne ugljikohidrate iz voća i proteine iz orašastog voća. Stabilna energija koja traje satima."
                size="md"
              >
                <ArrowButton
                  href="/shop/products?line=energy"
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
            label="PRIRODNA ENERGIJA"
            title="Zašto prirodna energija?"
            className="mb-12"
          />
          
          <div className="flex flex-col md:flex-row gap-8 md:gap-12">
            {/* Column 1 */}
            <div className="flex-1">
              <h3 className="font-poppins text-5xl md:text-6xl font-normal text-gray-900 mb-4">
                0%
              </h3>
              <div className="mb-6 flex items-center">
                <div className="w-4 h-4 bg-lime-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 bg-lime-500 rounded-full"></div>
                </div>
                <div className="flex-1 h-0 border-t border-dashed border-gray-300 ml-2"></div>
              </div>
              <h4 className="font-oswald text-xl md:text-2xl font-normal text-gray-900 mb-3">
                BEZ KOFEINA
              </h4>
              <p className="text-gray-600 leading-relaxed">
                Prirodna energija bez kofeina, šećera i umjetnih stimulansa.
              </p>
            </div>

            {/* Column 2 */}
            <div className="flex-1">
              <h3 className="font-poppins text-5xl md:text-6xl font-normal text-gray-900 mb-4">
                8h+
              </h3>
              <div className="mb-6 flex items-center">
                <div className="w-4 h-4 bg-lime-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 bg-lime-500 rounded-full"></div>
                </div>
                <div className="flex-1 h-0 border-t border-dashed border-gray-300 ml-2"></div>
              </div>
              <h4 className="font-oswald text-xl md:text-2xl font-normal text-gray-900 mb-3">
                DUGOTRAJNA SNAGA
              </h4>
              <p className="text-gray-600 leading-relaxed">
                Energija koja traje satima, bez naglih padova i nervoze.
              </p>
            </div>

            {/* Column 3 */}
            <div className="flex-1">
              <h3 className="font-poppins text-5xl md:text-6xl font-normal text-gray-900 mb-4">
                Aktivan
              </h3>
              <div className="mb-6 flex items-center">
                <div className="w-4 h-4 bg-lime-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 bg-lime-500 rounded-full"></div>
                </div>
              </div>
              <h4 className="font-oswald text-xl md:text-2xl font-normal text-gray-900 mb-3">
                ZA AKTIVAN STIL
              </h4>
              <p className="text-gray-600 leading-relaxed">
                Idealno za sportaše, profesionalce i sve aktivne ljude.
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
            title="Energy Asortiman"
            description="Prirodna energija u svakom zalogaju"
            centered
            theme="brand"
            size="md"
            className="mb-8 px-4"
          />

          <LineProductsCarousel line="energy" />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-screen mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <SectionHeader
              label="NARUČITE"
              title="Spremni za prirodnu energiju?"
              description="Naručite Energy proizvode i osjetite razliku. Dostava širom BiH."
              centered
              size="md"
            >
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                <Button variant="brand" className="font-oswald uppercase" asChild>
                  <Link href="/shop/products?line=energy">KUPI ONLINE</Link>
                </Button>
                <Button
                  variant="outline"
                  className="font-oswald uppercase border-gray-300 text-gray-900 hover:bg-gray-50"
                  asChild
                >
                  <Link href="/poklon-paketi#energy">ENERGY PAKET</Link>
                </Button>
              </div>
            </SectionHeader>
          </div>
        </div>
      </section>
    </div>
  );
}
