import { Metadata } from "next";
import Link from "next/link";
import { Shield, Phone, Mail } from "lucide-react";
import { HeroSection, Hero } from "@/components/sections";
import { Button } from "@/components/ui/button";
import { generatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Pravila Privatnosti",
  description:
    "Pravila privatnosti i zaštite podataka na Maksuz webshopu. Saznajte kako prikupljamo, koristimo i štitimo vaše osobne podatke.",
  path: "/pomoc/privatnost",
  keywords: ["privatnost", "zaštita podataka", "GDPR", "kolačići", "cookies", "pravila"],
});

export default function PrivatnostPage() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <HeroSection image="/image4.svg" className="h-[300px] md:h-[400px]">
        <div className="relative flex-1 flex items-center z-10">
          <Hero
            headTitle="Vaša Privatnost"
            title="Pravila Privatnosti"
            textCenter
          />
        </div>
      </HeroSection>

      {/* Content */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto prose prose-lg">
            <div className="flex items-center gap-3 mb-8">
              <Shield className="w-8 h-8 text-brand-orange" />
              <p className="text-sm text-gray-500 m-0">
                Posljednje ažuriranje: Januar 2024.
              </p>
            </div>

            <h2>1. Uvod</h2>
            <p>
              Maksuz D.O.O. (u daljnjem tekstu: &quot;mi&quot;, &quot;nas&quot; ili &quot;Maksuz&quot;)
              poštuje vašu privatnost i posvećen je zaštiti vaših osobnih
              podataka. Ova Pravila privatnosti objašnjavaju kako prikupljamo,
              koristimo, obrađujemo i štitimo vaše podatke kada koristite našu
              web stranicu maksuz.ba.
            </p>

            <h2>2. Podaci Koje Prikupljamo</h2>
            <p>Možemo prikupljati sljedeće vrste podataka:</p>
            
            <h3>2.1 Podaci koje nam direktno dajete</h3>
            <ul>
              <li>Ime i prezime</li>
              <li>Email adresa</li>
              <li>Broj telefona</li>
              <li>Adresa za dostavu</li>
              <li>Podaci za plaćanje</li>
              <li>Informacije o narudžbama</li>
            </ul>

            <h3>2.2 Automatski prikupljeni podaci</h3>
            <ul>
              <li>IP adresa</li>
              <li>Tip preglednika i uređaja</li>
              <li>Stranice koje posjećujete</li>
              <li>Vrijeme posjete</li>
              <li>Kolačići (cookies)</li>
            </ul>

            <h2>3. Kako Koristimo Vaše Podatke</h2>
            <p>Vaše podatke koristimo za:</p>
            <ul>
              <li>Obradu i isporuku narudžbi</li>
              <li>Komunikaciju vezanu za narudžbe</li>
              <li>Poboljšanje naših usluga</li>
              <li>Slanje promotivnih materijala (uz vašu saglasnost)</li>
              <li>Odgovaranje na vaše upite</li>
              <li>Ispunjavanje zakonskih obaveza</li>
            </ul>

            <h2>4. Kolačići (Cookies)</h2>
            <p>
              Naša web stranica koristi kolačiće za poboljšanje korisničkog
              iskustva. Kolačići su male tekstualne datoteke koje se pohranjuju
              na vašem uređaju.
            </p>
            <p>Koristimo sljedeće vrste kolačića:</p>
            <ul>
              <li>
                <strong>Neophodni kolačići:</strong> Potrebni za funkcioniranje
                stranice
              </li>
              <li>
                <strong>Analitički kolačići:</strong> Pomažu nam razumjeti kako
                koristite stranicu
              </li>
              <li>
                <strong>Marketinški kolačići:</strong> Koriste se za
                prilagođavanje oglasa
              </li>
            </ul>
            <p>
              Možete upravljati postavkama kolačića putem vašeg preglednika.
            </p>

            <h2>5. Dijeljenje Podataka</h2>
            <p>
              Vaše podatke ne prodajemo trećim stranama. Možemo dijeliti podatke
              sa:
            </p>
            <ul>
              <li>Kurirskim službama (za dostavu)</li>
              <li>Pružateljima platnih usluga</li>
              <li>IT pružateljima usluga</li>
              <li>Državnim organima (kada je zakonom propisano)</li>
            </ul>

            <h2>6. Sigurnost Podataka</h2>
            <p>
              Primjenjujemo tehničke i organizacijske mjere za zaštitu vaših
              podataka, uključujući:
            </p>
            <ul>
              <li>SSL enkripciju za prijenos podataka</li>
              <li>Sigurno pohranjivanje podataka</li>
              <li>Ograničen pristup podacima</li>
              <li>Redovne sigurnosne provjere</li>
            </ul>

            <h2>7. Vaša Prava</h2>
            <p>Imate pravo na:</p>
            <ul>
              <li>Pristup vašim podacima</li>
              <li>Ispravak netočnih podataka</li>
              <li>Brisanje podataka (&quot;pravo na zaborav&quot;)</li>
              <li>Ograničenje obrade</li>
              <li>Prijenos podataka</li>
              <li>Prigovor na obradu</li>
              <li>Povlačenje saglasnosti</li>
            </ul>
            <p>
              Za ostvarivanje svojih prava, kontaktirajte nas putem emaila:
              info@maksuz.ba
            </p>

            <h2>8. Zadržavanje Podataka</h2>
            <p>
              Vaše podatke čuvamo onoliko dugo koliko je potrebno za ispunjenje
              svrha za koje su prikupljeni, uključujući ispunjavanje zakonskih
              obaveza.
            </p>

            <h2>9. Izmjene Pravila Privatnosti</h2>
            <p>
              Zadržavamo pravo izmjene ovih Pravila privatnosti. O značajnim
              izmjenama ćemo vas obavijestiti putem email-a ili obavijesti na
              web stranici.
            </p>

            <h2>10. Kontakt</h2>
            <p>
              Za sva pitanja vezana za privatnost i zaštitu podataka, možete nas
              kontaktirati:
            </p>
            <ul>
              <li><strong>Email:</strong> info@maksuz.ba</li>
              <li><strong>Telefon:</strong> +387 61 399 366</li>
              <li>
                <strong>Adresa:</strong> Hamdije Čemerlića 49, 71000 Sarajevo,
                BiH
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-brand-cream">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Imate Pitanja o Privatnosti?</h2>
            <p className="text-muted-foreground mb-8">
              Vaša privatnost nam je važna. Kontaktirajte nas za bilo kakva pitanja.
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
