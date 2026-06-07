import { Metadata } from "next";
import Link from "next/link";
import {
  Newspaper,
  Calendar,
  ArrowRight,
  Bell,
  Rss,
} from "lucide-react";
import { HeroSection, Hero } from "@/components/sections";
import { Button } from "@/components/ui/button";
import { generatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Novosti",
  description:
    "Pratite najnovije vijesti iz Maksuz-a. Novi proizvodi, otvaranja poslovnica, promocije, događaji i aktivnosti.",
  path: "/novosti",
  keywords: ["novosti", "vijesti", "događaji", "promocije", "novi proizvodi", "obavijesti"],
});

const news = [
  {
    id: 1,
    title: "Maksuz otvorio novu poslovnicu u Zenici",
    excerpt:
      "S ponosom objavljujemo otvaranje našeg novog Maksuz kutka u centru Zenice. Posjetite nas i iskoristite popuste dobrodošlice.",
    date: "15. Januar 2026.",
    category: "Vijesti",
    image: "/maksuzlogo.png",
  },
  {
    id: 2,
    title: "Nova linija proizvoda - Maksuz Energy",
    excerpt:
      "Predstavljamo našu novu liniju proizvoda namijenjenu aktivnim ljudima. Prirodna energija iz pčelinjih proizvoda.",
    date: "10. Januar 2026.",
    category: "Proizvodi",
    image: "/maksuzlogo.png",
  },
  {
    id: 3,
    title: "Zimska akcija - 20% popusta na sve medne mješavine",
    excerpt:
      "Iskoristite zimsku akciju i nabavite vaše omiljene medne mješavine po sniženim cijenama. Akcija traje do kraja januara.",
    date: "5. Januar 2026.",
    category: "Promocije",
    image: "/maksuzlogo.png",
  },
  {
    id: 4,
    title: "Uspješno završen Team Building za IT kompaniju XYZ",
    excerpt:
      "Više od 50 zaposlenika provelo je dan na našem pčelinjaku. Zahvaljujemo na povjerenju!",
    date: "28. Decembar 2025.",
    category: "Događaji",
    image: "/maksuzlogo.png",
  },
  {
    id: 5,
    title: "Maksuz na Sajmu zdravlja u Sarajevu",
    excerpt:
      "Posjetite nas na štandu br. 42. Degustacije, popusti i pokloni za sve posjetioce.",
    date: "20. Decembar 2025.",
    category: "Događaji",
    image: "/maksuzlogo.png",
  },
  {
    id: 6,
    title: "Ažurirani katalog proizvoda za 2026. godinu",
    excerpt:
      "Novi katalog sa svim našim proizvodima sada je dostupan za preuzimanje. Preko 300 proizvoda na jednom mjestu.",
    date: "15. Decembar 2025.",
    category: "Proizvodi",
    image: "/maksuzlogo.png",
  },
];

const categories = ["Sve", "Vijesti", "Proizvodi", "Promocije", "Događaji"];

export default function NovostiPage() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <HeroSection image="/Blog.png" className="h-[400px]">
        <div className="relative flex-1 flex items-center z-10">
          <Hero
            headTitle="Novosti"
            title="Budite u toku sa Maksuz-om"
            description="Najnovije vijesti, događaji, promocije i noviteti iz svijeta Maksuz-a."
            textCenter
          />
        </div>
      </HeroSection>

      {/* Category Filters */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  category === "Sve"
                    ? "bg-brand-orange text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((item) => (
              <article
                key={item.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="aspect-video bg-gradient-to-br from-brand-cream to-amber-100 flex items-center justify-center">
                  <Newspaper className="w-12 h-12 text-brand-orange/50" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-medium text-brand-orange bg-brand-orange/10 px-2 py-1 rounded">
                      {item.category}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {item.date}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold mb-2 line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                    {item.excerpt}
                  </p>
                  <Button variant="link" className="p-0 text-brand-orange">
                    Pročitaj više
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </article>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Učitaj Više Novosti
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-brand-dark text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <Bell className="w-12 h-12 text-brand-orange mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">
              Prijavite se na Newsletter
            </h2>
            <p className="text-gray-300 mb-6">
              Budite prvi koji će saznati o novim proizvodima, promocijama i
              događajima.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Vaša email adresa"
                className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-orange"
              />
              <Button className="bg-brand-orange hover:bg-brand-orange/90">
                Prijavi se
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              Vaši podaci su sigurni. Nećemo slati spam.
            </p>
          </div>
        </div>
      </section>

      {/* Blog CTA */}
      <section className="py-16 bg-brand-cream">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <Rss className="w-12 h-12 text-brand-orange mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">
              Želite više sadržaja?
            </h2>
            <p className="text-muted-foreground mb-6">
              Posjetite naš blog za edukativne članke o zdravlju, pčelarstvu i
              receptima.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-brand-orange hover:bg-brand-orange/90"
            >
              <Link href="/blog">
                Posjetite Blog
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
