import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Coffee,
  Clock,
  MapPin,
  Wifi,
  Car,
  Leaf,
  ArrowRight,
} from "lucide-react";
import { HeroSection, Hero } from "@/components/sections";
import { Button } from "@/components/ui/button";
import { generatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Maksuz Caffe",
  description:
    "Posjetite Maksuz Caffe na pčelinjaku u Blažuju. Prirodni napici, zdrave grickalice, besplatan WiFi i parking. Idealno za odmor u prirodi.",
  path: "/pcelinjak/caffe",
  keywords: ["caffe", "kafić", "prirodni napici", "zdrave grickalice", "pčelinjak", "Blažuj", "odmor"],
});

const menuHighlights = [
  {
    category: "Topli Napici",
    items: [
      { name: "Maksuz Čaj sa Medom", price: "3.50 KM" },
      { name: "Đumbir Limun", price: "4.00 KM" },
      { name: "Topla Čokolada", price: "4.50 KM" },
      { name: "Domaći Čaj", price: "2.50 KM" },
    ],
  },
  {
    category: "Hladni Napici",
    items: [
      { name: "100% Voćni Sok", price: "4.00 KM" },
      { name: "Limunada sa Medom", price: "4.50 KM" },
      { name: "Smoothie", price: "6.00 KM" },
      { name: "Ledeni Čaj", price: "3.50 KM" },
    ],
  },
  {
    category: "Grickalice",
    items: [
      { name: "Energy Balls (3 kom)", price: "5.00 KM" },
      { name: "Mix Orašastih Plodova", price: "6.00 KM" },
      { name: "Voćna Salata", price: "7.00 KM" },
      { name: "Granola sa Jogurtom", price: "8.00 KM" },
    ],
  },
];

const features = [
  {
    icon: Leaf,
    title: "100% Prirodno",
    description: "Svi proizvodi su prirodni, bez aditiva",
  },
  {
    icon: Wifi,
    title: "Besplatan WiFi",
    description: "Radite ili se opustite uz brzi internet",
  },
  {
    icon: Car,
    title: "Besplatan Parking",
    description: "Prostrani parking za goste",
  },
];

export default function CaffePage() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <HeroSection image="/flower-shovel.svg" className="h-[500px]">
        <div className="relative flex-1 flex items-center z-10">
          <Hero
            headTitle="Maksuz Caffe"
            title="Kafa u zagrljaju prirode"
            description="Uživajte u prirodnim napicima i zdravim grickalicama uz pogled na naš pčelinjak. Idealno mjesto za odmor, rad ili druženje."
            textCenter
          />
        </div>
      </HeroSection>

      {/* Features */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 bg-brand-cream rounded-xl"
              >
                <div className="w-12 h-12 bg-brand-orange/10 rounded-full flex items-center justify-center shrink-0">
                  <feature.icon className="w-6 h-6 text-brand-orange" />
                </div>
                <div>
                  <h3 className="font-bold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Menu */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Coffee className="w-12 h-12 text-brand-orange mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Naš Meni</h2>
            <p className="text-lg text-muted-foreground">
              Sve od naših prirodnih proizvoda
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {menuHighlights.map((category, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg overflow-hidden"
              >
                <div className="bg-brand-dark text-white p-4">
                  <h3 className="text-xl font-bold text-center">
                    {category.category}
                  </h3>
                </div>
                <div className="p-6">
                  <ul className="space-y-4">
                    {category.items.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-center justify-between"
                      >
                        <span>{item.name}</span>
                        <span className="font-bold text-brand-orange">
                          {item.price}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-muted-foreground mt-8">
            * Puni meni dostupan u caffeu
          </p>
        </div>
      </section>

      {/* Atmosphere */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center">
                  <Image
                    src="/maksuzlogo.png"
                    alt="Maksuz Caffe Atmosfera"
                    width={200}
                    height={200}
                    className="object-contain"
                  />
                </div>
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-6">
                  Opuštajuća Atmosfera
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Maksuz Caffe nalazi se na našem pčelinjaku u Blažuju, okružen
                    prirodom i zelenilom. Idealno mjesto za bijeg od gradske
                    buke.
                  </p>
                  <p>
                    Naš prostor je dizajniran da pruži maksimalni komfor - bilo
                    da dolazite na kratku kafu, radite na laptopu ili se družite
                    sa prijateljima.
                  </p>
                  <p>
                    Tokom ljepšeg vremena, uživajte na našoj terasi sa pogledom
                    na pčelinjak i prirodu.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Working Hours & Location */}
      <section className="py-16 bg-brand-cream">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Working Hours */}
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <Clock className="w-8 h-8 text-brand-orange" />
                  <h3 className="text-2xl font-bold">Radno Vrijeme</h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex justify-between">
                    <span>Ponedjeljak - Petak</span>
                    <span className="font-bold">08:00 - 20:00</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Subota</span>
                    <span className="font-bold">09:00 - 18:00</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Nedjelja</span>
                    <span className="font-bold">10:00 - 16:00</span>
                  </li>
                </ul>
              </div>

              {/* Location */}
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <MapPin className="w-8 h-8 text-brand-orange" />
                  <h3 className="text-2xl font-bold">Lokacija</h3>
                </div>
                <div className="space-y-3">
                  <p className="font-medium">Maksuz Pčelinjak</p>
                  <p className="text-muted-foreground">
                    Blažuj bb<br />
                    71000 Sarajevo
                  </p>
                  <p className="text-sm text-muted-foreground">
                    15 minuta vožnje od centra Sarajeva
                  </p>
                  <Button
                    asChild
                    variant="outline"
                    className="mt-4 border-brand-orange text-brand-orange hover:bg-brand-orange/10"
                  >
                    <a
                      href="https://maps.google.com/?q=Blazuj,Sarajevo"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MapPin className="w-4 h-4 mr-2" />
                      Otvori na Mapi
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-brand-dark text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">
              Kombinirajte sa Api Terapijom
            </h2>
            <p className="text-gray-300 mb-6">
              Posjetite nas za api terapiju i nakon toga uživajte u osvježenju
              u našem caffeu.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-brand-orange hover:bg-brand-orange/90"
            >
              <Link href="/api-terapija">
                Saznajte Više o Api Terapiji
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
