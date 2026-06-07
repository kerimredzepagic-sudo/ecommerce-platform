import { Metadata } from "next";
import Link from "next/link";
import { Truck, Clock, MapPin, Package, Gift, Phone, Mail, CheckCircle } from "lucide-react";
import { HeroSection, Hero } from "@/components/sections";
import { Button } from "@/components/ui/button";
import { generatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Dostava",
  description:
    "Informacije o dostavi Maksuz proizvoda. Besplatna dostava iznad 50 KM. Rokovi, cijene, područja dostave i praćenje pošiljki širom BiH.",
  path: "/pomoc/dostava",
  keywords: ["dostava", "isporuka", "kurirska služba", "besplatna dostava", "praćenje pošiljke", "cijena dostave"],
});

const deliveryOptions = [
  {
    icon: Truck,
    title: "Standardna Dostava",
    price: "7 KM",
    time: "2-4 radna dana",
    description: "Dostava putem kurirske službe na vašu adresu u BiH.",
  },
  {
    icon: Gift,
    title: "Besplatna Dostava",
    price: "BESPLATNO",
    time: "2-4 radna dana",
    description: "Za sve narudžbe iznad 50 KM dostava je potpuno besplatna.",
    highlight: true,
  },
  {
    icon: MapPin,
    title: "Lično Preuzimanje",
    price: "BESPLATNO",
    time: "24 sata",
    description: "Preuzmite narudžbu u jednoj od naših poslovnica.",
  },
];

const deliveryAreas = [
  { region: "Sarajevo i okolica", time: "1-2 radna dana" },
  { region: "Federacija BiH", time: "2-3 radna dana" },
  { region: "Republika Srpska", time: "2-4 radna dana" },
  { region: "Brčko Distrikt", time: "2-3 radna dana" },
];

export default function DostavaPage() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <HeroSection image="/image4.svg" className="h-[300px] md:h-[400px]">
        <div className="relative flex-1 flex items-center z-10">
          <Hero headTitle="Dostava" title="Brza i Sigurna Dostava" textCenter />
        </div>
      </HeroSection>

      {/* Delivery Options */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <p className="text-center text-lg text-gray-600 mb-12">
              Dostavljamo na sve adrese u Bosni i Hercegovini. Odaberite način
              dostave koji vam najviše odgovara.
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              {deliveryOptions.map((option, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-2xl text-center ${
                    option.highlight
                      ? "bg-brand-orange text-white"
                      : "bg-brand-cream/50"
                  }`}
                >
                  <option.icon
                    className={`w-12 h-12 mx-auto mb-4 ${
                      option.highlight ? "text-white" : "text-brand-orange"
                    }`}
                  />
                  <h3 className="font-bold text-lg mb-2">{option.title}</h3>
                  <p
                    className={`text-2xl font-bold mb-2 ${
                      option.highlight ? "text-white" : "text-brand-orange"
                    }`}
                  >
                    {option.price}
                  </p>
                  <p
                    className={`text-sm mb-3 ${
                      option.highlight ? "text-white/80" : "text-gray-500"
                    }`}
                  >
                    {option.time}
                  </p>
                  <p
                    className={`text-sm ${
                      option.highlight ? "text-white/90" : "text-gray-600"
                    }`}
                  >
                    {option.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Delivery Areas */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">
              Rokovi Dostave po Regijama
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              {deliveryAreas.map((area, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-white rounded-xl"
                >
                  <span className="font-medium">{area.region}</span>
                  <span className="text-brand-orange font-bold">{area.time}</span>
                </div>
              ))}
            </div>

            <p className="text-center text-sm text-gray-500 mt-6">
              * Rokovi dostave su okvirni i mogu varirati ovisno o dostupnosti kurira
            </p>
          </div>
        </div>
      </section>

      {/* Tracking */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">
              Praćenje Pošiljke
            </h2>

            <div className="bg-brand-cream/50 p-6 md:p-8 rounded-2xl">
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <Package className="w-16 h-16 text-brand-orange flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-lg mb-2">
                    Pratite Vašu Narudžbu u Realnom Vremenu
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Nakon otpreme narudžbe, primićete email sa brojem za praćenje.
                    Kliknite na link u emailu ili unesite broj na stranici kurirske
                    službe za praćenje statusa vaše pošiljke.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-white rounded-full text-sm text-gray-700">
                      Email obavijest
                    </span>
                    <span className="px-3 py-1 bg-white rounded-full text-sm text-gray-700">
                      Broj za praćenje
                    </span>
                    <span className="px-3 py-1 bg-white rounded-full text-sm text-gray-700">
                      Status u realnom vremenu
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Important Info */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">Važne Informacije</h2>

            <div className="space-y-4">
              {[
                "Dostava se vrši radnim danima od 08:00 do 17:00",
                "Kurir će vas kontaktirati prije dostave",
                "Ako niste kod kuće, kurir ostavlja obavijest za ponovno preuzimanje",
                "Paketi su pažljivo zapakirani za siguran transport",
                "Za kvarljive proizvode koristimo termoizolaciono pakiranje",
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 bg-white p-4 rounded-xl"
                >
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <p className="text-gray-700">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-brand-cream">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Truck className="w-12 h-12 text-brand-orange mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Imate Pitanja o Dostavi?</h2>
            <p className="text-muted-foreground mb-8">
              Naš tim je tu da odgovori na sva vaša pitanja vezana za dostavu,
              praćenje pošiljki ili preuzimanje narudžbi.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-brand-orange hover:bg-brand-orange/90"
              >
                <Link href="/kontakt">
                  <Mail className="w-4 h-4 mr-2" />
                  Kontaktirajte Nas
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="tel:+38761399366">
                  <Phone className="w-4 h-4 mr-2" />
                  +387 61 399 366
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
