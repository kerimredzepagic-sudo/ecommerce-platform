import { Metadata } from "next";
import Link from "next/link";
import { MapPin, Clock, Phone, Mail, Car, CheckCircle } from "lucide-react";
import { HeroSection, Hero } from "@/components/sections";
import { Button } from "@/components/ui/button";
import { generatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Lično Preuzimanje",
  description:
    "Lokacije za lično preuzimanje Maksuz narudžbi. Poslovnice u Sarajevu, Ilidži, Blažuju i Zenici. Besplatno preuzimanje bez troškova dostave.",
  path: "/pomoc/preuzimanje",
  keywords: ["lično preuzimanje", "poslovnice", "lokacije", "Sarajevo", "Ilidža", "Zenica", "besplatno"],
});

const locations = [
  {
    name: "Maksuz Kutak Grbavica",
    address: "Hamdije Čemerlića 49, Grbavica",
    city: "Sarajevo",
    hours: "Pon-Pet: 09:00-20:00, Sub: 09:00-15:00",
    phone: "+387 61 399 366",
    mapUrl: "https://maps.google.com/?q=Hamdije+Čemerlića+49+Sarajevo",
  },
  {
    name: "Maksuz Kutak Ilidža",
    address: "Bingo City Center, Ilidža",
    city: "Sarajevo",
    hours: "Pon-Sub: 09:00-21:00, Ned: 10:00-18:00",
    phone: "+387 62 200 088",
    mapUrl: "https://maps.google.com/?q=Bingo+City+Center+Ilidža",
  },
  {
    name: "Api & Wellness Centar",
    address: "Vidovci 86, Blažuj",
    city: "Sarajevo",
    hours: "Po dogovoru",
    phone: "+387 61 399 366",
    mapUrl: "https://maps.google.com/?q=Vidovci+86+Blažuj",
  },
  {
    name: "Maksuz Kutak Zenica",
    address: "TC Džananović, Zenica",
    city: "Zenica",
    hours: "Pon-Sub: 09:00-21:00",
    phone: "+387 62 200 088",
    mapUrl: "https://maps.google.com/?q=TC+Džananović+Zenica",
  },
];

const pickupSteps = [
  "Naručite proizvode putem webshopa",
  "Odaberite 'Lično preuzimanje' kao način dostave",
  "Izaberite željenu poslovnicu za preuzimanje",
  "Primite email kada narudžba bude spremna",
  "Preuzmite narudžbu uz osobnu iskaznicu",
];

export default function PreuzimanjePage() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <HeroSection image="/image4.svg" className="h-[300px] md:h-[400px]">
        <div className="relative flex-1 flex items-center z-10">
          <Hero headTitle="Lično Preuzimanje" title="Preuzmite u Poslovnici" textCenter />
        </div>
      </HeroSection>

      {/* Benefits */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="text-center p-6 bg-brand-cream/50 rounded-2xl">
                <Car className="w-10 h-10 text-brand-orange mx-auto mb-3" />
                <h3 className="font-bold mb-2">Bez Troškova Dostave</h3>
                <p className="text-sm text-gray-600">
                  Uštedite na dostavi preuzimanjem u poslovnici
                </p>
              </div>
              <div className="text-center p-6 bg-brand-cream/50 rounded-2xl">
                <Clock className="w-10 h-10 text-brand-orange mx-auto mb-3" />
                <h3 className="font-bold mb-2">Brzo Preuzimanje</h3>
                <p className="text-sm text-gray-600">
                  Narudžba spremna u roku od 24 sata
                </p>
              </div>
              <div className="text-center p-6 bg-brand-cream/50 rounded-2xl">
                <CheckCircle className="w-10 h-10 text-brand-orange mx-auto mb-3" />
                <h3 className="font-bold mb-2">Provjera na Licu Mjesta</h3>
                <p className="text-sm text-gray-600">
                  Pregledajte proizvode prije plaćanja
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-center mb-8">Kako Preuzeti Narudžbu</h2>

            <div className="bg-gray-50 p-6 md:p-8 rounded-2xl">
              <ol className="space-y-4">
                {pickupSteps.map((step, index) => (
                  <li key={index} className="flex items-center gap-4">
                    <span className="w-8 h-8 bg-brand-orange text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {index + 1}
                    </span>
                    <span className="text-gray-700">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Locations */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">Naše Poslovnice</h2>

            <div className="grid md:grid-cols-2 gap-6">
              {locations.map((location, index) => (
                <div key={index} className="bg-white p-6 rounded-2xl shadow-sm">
                  <h3 className="font-bold text-lg mb-4 text-brand-orange">
                    {location.name}
                  </h3>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-gray-700">{location.address}</p>
                        <p className="text-gray-500">{location.city}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      <p className="text-gray-700">{location.hours}</p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      <a 
                        href={`tel:${location.phone.replace(/\s/g, '')}`}
                        className="text-gray-700 hover:text-brand-orange"
                      >
                        {location.phone}
                      </a>
                    </div>
                  </div>

                  <a
                    href={location.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-4 text-sm text-brand-orange hover:underline"
                  >
                    <MapPin className="w-4 h-4" />
                    Pogledaj na mapi
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Important Info */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">Važne Informacije</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-brand-cream/50 p-6 rounded-xl">
                <h3 className="font-bold mb-3">Potrebni Dokumenti</h3>
                <ul className="text-gray-600 space-y-2 text-sm">
                  <li>• Osobna iskaznica ili pasoš</li>
                  <li>• Broj narudžbe ili email potvrda</li>
                  <li>• Za preuzimanje u tuđe ime: ovlaštenje</li>
                </ul>
              </div>

              <div className="bg-brand-cream/50 p-6 rounded-xl">
                <h3 className="font-bold mb-3">Rok za Preuzimanje</h3>
                <ul className="text-gray-600 space-y-2 text-sm">
                  <li>• Narudžba čeka 7 dana od obavijesti</li>
                  <li>• Nakon isteka roka, kontaktirajte nas</li>
                  <li>• Mogućnost produženja uz dogovor</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-brand-cream">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <MapPin className="w-12 h-12 text-brand-orange mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Imate Pitanja?</h2>
            <p className="text-muted-foreground mb-8">
              Kontaktirajte nas za informacije o raspoloživosti proizvoda
              ili radnom vremenu poslovnica.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-brand-orange hover:bg-brand-orange/90"
              >
                <Link href="/poslovnice">
                  <MapPin className="w-4 h-4 mr-2" />
                  Sve Poslovnice
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
