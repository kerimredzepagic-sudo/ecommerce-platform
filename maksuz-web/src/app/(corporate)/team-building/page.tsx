import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Users,
  Calendar,
  MapPin,
  Clock,
  CheckCircle,
  ArrowRight,
  Utensils,
  TreePine,
  Heart,
} from "lucide-react";
import { HeroSection, Hero } from "@/components/sections";
import { Button } from "@/components/ui/button";
import { generatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Team Building",
  description:
    "Organizirajte nezaboravan team building na Maksuz pčelinjaku. Api terapija, degustacije, radionice i timske aktivnosti u prirodi.",
  path: "/team-building",
  keywords: ["team building", "korporativni događaji", "tim", "pčelinjak", "api terapija", "degustacija", "priroda"],
});

const packages = [
  {
    name: "Pčelinji Dan",
    duration: "4 sata",
    capacity: "Do 20 osoba",
    price: "Od 500 KM",
    description: "Idealno za manje timove koji žele upoznati pčelarstvo i prirodu",
    includes: [
      "Obilazak pčelinjaka",
      "Api terapija za sve učesnike",
      "Degustacija meda i proizvoda",
      "Lagani ručak",
      "Poklon paketi za sve",
    ],
    color: "from-amber-500 to-orange-600",
  },
  {
    name: "Prirodna Avantura",
    duration: "6 sati",
    capacity: "Do 40 osoba",
    price: "Od 1,200 KM",
    description: "Kompletan paket za srednje i veće timove",
    includes: [
      "Obilazak proizvodnje",
      "Api terapija",
      "Radionica pravljenja proizvoda",
      "Roštilj u prirodi",
      "Team building igre",
      "Premium poklon paketi",
    ],
    color: "from-green-500 to-emerald-600",
    popular: true,
  },
  {
    name: "Korporativni Retreat",
    duration: "Cijeli dan",
    capacity: "Do 100 osoba",
    price: "Po dogovoru",
    description: "Potpuno prilagođen program za velike korporacije",
    includes: [
      "Prilagođen program",
      "Profesionalni facilitatori",
      "Catering po izboru",
      "Transport",
      "Team building aktivnosti",
      "Personalizirani pokloni",
      "Foto i video dokumentacija",
    ],
    color: "from-purple-500 to-indigo-600",
  },
];

const activities = [
  {
    icon: TreePine,
    title: "Obilazak Pčelinjaka",
    description: "Upoznajte fascinantan svijet pčela i naučite o pčelarstvu",
  },
  {
    icon: Heart,
    title: "Api Terapija",
    description: "Grupna api terapija za relaksaciju i zdravlje",
  },
  {
    icon: Utensils,
    title: "Degustacija",
    description: "Probajte naše proizvode uz stručno vodstvo",
  },
  {
    icon: Users,
    title: "Team Aktivnosti",
    description: "Zabavne igre i izazovi za jačanje tima",
  },
];

const testimonials = [
  {
    quote: "Fantastičan team building! Naš tim se vratio pun energije i inspiracije.",
    author: "Amela H.",
    company: "IT kompanija, Sarajevo",
  },
  {
    quote: "Organizacija na najvišem nivou. Preporučujem svima!",
    author: "Mirza K.",
    company: "Marketinška agencija",
  },
];

export default function TeamBuildingPage() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <HeroSection image="/Garden.svg" className="h-[600px]">
        <div className="relative flex-1 flex items-center z-10">
          <Hero
            headTitle="Team Building"
            title="Povežite vaš tim u prirodi"
            description="Organizirajte nezaboravan team building na našem pčelinjaku. Kombinacija api terapije, degustacija i zabavnih aktivnosti za jačanje timskog duha."
            textCenter
          />
        </div>
      </HeroSection>

      {/* Activities */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {activities.map((activity, index) => (
              <div
                key={index}
                className="text-center p-6 bg-brand-cream rounded-2xl"
              >
                <div className="w-14 h-14 mx-auto mb-4 bg-brand-orange/10 rounded-full flex items-center justify-center">
                  <activity.icon className="w-7 h-7 text-brand-orange" />
                </div>
                <h3 className="text-lg font-bold mb-2">{activity.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {activity.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Team Building Paketi
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Odaberite paket koji odgovara vašem timu ili nas kontaktirajte za
              prilagođenu ponudu
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {packages.map((pkg, index) => (
              <div
                key={index}
                className={`relative bg-white rounded-2xl overflow-hidden shadow-lg ${
                  pkg.popular ? "ring-2 ring-brand-orange" : ""
                }`}
              >
                {pkg.popular && (
                  <div className="absolute top-4 right-4 bg-brand-orange text-white text-xs font-bold px-3 py-1 rounded-full">
                    NAJPOPULARNIJI
                  </div>
                )}

                {/* Header */}
                <div
                  className={`bg-gradient-to-r ${pkg.color} p-6 text-white`}
                >
                  <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                  <p className="text-white/80 text-sm">{pkg.description}</p>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6 pb-6 border-b">
                    <div className="text-center">
                      <Clock className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                      <span className="text-sm">{pkg.duration}</span>
                    </div>
                    <div className="text-center">
                      <Users className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                      <span className="text-sm">{pkg.capacity}</span>
                    </div>
                    <div className="text-center">
                      <span className="text-xl font-bold text-brand-dark">
                        {pkg.price}
                      </span>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {pkg.includes.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    asChild
                    className="w-full bg-brand-orange hover:bg-brand-orange/90"
                  >
                    <Link href="/kontakt">
                      Zatražite Ponudu
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-brand-dark text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Šta Kažu Naši Klijenti</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-6"
                >
                  <p className="text-lg italic mb-4">"{testimonial.quote}"</p>
                  <div>
                    <p className="font-bold">{testimonial.author}</p>
                    <p className="text-sm text-gray-400">
                      {testimonial.company}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Lokacija</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-6 h-6 text-brand-orange shrink-0" />
                    <div>
                      <p className="font-bold">Maksuz Pčelinjak</p>
                      <p className="text-muted-foreground">
                        Blažuj bb, 71000 Sarajevo
                      </p>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    Naš pčelinjak se nalazi samo 15 minuta vožnje od centra
                    Sarajeva, u mirnom prirodnom okruženju. Parking za autobuse
                    i automobile je obezbijeđen.
                  </p>
                  <p className="text-muted-foreground">
                    Za grupe van Sarajeva, možemo organizirati transport.
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-video bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center">
                  <Image
                    src="/maksuzlogo.png"
                    alt="Maksuz Lokacija"
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

      {/* CTA */}
      <section className="py-16 bg-brand-cream">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <Calendar className="w-12 h-12 text-brand-orange mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">
              Rezervišite Vaš Team Building
            </h2>
            <p className="text-muted-foreground mb-6">
              Kontaktirajte nas za dostupne termine i personaliziranu ponudu za
              vaš tim.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-brand-orange hover:bg-brand-orange/90"
              >
                <Link href="/kontakt">Kontaktirajte Nas</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="tel:+38733123456">Pozovite: +387 33 123 456</a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
