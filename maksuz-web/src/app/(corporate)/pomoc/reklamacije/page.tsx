import { Metadata } from "next";
import Link from "next/link";
import { RotateCcw, Package, Clock, CheckCircle, XCircle, AlertCircle, Phone, Mail } from "lucide-react";
import { HeroSection, Hero } from "@/components/sections";
import { Button } from "@/components/ui/button";
import { generatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Reklamacije i Povrat",
  description:
    "Politika povrata i reklamacija na Maksuz webshopu. 14 dana za povrat proizvoda. Uvjeti, postupak i adresa za povrat.",
  path: "/pomoc/reklamacije",
  keywords: ["reklamacije", "povrat", "zamjena", "refund", "povrat novca", "14 dana"],
});

const returnSteps = [
  {
    icon: Mail,
    title: "1. Kontaktirajte Nas",
    description:
      "Javite nam se putem emaila ili telefona u roku od 14 dana od primitka narudžbe. Opišite razlog povrata.",
  },
  {
    icon: Package,
    title: "2. Zapakirajte Proizvod",
    description:
      "Proizvod mora biti u originalnom pakiranju, nekorišten i sa svom dokumentacijom. Priložite račun.",
  },
  {
    icon: RotateCcw,
    title: "3. Pošaljite Nam",
    description:
      "Pošaljite proizvod na našu adresu ili ga dostavite osobno u jednu od naših poslovnica.",
  },
  {
    icon: CheckCircle,
    title: "4. Povrat Novca",
    description:
      "Nakon provjere proizvoda, izvršit ćemo povrat novca u roku od 14 dana na isti način plaćanja.",
  },
];

export default function ReklamacijePage() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <HeroSection image="/image4.svg" className="h-[300px] md:h-[400px]">
        <div className="relative flex-1 flex items-center z-10">
          <Hero headTitle="Politika Povrata" title="Reklamacije i Povrat" textCenter />
        </div>
      </HeroSection>

      {/* Return Policy */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-brand-cream/50 p-6 md:p-8 rounded-2xl mb-12">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Clock className="w-6 h-6 text-brand-orange" />
                14 Dana za Povrat
              </h2>
              <p className="text-gray-600">
                U skladu sa Zakonom o zaštiti potrošača, imate pravo na povrat proizvoda
                u roku od 14 dana od dana primitka, bez navođenja razloga. Proizvod mora
                biti nekorišten i u originalnom pakiranju.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-center mb-8">Kako Vratiti Proizvod</h2>

            <div className="space-y-6">
              {returnSteps.map((step, index) => (
                <div
                  key={index}
                  className="flex gap-6 items-start p-6 bg-gray-50 rounded-2xl"
                >
                  <div className="w-14 h-14 bg-brand-orange rounded-full flex items-center justify-center flex-shrink-0">
                    <step.icon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Conditions */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">Uvjeti za Povrat</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  Prihvatljivo za Povrat
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Neotvoreni proizvodi u originalnom pakiranju</li>
                  <li>• Proizvodi sa svim etiketama i oznakama</li>
                  <li>• Proizvodi sa računom ili dokazom o kupovini</li>
                  <li>• Zamjena za istu ili drugu vrijednost</li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-xl">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-red-600">
                  <XCircle className="w-5 h-5" />
                  Nije Moguće Vratiti
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Otvoreni prehrambeni proizvodi</li>
                  <li>• Proizvodi kojima je istekao rok</li>
                  <li>• Proizvodi bez originalnog pakiranja</li>
                  <li>• Personalizirani/brendirani pokloni</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Damaged Products */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-yellow-50 border border-yellow-200 p-6 md:p-8 rounded-2xl">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
                Oštećeni ili Pogrešni Proizvodi
              </h2>
              <p className="text-gray-700 mb-4">
                Ako ste primili oštećen proizvod ili proizvod koji niste naručili,
                molimo vas da nas kontaktirate u roku od 48 sati od primitka pošiljke.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>• Fotografirajte oštećenje ili pogrešan proizvod</li>
                <li>• Sačuvajte originalno pakiranje</li>
                <li>• Pošaljite nam slike na email</li>
                <li>• Organizirat ćemo zamjenu ili povrat bez troškova</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Return Address */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">Adresa za Povrat</h2>

            <div className="bg-white p-6 md:p-8 rounded-2xl text-center">
              <p className="font-bold text-lg">Maksuz D.O.O.</p>
              <p className="text-gray-600">Hamdije Čemerlića 49</p>
              <p className="text-gray-600">71000 Sarajevo</p>
              <p className="text-gray-600">Bosna i Hercegovina</p>
              <p className="text-sm text-gray-500 mt-4">
                * Na pošiljci navedite &quot;POVRAT&quot; i broj narudžbe
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-brand-cream">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <RotateCcw className="w-12 h-12 text-brand-orange mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Trebate Pomoć s Povratom?</h2>
            <p className="text-muted-foreground mb-8">
              Naš tim za podršku kupcima je tu da vam pomogne s procesom povrata
              i odgovori na sva vaša pitanja.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-brand-orange hover:bg-brand-orange/90"
              >
                <Link href="/kontakt">
                  <Mail className="w-4 h-4 mr-2" />
                  Pošaljite Upit
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
