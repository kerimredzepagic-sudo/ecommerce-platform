import { Metadata } from "next";
import Link from "next/link";
import { HelpCircle, MessageCircle, Phone, Mail } from "lucide-react";
import { HeroSection, Hero } from "@/components/sections";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { generatePageMetadata, generateFAQSchema } from "@/lib/seo";
import { JsonLd } from "@/components/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Česta Pitanja (FAQ)",
  description:
    "Odgovori na najčešće postavljena pitanja o Maksuz proizvodima, narudžbama, dostavi, plaćanju i api terapiji.",
  path: "/faq",
  keywords: ["faq", "česta pitanja", "pomoć", "podrška", "narudžbe", "dostava", "plaćanje"],
});

const faqCategories = [
  {
    category: "Narudžbe i Plaćanje",
    questions: [
      {
        question: "Kako mogu naručiti proizvode?",
        answer:
          "Proizvode možete naručiti putem našeg webshopa na maksuz.ba/shop. Jednostavno dodajte željene proizvode u košaricu, popunite podatke za dostavu i odaberite način plaćanja. Narudžbu možete izvršiti i telefonom na broj +387 33 123 456.",
      },
      {
        question: "Koji su načini plaćanja?",
        answer:
          "Prihvatamo plaćanje pouzećem (gotovina kuriru), bankovnim transferom i kreditnim/debitnim karticama (Visa, Mastercard). Za pravna lica nudimo i plaćanje po fakturi sa rokom od 15 dana.",
      },
      {
        question: "Mogu li otkazati narudžbu?",
        answer:
          "Narudžbu možete otkazati besplatno dok god nije otpremljena. Kontaktirajte nas putem emaila ili telefona što prije. Nakon otpreme, narudžba se može vratiti prema našoj politici povrata.",
      },
      {
        question: "Koliko traje obrada narudžbe?",
        answer:
          "Narudžbe obrađujemo u roku od 24 sata radnim danima. Tokom vikenda i praznika, narudžbe se obrađuju prvog sljedećeg radnog dana.",
      },
    ],
  },
  {
    category: "Dostava",
    questions: [
      {
        question: "Kolika je cijena dostave?",
        answer:
          "Dostava je besplatna za narudžbe iznad 50 KM. Za narudžbe manje vrijednosti, cijena dostave iznosi 7 KM za teritoriju BiH.",
      },
      {
        question: "Koliko traje dostava?",
        answer:
          "Standardna dostava traje 2-4 radna dana za cijelu BiH. Za područje Sarajeva i okolice, moguća je i dostava sljedećeg radnog dana.",
      },
      {
        question: "Da li dostavljate van BiH?",
        answer:
          "Trenutno dostavljamo samo na području Bosne i Hercegovine. Radimo na proširenju na susjedne zemlje. Za veće narudžbe iz inostranstva, kontaktirajte nas direktno.",
      },
      {
        question: "Mogu li pratiti svoju pošiljku?",
        answer:
          "Da, nakon otpreme narudžbe dobićete email sa brojem za praćenje pošiljke. Status možete pratiti na stranici kurirske službe.",
      },
    ],
  },
  {
    category: "Proizvodi",
    questions: [
      {
        question: "Jesu li vaši proizvodi 100% prirodni?",
        answer:
          "Da, svi naši proizvodi su 100% prirodni, bez umjetnih aditiva, konzervansa i pojačivača ukusa. Koristimo samo domaće sirovine najviše kvalitete.",
      },
      {
        question: "Koji je rok trajanja proizvoda?",
        answer:
          "Rok trajanja varira ovisno o proizvodu. Med ima rok od 2 godine, pekmezi i sirupi 1 godinu, a suho voće i orašasti plodovi 6-12 mjeseci. Tačan rok trajanja naveden je na svakom proizvodu.",
      },
      {
        question: "Kako čuvati proizvode?",
        answer:
          "Većinu proizvoda čuvajte na suhom i tamnom mjestu, na sobnoj temperaturi. Med nikada ne stavljajte u frižider. Nakon otvaranja, pekmeze i sirupe čuvajte u frižideru.",
      },
      {
        question: "Da li imate proizvode bez šećera?",
        answer:
          "Da, imamo širok asortiman proizvoda bez dodanog šećera, uključujući pekmeze, namaze od hurme i 100% voćne sokove. Pogledajte našu Health liniju proizvoda.",
      },
    ],
  },
  {
    category: "Korporativni Pokloni",
    questions: [
      {
        question: "Da li nudite korporativne poklon pakete?",
        answer:
          "Da, imamo široku ponudu poklon paketa prilagođenih za poslovne potrebe. Nudimo Originals, Premium, Health i Energy pakete, te mogućnost personalizacije sa vašim logom.",
      },
      {
        question: "Koliki je minimalni broj za korporativnu narudžbu?",
        answer:
          "Za korporativne narudžbe, minimalni broj je 10 paketa. Za veće narudžbe (50+) nudimo dodatne popuste i mogućnost potpune personalizacije pakovanja.",
      },
      {
        question: "Koliko unaprijed trebam naručiti poklon pakete?",
        answer:
          "Preporučujemo narudžbu minimalno 2 sedmice unaprijed za standardne pakete, i 4 sedmice za personalizirane pakete sa vašim logom.",
      },
    ],
  },
  {
    category: "Api Terapija",
    questions: [
      {
        question: "Šta je Api terapija?",
        answer:
          "Apiterapija je prirodna metoda liječenja korištenjem pčelinjih proizvoda i aerosola iz košnice. Pomaže kod respiratornih problema, jačanja imuniteta i opće dobrobiti organizma.",
      },
      {
        question: "Kako zakazati termin za Api terapiju?",
        answer:
          "Termin možete zakazati telefonom ili putem naše kontakt stranice. Preporučujemo rezervaciju minimalno 3 dana unaprijed.",
      },
      {
        question: "Postoje li kontraindikacije?",
        answer:
          "Api terapija nije preporučljiva za osobe alergične na pčelinje proizvode. Prije tretmana preporučujemo konsultaciju sa liječnikom, posebno za trudnice i djecu.",
      },
    ],
  },
];

