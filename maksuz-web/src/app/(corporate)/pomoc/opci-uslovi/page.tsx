import { Metadata } from "next";
import Link from "next/link";
import { FileText, Phone, Mail } from "lucide-react";
import { HeroSection, Hero } from "@/components/sections";
import { Button } from "@/components/ui/button";
import { generatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Opći Uslovi Poslovanja",
  description:
    "Opći uslovi poslovanja Maksuz webshopa. Pravila kupovine, prava i obaveze kupaca i prodavca, dostava, plaćanje i reklamacije.",
  path: "/pomoc/opci-uslovi",
  keywords: ["opći uslovi", "uvjeti poslovanja", "pravila", "prava kupaca", "zakon o zaštiti potrošača"],
});

export default function OpciUsloviPage() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <HeroSection image="/image4.svg" className="h-[300px] md:h-[400px]">
        <div className="relative flex-1 flex items-center z-10">
          <Hero
            headTitle="Pravne Informacije"
            title="Opći Uslovi Poslovanja"
            textCenter
          />
        </div>
      </HeroSection>

      {/* Content */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto prose prose-lg">
            <div className="flex items-center gap-3 mb-8">
              <FileText className="w-8 h-8 text-brand-orange" />
              <p className="text-sm text-gray-500 m-0">
                Posljednje ažuriranje: Januar 2024.
              </p>
            </div>

            <h2>1. Opće Odredbe</h2>
            <p>
              Ovi Opći uslovi poslovanja (u daljnjem tekstu: Uslovi) reguliraju
              odnose između Maksuz D.O.O. (u daljnjem tekstu: Prodavac) i kupaca
              (u daljnjem tekstu: Kupac) koji koriste web stranicu maksuz.ba
              za kupovinu proizvoda.
            </p>
            <p>
              Korištenjem web stranice i kupovinom proizvoda, Kupac potvrđuje
              da je upoznat sa ovim Uslovima i da ih u cijelosti prihvata.
            </p>

            <h2>2. Informacije o Prodavcu</h2>
            <ul>
              <li><strong>Naziv:</strong> Maksuz D.O.O.</li>
              <li><strong>Adresa:</strong> Hamdije Čemerlića 49, 71000 Sarajevo, BiH</li>
              <li><strong>ID broj:</strong> 4202123456789</li>
              <li><strong>PDV broj:</strong> 202123456789</li>
              <li><strong>Email:</strong> info@maksuz.ba</li>
              <li><strong>Telefon:</strong> +387 61 399 366</li>
            </ul>

            <h2>3. Proizvodi i Cijene</h2>
            <p>
              Svi proizvodi prikazani na web stranici su dostupni dok traju
              zalihe. Cijene su izražene u konvertibilnim markama (KM) i
              uključuju PDV. Prodavac zadržava pravo izmjene cijena bez
              prethodne najave.
            </p>
            <p>
              Slike proizvoda su ilustrativne prirode i mogu se neznatno
              razlikovati od stvarnog izgleda proizvoda.
            </p>

            <h2>4. Naručivanje</h2>
            <p>
              Naručivanje se vrši putem web stranice maksuz.ba, telefonom ili
              emailom. Nakon zaprimanja narudžbe, Kupac će primiti potvrdu
              putem emaila sa detaljima narudžbe.
            </p>
            <p>
              Prodavac zadržava pravo odbijanja narudžbe u slučaju:
            </p>
            <ul>
              <li>Nedostupnosti proizvoda</li>
              <li>Greške u cijenama</li>
              <li>Nemogućnosti verifikacije podataka Kupca</li>
              <li>Sumnje na zloupotrebu</li>
            </ul>

            <h2>5. Plaćanje</h2>
            <p>Prihvaćeni načini plaćanja:</p>
            <ul>
              <li>Plaćanje pouzećem (gotovina kuriru)</li>
              <li>Bankovna transakcija</li>
              <li>Kreditne/debitne kartice (Visa, Mastercard)</li>
              <li>Plaćanje po fakturi (za pravna lica)</li>
            </ul>

            <h2>6. Dostava</h2>
            <p>
              Dostava se vrši na području Bosne i Hercegovine. Cijena dostave
              iznosi 7 KM, a za narudžbe iznad 50 KM dostava je besplatna.
              Očekivano vrijeme dostave je 2-4 radna dana.
            </p>

            <h2>7. Pravo na Odustajanje</h2>
            <p>
              Kupac ima pravo odustati od ugovora u roku od 14 dana od dana
              preuzimanja proizvoda, bez navođenja razloga. Proizvod mora biti
              vraćen u originalnom stanju i ambalaži.
            </p>
            <p>
              Troškove povrata snosi Kupac, osim u slučaju neispravnog ili
              pogrešno isporučenog proizvoda.
            </p>

            <h2>8. Reklamacije</h2>
            <p>
              U slučaju neispravnosti proizvoda, Kupac ima pravo na reklamaciju
              u skladu sa Zakonom o zaštiti potrošača. Reklamacije se podnose
              putem emaila ili telefona.
            </p>

            <h2>9. Zaštita Podataka</h2>
            <p>
              Prodavac se obavezuje da će sve osobne podatke Kupca čuvati kao
              poslovnu tajnu i koristiti isključivo u svrhu izvršenja narudžbe.
              Detaljne informacije dostupne su u{" "}
              <Link href="/pomoc/privatnost" className="text-brand-orange hover:underline">
                Pravilima privatnosti
              </Link>
              .
            </p>

            <h2>10. Završne Odredbe</h2>
            <p>
              Prodavac zadržava pravo izmjene ovih Uslova. Sve izmjene stupaju
              na snagu danom objave na web stranici. Za sve sporove nadležan je
              sud u Sarajevu.
            </p>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-brand-cream">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Imate Pitanja?</h2>
            <p className="text-muted-foreground mb-8">
              Kontaktirajte nas ako vam je potrebna dodatna pomoć ili pojašnjenje.
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
