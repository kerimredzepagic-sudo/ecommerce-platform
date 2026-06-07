import { Metadata } from "next";
import Link from "next/link";
import { Shield, Lock, Eye, Server, CheckCircle, Phone, Mail } from "lucide-react";
import { HeroSection, Hero } from "@/components/sections";
import { Button } from "@/components/ui/button";
import { generatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Sigurnost",
  description:
    "Sigurnost vaših podataka i transakcija na Maksuz webshopu. SSL enkripcija, PCI DSS standardi i zaštita privatnosti.",
  path: "/pomoc/sigurnost",
  keywords: ["sigurnost", "ssl", "enkripcija", "zaštita podataka", "sigurna kupovina", "privatnost"],
});

const securityFeatures = [
  {
    icon: Lock,
    title: "SSL Enkripcija",
    description:
      "Svi podaci koji se prenose između vašeg uređaja i naših servera zaštićeni su SSL/TLS enkripcijom. Vaši osobni podaci i informacije o plaćanju su potpuno sigurni.",
  },
  {
    icon: Shield,
    title: "Sigurno Plaćanje",
    description:
      "Koristimo renomirane platne procesore koji ispunjavaju PCI DSS standarde. Vaši podaci o kartici nikada se ne pohranjuju na našim serverima.",
  },
  {
    icon: Eye,
    title: "Privatnost Podataka",
    description:
      "Vaši osobni podaci koriste se isključivo za obradu narudžbi i komunikaciju s vama. Nikada ne prodajemo niti dijelimo vaše podatke s trećim stranama.",
  },
  {
    icon: Server,
    title: "Sigurni Serveri",
    description:
      "Naši serveri nalaze se u sigurnim data centrima sa 24/7 nadzorom, redundantnim napajanjem i redovitim sigurnosnim kopijama.",
  },
];

export default function SigurnostPage() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <HeroSection image="/image4.svg" className="h-[300px] md:h-[400px]">
        <div className="relative flex-1 flex items-center z-10">
          <Hero headTitle="Vaša Sigurnost" title="Sigurnost na Prvom Mjestu" textCenter />
        </div>
      </HeroSection>

      {/* Main Content */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <p className="text-center text-lg text-gray-600 mb-12">
              U Maksuz-u sigurnost vaših podataka tretiramo s najvećom ozbiljnošću.
              Implementirali smo brojne mjere kako bismo osigurali da vaša kupovina
              bude potpuno sigurna.
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              {securityFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="p-6 bg-brand-cream/50 rounded-2xl border border-brand-orange/10"
                >
                  <div className="w-12 h-12 bg-brand-orange rounded-full flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Commitment Section */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">
              Naša Obaveza Prema Vama
            </h2>

            <div className="space-y-4">
              {[
                "Nikada ne pohranjujemo podatke o vašoj kreditnoj kartici",
                "Koristimo najnovije sigurnosne protokole i standarde",
                "Redovno ažuriramo i testiramo naše sigurnosne sustave",
                "Omogućavamo siguran pristup vašem računu putem lozinke",
                "Šaljemo potvrde o svakoj transakciji na vaš email",
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3 bg-white p-4 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
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
            <Shield className="w-12 h-12 text-brand-orange mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Imate Pitanja o Sigurnosti?</h2>
            <p className="text-muted-foreground mb-8">
              Naš tim je tu da odgovori na sva vaša pitanja vezana za sigurnost
              i zaštitu podataka.
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
