import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Camera,
  Download,
  FileText,
  Video,
  ExternalLink,
  Mail,
  Phone,
} from "lucide-react";
import { HeroSection, Hero } from "@/components/sections";
import { Button } from "@/components/ui/button";
import { generatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Mediji",
  description:
    "Maksuz press centar. Press kit, fotografije, logotipi, smjernice za brend i materijali za medije. Kontakt za novinare i PR.",
  path: "/mediji",
  keywords: ["mediji", "press", "novinari", "logotipi", "fotografije", "press kit", "PR"],
});

const pressReleases = [
  {
    title: "Maksuz otvara novu poslovnicu u Zenici",
    date: "Januar 2026.",
    excerpt: "Širenje prodajne mreže na sjever Bosne i Hercegovine...",
  },
  {
    title: "Lansiranje nove linije proizvoda Maksuz Energy",
    date: "Decembar 2025.",
    excerpt: "Nova linija prirodnih energetskih proizvoda...",
  },
  {
    title: "Maksuz dobio certifikat ISO 22000",
    date: "Oktobar 2025.",
    excerpt: "Potvrda najviših standarda sigurnosti hrane...",
  },
];

const downloadables = [
  {
    icon: FileText,
    title: "Katalog Proizvoda 2026",
    format: "PDF",
    size: "8.5 MB",
    href: "/katalog-proizvoda-2026.pdf",
  },
  {
    icon: Camera,
    title: "Fotografije Proizvoda (HD)",
    format: "ZIP",
    size: "125 MB",
    href: "/media/product-photos-hd.zip",
  },
  {
    icon: FileText,
    title: "Logotipi (sve varijante)",
    format: "ZIP",
    size: "15 MB",
    href: "/media/logos.zip",
  },
  {
    icon: Video,
    title: "Promo Video",
    format: "MP4",
    size: "45 MB",
    href: "/media/promo-video.mp4",
  },
];

const mediaAppearances = [
  {
    outlet: "Face TV",
    title: "Gostovanje u emisiji 'Domaće je najbolje'",
    date: "Novembar 2025.",
    type: "TV",
  },
  {
    outlet: "Dnevni Avaz",
    title: "Intervju: Priča o uspjehu domaćeg brenda",
    date: "Oktobar 2025.",
    type: "Štampa",
  },
  {
    outlet: "Radio Sarajevo",
    title: "Razgovor o zdravoj ishrani",
    date: "Septembar 2025.",
    type: "Radio",
  },
];

export default function MedijiPage() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <HeroSection image="/Blog.png" className="h-[400px]">
        <div className="relative flex-1 flex items-center z-10">
          <Hero
            headTitle="Mediji"
            title="Maksuz Press Centar"
            description="Materijali za medije, press release-ovi i kontakt informacije za novinare."
            textCenter
          />
        </div>
      </HeroSection>

      {/* Contact for Media */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-brand-cream rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6 text-center">
                Kontakt za Medije
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-brand-orange/10 rounded-full flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6 text-brand-orange" />
                  </div>
                  <div>
                    <p className="font-medium">Email za Medije</p>
                    <a
                      href="mailto:press@maksuz.ba"
                      className="text-brand-orange hover:underline"
                    >
                      press@maksuz.ba
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-brand-orange/10 rounded-full flex items-center justify-center shrink-0">
                    <Phone className="w-6 h-6 text-brand-orange" />
                  </div>
                  <div>
                    <p className="font-medium">PR Kontakt</p>
                    <a
                      href="tel:+38733123456"
                      className="text-brand-orange hover:underline"
                    >
                      +387 33 123 456
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Downloadable Materials */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Download className="w-12 h-12 text-brand-orange mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Materijali za Preuzimanje</h2>
            <p className="text-muted-foreground">
              Logotipi, fotografije i promotivni materijali
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {downloadables.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow text-center"
              >
                <div className="w-14 h-14 mx-auto mb-4 bg-brand-orange/10 rounded-full flex items-center justify-center">
                  <item.icon className="w-7 h-7 text-brand-orange" />
                </div>
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {item.format} • {item.size}
                </p>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="w-full border-brand-orange text-brand-orange hover:bg-brand-orange/10"
                >
                  <a href={item.href} download>
                    <Download className="w-4 h-4 mr-2" />
                    Preuzmi
                  </a>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Guidelines */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Smjernice za Brend</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Pri korištenju Maksuz logotipa i materijala, molimo vas da
                    pratite naše smjernice za brend kako biste osigurali
                    konzistentnu prezentaciju.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-brand-orange">•</span>
                      Koristite oficijalne logotipe bez modifikacija
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-brand-orange">•</span>
                      Održavajte minimalnu zaštitnu zonu oko logotipa
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-brand-orange">•</span>
                      Koristite propisane boje brenda
                    </li>
                  </ul>
                </div>
                <Button
                  asChild
                  className="mt-6 bg-brand-orange hover:bg-brand-orange/90"
                >
                  <a href="/media/brand-guidelines.pdf" download>
                    <Download className="w-4 h-4 mr-2" />
                    Preuzmi Smjernice za Brend
                  </a>
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-square bg-brand-dark rounded-xl flex items-center justify-center p-8">
                  <Image
                    src="/MAKSUZ_white_logo.png"
                    alt="Maksuz Logo - Bijeli"
                    width={150}
                    height={150}
                    className="object-contain"
                  />
                </div>
                <div className="aspect-square bg-white border-2 border-gray-200 rounded-xl flex items-center justify-center p-8">
                  <Image
                    src="/MAKSUZ_orange_logo.png"
                    alt="Maksuz Logo - Narandžasti"
                    width={150}
                    height={150}
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Press Releases */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <FileText className="w-12 h-12 text-brand-orange mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Press Release-ovi</h2>
            <p className="text-muted-foreground">
              Najnovija saopštenja za javnost
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {pressReleases.map((release, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-brand-orange font-medium mb-1">
                      {release.date}
                    </p>
                    <h3 className="text-lg font-bold mb-2">{release.title}</h3>
                    <p className="text-muted-foreground text-sm">
                      {release.excerpt}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" className="shrink-0">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Media Appearances */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Camera className="w-12 h-12 text-brand-orange mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Medijska Pojavljivanja</h2>
            <p className="text-muted-foreground">
              Maksuz u medijima
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {mediaAppearances.map((appearance, index) => (
              <div
                key={index}
                className="bg-brand-cream rounded-xl p-6 text-center"
              >
                <span className="inline-block bg-brand-orange/10 text-brand-orange text-xs font-bold px-2 py-1 rounded mb-3">
                  {appearance.type}
                </span>
                <h3 className="font-bold mb-1">{appearance.outlet}</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {appearance.title}
                </p>
                <p className="text-xs text-gray-500">{appearance.date}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-brand-dark text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">
              Trebate Dodatne Informacije?
            </h2>
            <p className="text-gray-300 mb-6">
              Kontaktirajte naš PR tim za intervjue, dodatne materijale ili bilo
              koje druge upite.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-brand-orange hover:bg-brand-orange/90"
            >
              <a href="mailto:press@maksuz.ba">
                <Mail className="w-4 h-4 mr-2" />
                Kontaktirajte PR Tim
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
