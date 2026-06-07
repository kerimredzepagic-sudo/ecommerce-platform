import { Metadata } from "next";
import Link from "next/link";
import { ShoppingCart, Search, CreditCard, Truck, CheckCircle, Phone, Mail } from "lucide-react";
import { HeroSection, Hero } from "@/components/sections";
import { Button } from "@/components/ui/button";
import { generatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Kako Naručiti",
  description:
    "Vodič za naručivanje na Maksuz webshopu. Jednostavni koraci za brzu i sigurnu kupovinu prirodnih proizvoda sa dostavom širom BiH.",
  path: "/pomoc/kako-naruciti",
  keywords: ["kako naručiti", "kupovina", "vodič", "korpa", "plaćanje", "narudžba"],
});

const steps = [
  {
    icon: Search,
    title: "1. Pronađite Proizvod",
    description:
      "Pretražite našu ponudu proizvoda putem kategorija ili korištenjem pretrage. Kliknite na proizvod za više detalja.",
  },
  {
    icon: ShoppingCart,
    title: "2. Dodajte u Korpu",
    description:
      "Odaberite količinu i kliknite 'Dodaj u korpu'. Možete nastaviti kupovinu ili preći na plaćanje.",
  },
  {
    icon: CreditCard,
    title: "3. Popunite Podatke",
    description:
      "Unesite podatke za dostavu i odaberite način plaćanja. Registrirani korisnici imaju automatski popunjene podatke.",
  },
  {
    icon: CheckCircle,
    title: "4. Potvrdite Narudžbu",
    description:
      "Pregledajte narudžbu i kliknite 'Potvrdi'. Primićete email potvrdu sa detaljima narudžbe.",
  },
  {
    icon: Truck,
    title: "5. Pratite Dostavu",
    description:
      "Nakon otpreme, primićete broj za praćenje. Očekujte dostavu u roku od 2-4 radna dana.",
  },
];

export default function KakoNarucitiPage() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <HeroSection image="/image4.svg" className="h-[300px] md:h-[400px]">
        <div className="relative flex-1 flex items-center z-10">
          <Hero
            headTitle="Vodič za Kupovinu"
            title="Kako Naručiti"
            textCenter
          />
        </div>
      </HeroSection>

      {/* Steps Section */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <p className="text-center text-lg text-gray-600 mb-12">
              Naručivanje na Maksuz webshopu je jednostavno i sigurno. Slijedite
              ove korake za brzu i laku kupovinu.
            </p>

            <div className="space-y-8">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="flex gap-6 items-start p-6 bg-brand-cream/50 rounded-2xl"
                >
                  <div className="w-16 h-16 bg-brand-orange rounded-full flex items-center justify-center flex-shrink-0">
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Additional Info */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">
              Dodatne Informacije
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="font-bold text-lg mb-3">Minimalna Narudžba</h3>
                <p className="text-gray-600">
                  Nema minimalne vrijednosti narudžbe. Naručite koliko god želite!
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="font-bold text-lg mb-3">Besplatna Dostava</h3>
                <p className="text-gray-600">
                  Za narudžbe iznad 50 KM dostava je potpuno besplatna.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="font-bold text-lg mb-3">Načini Plaćanja</h3>
                <p className="text-gray-600">
                  Plaćanje pouzećem, karticom ili bankovnim transferom.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="font-bold text-lg mb-3">Registracija</h3>
                <p className="text-gray-600">
                  Nije obavezna, ali omogućava praćenje narudžbi i brže kupovine.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-brand-cream">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Spremni za Kupovinu?</h2>
            <p className="text-muted-foreground mb-8">
              Posjetite naš webshop i pronađite prirodne proizvode za sebe i
              svoje najbliže.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-brand-orange hover:bg-brand-orange/90"
              >
                <Link href="/shop">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Posjeti Webshop
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/pomoc/narucivanje-telefonom">
                  <Phone className="w-4 h-4 mr-2" />
                  Naruči Telefonom
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
