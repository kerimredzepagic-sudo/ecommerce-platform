import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { CreditCard, Banknote, Building2, Shield, CheckCircle, Phone, Mail } from "lucide-react";
import { HeroSection, Hero } from "@/components/sections";
import { Button } from "@/components/ui/button";
import { generatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Sigurno Plaćanje",
  description:
    "Sigurni načini plaćanja na Maksuz webshopu. Kartice (Visa, Mastercard), plaćanje pouzećem i bankovni transfer. SSL zaštita i 3D Secure.",
  path: "/pomoc/sigurno-placanje",
  keywords: ["sigurno plaćanje", "kartice", "visa", "mastercard", "pouzeće", "bankovni transfer", "ssl"],
});

const paymentMethods = [
  {
    icon: CreditCard,
    title: "Plaćanje Karticom",
    description:
      "Prihvatamo sve glavne kreditne i debitne kartice uključujući Visa, Mastercard i Maestro. Sve transakcije su zaštićene SSL enkripcijom i obrađuju se putem sigurnog platnog procesora.",
    features: ["Visa", "Mastercard", "Maestro", "American Express"],
  },
  {
    icon: Banknote,
    title: "Plaćanje Pouzećem",
    description:
      "Platite gotovinom prilikom preuzimanja paketa od kurira. Ovo je najpopularnija metoda plaćanja među našim kupcima u Bosni i Hercegovini.",
    features: ["Plaćanje kuriru", "Gotovina", "Bez dodatnih naknada"],
  },
  {
    icon: Building2,
    title: "Bankovni Transfer",
    description:
      "Uplatite na naš račun prije isporuke. Idealno za pravna lica i veće narudžbe. Narudžba se obrađuje nakon što primimo uplatu.",
    features: ["Za pravna lica", "Račun na fakturi", "Rok plaćanja 15 dana"],
  },
];

export default function SigurnoPlacanjePage() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <HeroSection image="/image4.svg" className="h-[300px] md:h-[400px]">
        <div className="relative flex-1 flex items-center z-10">
          <Hero headTitle="Načini Plaćanja" title="Sigurno Plaćanje" textCenter />
        </div>
      </HeroSection>

      {/* Payment Methods */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <p className="text-center text-lg text-gray-600 mb-12">
              Nudimo više načina plaćanja kako bismo vam omogućili da odaberete
              onaj koji vam najviše odgovara. Sve metode plaćanja su potpuno sigurne.
            </p>

            <div className="space-y-8">
              {paymentMethods.map((method, index) => (
                <div
                  key={index}
                  className="p-6 md:p-8 bg-brand-cream/50 rounded-2xl border border-brand-orange/10"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-16 h-16 bg-brand-orange rounded-full flex items-center justify-center flex-shrink-0">
                      <method.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-3">{method.title}</h3>
                      <p className="text-gray-600 mb-4">{method.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {method.features.map((feature, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-white rounded-full text-sm text-gray-700 border border-gray-200"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Security Badges */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">
              Sigurnosne Garancije
            </h2>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                <Shield className="w-10 h-10 text-brand-orange mx-auto mb-4" />
                <h3 className="font-bold mb-2">SSL Zaštita</h3>
                <p className="text-sm text-gray-600">
                  256-bit SSL enkripcija za sve transakcije
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-4" />
                <h3 className="font-bold mb-2">PCI DSS</h3>
                <p className="text-sm text-gray-600">
                  Usklađenost sa standardima sigurnosti plaćanja
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                <CreditCard className="w-10 h-10 text-blue-500 mx-auto mb-4" />
                <h3 className="font-bold mb-2">3D Secure</h3>
                <p className="text-sm text-gray-600">
                  Dodatna autentifikacija za kartične transakcije
                </p>
              </div>
            </div>

            {/* Accepted Payment Logos */}
            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <h3 className="text-xl font-bold text-center mb-6">Prihvaćeni Načini Plaćanja</h3>
              <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 mb-6">
                <a href="https://www.visa.com" target="_blank" rel="noopener noreferrer" className="bg-gray-50 rounded-lg p-3 h-12 flex items-center hover:shadow-lg transition-shadow">
                  <Image src="/maksuz_payments/visa.svg" alt="Visa" width={60} height={40} className="h-8 w-auto object-contain" />
                </a>
                <a href="https://www.mastercard.com" target="_blank" rel="noopener noreferrer" className="bg-gray-50 rounded-lg p-3 h-12 flex items-center hover:shadow-lg transition-shadow">
                  <Image src="/maksuz_payments/mastercard.svg" alt="Mastercard" width={60} height={40} className="h-8 w-auto object-contain" />
                </a>
                <a href="https://www.mastercard.com" target="_blank" rel="noopener noreferrer" className="bg-gray-50 rounded-lg p-3 h-12 flex items-center hover:shadow-lg transition-shadow">
                  <Image src="/maksuz_payments/maestro.svg" alt="Maestro" width={60} height={40} className="h-8 w-auto object-contain" />
                </a>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <h4 className="text-sm font-semibold text-gray-500 text-center mb-4">Sigurnosne Verifikacije</h4>
                <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6">
                  <a href="https://www.visa.com" target="_blank" rel="noopener noreferrer" className="bg-gray-50 rounded-lg p-3 h-12 flex items-center hover:shadow-lg transition-shadow">
                    <Image src="/maksuz_payments/visa-secure.svg" alt="Visa Secure" width={60} height={40} className="h-8 w-auto object-contain" />
                  </a>
                  <a href="https://www.mastercard.com" target="_blank" rel="noopener noreferrer" className="bg-gray-50 rounded-lg p-3 h-12 flex items-center hover:shadow-lg transition-shadow">
                    <Image src="/maksuz_payments/ID-check.svg" alt="Mastercard ID Check" width={60} height={40} className="h-8 w-auto object-contain" />
                  </a>
                  <a href="https://monri.com" target="_blank" rel="noopener noreferrer" className="bg-gray-50 rounded-lg p-3 h-12 flex items-center hover:shadow-lg transition-shadow">
                    <Image src="/maksuz_payments/pay-web-monri.svg" alt="Monri Payment Processor" width={80} height={40} className="h-8 w-auto object-contain" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bank Info */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">
              Podaci za Uplatu
            </h2>

            <div className="bg-brand-cream/50 p-6 md:p-8 rounded-2xl">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Naziv firme</p>
                  <p className="font-bold">Maksuz D.O.O. Sarajevo</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Banka</p>
                  <p className="font-bold">Raiffeisen Bank BiH</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Transakcijski račun</p>
                  <p className="font-bold font-mono">1610000123456789</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">ID broj</p>
                  <p className="font-bold">4123456789012</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-6">
                * U svrhu uplate navedite broj narudžbe koji ćete dobiti nakon završetka kupovine.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-brand-cream">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <CreditCard className="w-12 h-12 text-brand-orange mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Imate Pitanja o Plaćanju?</h2>
            <p className="text-muted-foreground mb-8">
              Kontaktirajte nas ako imate bilo kakvih pitanja o načinima plaćanja
              ili trebate pomoć s narudžbom.
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