// Flatten all FAQs for structured data
const allFaqs = faqCategories.flatMap((cat) => cat.questions);

export default function FAQPage() {
  return (
    <div className="relative">
      <JsonLd data={generateFAQSchema(allFaqs)} />
      {/* Hero Section */}
      <HeroSection image="/image4.svg" className="h-[400px]">
        <div className="relative flex-1 flex items-center z-10">
          <Hero
            headTitle="Česta Pitanja"
            title="Kako vam možemo pomoći?"
            textCenter
          />
        </div>
      </HeroSection>

      {/* FAQ Content */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {faqCategories.map((category, catIndex) => (
              <div key={catIndex} className="mb-12">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <HelpCircle className="w-6 h-6 text-brand-orange" />
                  {category.category}
                </h2>

                <Accordion type="single" collapsible className="space-y-4">
                  {category.questions.map((faq, faqIndex) => (
                    <AccordionItem
                      key={faqIndex}
                      value={`${catIndex}-${faqIndex}`}
                      className="border border-gray-200 rounded-lg px-6 data-[state=open]:bg-brand-cream/50"
                    >
                      <AccordionTrigger className="text-left font-medium py-4 hover:no-underline">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground pb-4">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="py-16 bg-brand-cream">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <MessageCircle className="w-12 h-12 text-brand-orange mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">
              Niste pronašli odgovor?
            </h2>
            <p className="text-muted-foreground mb-8">
              Naš tim za podršku je tu da vam pomogne. Kontaktirajte nas putem
              telefona, emaila ili društvenih mreža.
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
                <a href="tel:+38733123456">
                  <Phone className="w-4 h-4 mr-2" />
                  +387 33 123 456
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
