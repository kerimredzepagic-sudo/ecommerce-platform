import { Metadata } from "next";
import Link from "next/link";
import { Phone, Mail, Clock, MessageCircle } from "lucide-react";
import { HeroSection, Hero } from "@/components/sections";
import { Button } from "@/components/ui/button";
import { generatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Narudžbe Telefonom i Mailom",
  description:
    "Naručite Maksuz proizvode telefonom ili emailom. Kontakt informacije, radno vrijeme i upute za telefonsku narudžbu.",
  path: "/pomoc/narucivanje-telefonom",
  keywords: ["naručivanje telefonom", "telefonska narudžba", "email narudžba", "kontakt", "radno vrijeme"],
});

export default function NarucivanjeTelefonomPage() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <HeroSection image="/image4.svg" className="h-[300px] md:h-[400px]">
        <div className="relative flex-1 flex items-center z-10">
          <Hero
            headTitle="Naručite Direktno"
            title="Narudžbe Telefonom i Mailom"
            textCenter
          />
        </div>
      </HeroSection>

      {/* Contact Options */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <p className="text-center text-lg text-gray-600 mb-12">
              Preferirate naručiti telefonom ili emailom? Naš tim je tu za vas!
              Narudžbe zaprimamo svakim radnim danom.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* Phone */}
              <div className="bg-brand-cream/50 p-8 rounded-2xl text-center">
                <div className="w-20 h-20 bg-brand-orange rounded-full flex items-center justify-center mx-auto mb-6">
                  <Phone className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Telefon</h3>
                <a
                  href="tel:+38762200088"
                  className="text-3xl font-bold text-brand-orange hover:underline block mb-4"
                >
                  +387 62 200 088
                </a>
                <p className="text-gray-600">
                  Pozovite nas direktno za brzu narudžbu ili konsultacije.
                </p>
              </div>

              {/* Email */}
              <div className="bg-brand-cream/50 p-8 rounded-2xl text-center">
                <div className="w-20 h-20 bg-brand-orange rounded-full flex items-center justify-center mx-auto mb-6">
                  <Mail className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Email</h3>
                <a
                  href="mailto:info@maksuz.ba"
                  className="text-2xl font-bold text-brand-orange hover:underline block mb-4"
                >
                  info@maksuz.ba
                </a>
                <p className="text-gray-600">
                  Pošaljite nam email sa vašom narudžbom ili upitom.
                </p>
              </div>
            </div>

            {/* Working Hours */}
            <div className="bg-gray-50 p-8 rounded-2xl mb-12">
              <div className="flex items-center gap-3 mb-6">
                <Clock className="w-8 h-8 text-brand-orange" />
                <h3 className="text-xl font-bold">Radno Vrijeme</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex justify-between p-3 bg-white rounded-lg">
                  <span className="font-medium">Ponedjeljak - Petak</span>
                  <span className="text-brand-orange font-bold">08:00 - 17:00</span>
                </div>
                <div className="flex justify-between p-3 bg-white rounded-lg">
                  <span className="font-medium">Subota</span>
                  <span className="text-brand-orange font-bold">09:00 - 14:00</span>
                </div>
                <div className="flex justify-between p-3 bg-white rounded-lg md:col-span-2">
                  <span className="font-medium">Nedjelja</span>
                  <span className="text-gray-500">Zatvoreno</span>
                </div>
              </div>
            </div>

            {/* What to Include */}
            <div className="bg-white border border-gray-200 p-8 rounded-2xl">
              <div className="flex items-center gap-3 mb-6">
                <MessageCircle className="w-8 h-8 text-brand-orange" />
                <h3 className="text-xl font-bold">Šta Navesti Prilikom Narudžbe</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-brand-orange text-white rounded-full flex items-center justify-center text-sm flex-shrink-0">
                    1
                  </span>
                  <span>Ime i prezime</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-brand-orange text-white rounded-full flex items-center justify-center text-sm flex-shrink-0">
                    2
                  </span>
                  <span>Kontakt telefon</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-brand-orange text-white rounded-full flex items-center justify-center text-sm flex-shrink-0">
                    3
                  </span>
                  <span>Adresa za dostavu (ulica, broj, grad, poštanski broj)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-brand-orange text-white rounded-full flex items-center justify-center text-sm flex-shrink-0">
                    4
                  </span>
                  <span>Proizvodi koje želite naručiti (naziv i količina)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-brand-orange text-white rounded-full flex items-center justify-center text-sm flex-shrink-0">
                    5
                  </span>
                  <span>Način plaćanja (pouzeće, kartica, transfer)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-brand-cream">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">
              Preferirate Online Kupovinu?
            </h2>
            <p className="text-muted-foreground mb-8">
              Posjetite naš webshop za jednostavnu kupovinu iz udobnosti vašeg doma.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-brand-orange hover:bg-brand-orange/90"
            >
              <Link href="/shop">Posjeti Webshop</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
