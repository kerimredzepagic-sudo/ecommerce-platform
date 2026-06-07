"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import {
  MapPin,
  Phone,
  Clock,
  Mail,
  ExternalLink,
  Navigation,
  Star,
  Heart,
  Coffee,
  Gift,
  Users,
  ShoppingBag,
  Loader2,
} from "lucide-react";
import { SectionHeader } from "../ui/section-header";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useStoreLocations } from "@/hooks/useShopApi";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const benefits = [
  {
    icon: Coffee,
    title: "Degustacija",
    description: "Probajte naše proizvode besplatno prije kupovine",
    color: "text-amber-500",
  },
  {
    icon: Gift,
    title: "Poklon paketi",
    description: "Gotovi poklon setovi za sve prilike na jednom mjestu",
    color: "text-purple-500",
  },
  {
    icon: Users,
    title: "Stručno osoblje",
    description: "Naš tim će vam pomoći da pronađete idealan proizvod",
    color: "text-blue-500",
  },
  {
    icon: ShoppingBag,
    title: "Fabričke cijene",
    description: "Kupujte direktno od proizvođača bez posrednika",
    color: "text-green-500",
  },
];

const statistics = [
  { value: "3", label: "Poslovnice", suffix: "" },
  { value: "200", label: "Proizvoda", suffix: "+" },
  { value: "10", label: "Godina iskustva", suffix: "+" },
  { value: "50000", label: "Zadovoljnih kupaca", suffix: "+" },
];

export function PoslovniceSection() {
  const benefitsRef = useRef<HTMLDivElement>(null);
  const storesRef = useRef<HTMLDivElement>(null);
  
  // Fetch store locations from API
  const { data: locationsData, isLoading: locationsLoading } = useStoreLocations();
  const stores = locationsData?.data || [];
  const statsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Benefits Section Animation
    if (benefitsRef.current) {
      const header = benefitsRef.current.querySelector(".benefits-header");
      const cards = benefitsRef.current.querySelectorAll(".benefit-card");
      const icons = benefitsRef.current.querySelectorAll(".benefit-icon");

      gsap.fromTo(
        header,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: benefitsRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        cards,
        { opacity: 0, y: 60, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.15,
          delay: 0.3,
          ease: "power3.out",
          scrollTrigger: {
            trigger: benefitsRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        icons,
        { scale: 0, rotation: -180 },
        {
          scale: 1,
          rotation: 0,
          duration: 0.6,
          stagger: 0.15,
          delay: 0.5,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: benefitsRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    // Stores Section Animation
    if (storesRef.current) {
      const header = storesRef.current.querySelector(".stores-header");
      const cards = storesRef.current.querySelectorAll(".store-card");
      const decorations = storesRef.current.querySelectorAll(".store-decoration");

      gsap.fromTo(
        header,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: storesRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        cards,
        { opacity: 0, y: 80, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          stagger: 0.2,
          delay: 0.3,
          ease: "power3.out",
          scrollTrigger: {
            trigger: storesRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        decorations,
        { scaleX: 0, transformOrigin: "left center" },
        {
          scaleX: 1,
          duration: 0.8,
          stagger: 0.1,
          delay: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: storesRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    // Statistics Section Animation
    if (statsRef.current) {
      const orangeBox = statsRef.current.querySelector(".stats-orange-box");
      const statItems = statsRef.current.querySelectorAll(".stat-item");

      gsap.fromTo(
        orangeBox,
        { opacity: 0, y: 60, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        statItems,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          delay: 0.4,
          ease: "power3.out",
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    // CTA Section Animation
    if (ctaRef.current) {
      const content = ctaRef.current.querySelector(".cta-content");
      const image = ctaRef.current.querySelector(".cta-image");

      gsap.fromTo(
        content,
        { opacity: 0, x: -60 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ctaRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        image,
        { opacity: 0, x: 60, scale: 0.9 },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 1,
          delay: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ctaRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section className="w-full">
      {/* Benefits Section */}
      <div ref={benefitsRef} className="w-full py-20 px-4 md:px-8 bg-white">
        <div className="max-w-screen-extended mx-auto">
          <div className="benefits-header mb-16">
            <SectionHeader
              label="ZAŠTO NAS POSJETITI"
              title="Prednosti kupovine u poslovnici"
              description="Doživite Maksuz iskustvo uživo. Naše poslovnice nude više od same kupovine - to je mjesto gdje otkrivate najbolje od prirode."
              centered
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="benefit-card bg-[#F4F6F0] rounded-[30px] p-8 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="benefit-icon w-16 h-16 rounded-full bg-brand-orange/10 flex items-center justify-center mb-6">
                  <benefit.icon className={`w-8 h-8 ${benefit.color}`} />
                </div>
                <h3 className="font-oswald font-bold text-xl text-gray-900 mb-3 uppercase">
                  {benefit.title}
                </h3>
                <p className="font-poppins text-gray-600 text-sm leading-relaxed">
                  {benefit.description}
                </p>
                {/* Decorative element */}
                <div className="mt-6 flex items-center gap-2">
                  <div className="w-8 h-0.5 bg-brand-orange" />
                  <div className="w-2 h-2 rounded-full bg-brand-orange" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stores Section */}
      <div ref={storesRef} className="w-full py-24 px-4 md:px-8 bg-[#F4F6F0]">
        <div className="max-w-screen-extended mx-auto">
          <div className="stores-header mb-16">
            <SectionHeader
              label="NAŠE LOKACIJE"
              title="Pronađite najbližu poslovnicu"
              centered
            />
          </div>

          {locationsLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-brand-orange" />
            </div>
          ) : stores.length === 0 ? (
            <div className="text-center py-20">
              <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Nema dostupnih poslovnica</p>
            </div>
          ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {stores.map((store) => (
              <div
                key={store.id}
                id={store.id}
                className={`store-card bg-white rounded-[40px] overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ${
                  store.isHighlight ? "ring-2 ring-brand-orange" : ""
                }`}
              >
                {/* Store Header */}
                <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 p-8 text-white">
                  {store.isHighlight && (
                    <div className="absolute top-4 right-4 bg-brand-orange text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3" /> CENTRALA
                    </div>
                  )}
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-white rounded-[20px] flex items-center justify-center shadow-lg">
                      <Image
                        src={store.image || "/maksuzlogo.png"}
                        alt={store.name}
                        width={56}
                        height={56}
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="font-oswald text-2xl font-bold uppercase">
                        {store.name}
                      </h3>
                      {store.subtitle && (
                        <span className="text-brand-orange font-medium text-sm">
                          {store.subtitle}
                        </span>
                      )}
                    </div>
                  </div>
                  {/* Decorative element */}
                  <div className="store-decoration absolute bottom-0 left-8 right-8 h-1 bg-gradient-to-r from-brand-orange to-transparent rounded-full" />
                </div>

                {/* Store Details */}
                <div className="p-8 space-y-5">
                  {/* Address */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-brand-orange/10 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-brand-orange" />
                    </div>
                    <div>
                      <p className="font-poppins font-semibold text-gray-900">{store.address}</p>
                      <p className="font-poppins text-gray-500 text-sm">{store.city}</p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-brand-orange/10 flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-brand-orange" />
                    </div>
                    <a
                      href={`tel:${store.phone.replace(/\s/g, "")}`}
                      className="font-poppins text-gray-700 hover:text-brand-orange transition-colors"
                    >
                      {store.phone}
                    </a>
                  </div>

                  {/* Email */}
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-brand-orange/10 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-brand-orange" />
                    </div>
                    <a
                      href={`mailto:${store.email}`}
                      className="font-poppins text-gray-700 hover:text-brand-orange transition-colors"
                    >
                      {store.email}
                    </a>
                  </div>

                  {/* Working Hours */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-brand-orange/10 flex items-center justify-center shrink-0 mt-1">
                      <Clock className="w-5 h-5 text-brand-orange" />
                    </div>
                    <div className="font-poppins text-sm text-gray-600">
                      <p><span className="font-semibold text-gray-900">Pon - Pet:</span> {store.workingHours.weekdays}</p>
                      <p><span className="font-semibold text-gray-900">Subota:</span> {store.workingHours.saturday}</p>
                      <p><span className="font-semibold text-gray-900">Nedjelja:</span> {store.workingHours.sunday}</p>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex flex-wrap gap-2">
                      {store.features.map((feature, idx) => (
                        <span
                          key={idx}
                          className="text-xs font-poppins bg-brand-cream px-4 py-2 rounded-full text-gray-700 font-medium"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Map Link */}
                  {store.mapUrl && (
                  <Button
                    asChild
                    className="w-full mt-4 bg-brand-orange hover:bg-brand-orange/90 text-white font-oswald uppercase rounded-full py-6"
                  >
                    <a
                      href={store.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Navigation className="w-4 h-4 mr-2" />
                      Otvori na Mapi
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
          )}
        </div>
      </div>

      {/* Statistics Section - Orange Box Design */}
      <div ref={statsRef} className="w-full py-16 px-4 relative bg-white">
        <div className="max-w-screen-extended mx-auto">
          <div className="stats-orange-box bg-brand-orange rounded-[40px] py-16 px-8 md:px-16 shadow-xl relative overflow-hidden">
            {/* Decorative elements */}
            <Image
              src="/flowerPots.svg"
              alt="Decorative"
              width={180}
              height={180}
              className="absolute top-[-20px] right-8 opacity-70 hidden lg:block"
            />
            
            <div className="relative z-10">
              <div className="mb-12">
                <SectionHeader
                  label="MAKSUZ MREŽA"
                  title="Brojke koje govore"
                  theme="brand"
                  centered
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {statistics.map((stat, index) => (
                  <div key={index} className="stat-item text-center">
                    <p className="font-oswald text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2">
                      {stat.value}{stat.suffix}
                    </p>
                    <p className="font-oswald text-lg font-semibold text-gray-900 uppercase">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div ref={ctaRef} className="w-full py-24 px-4 md:px-8 bg-gray-100">
        <div className="max-w-screen-extended mx-auto">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            {/* Left Content */}
            <div className="flex-1 cta-content">
              <SectionHeader
                label="NE MOŽETE DOĆI LIČNO?"
                title="Naručite online s dostavom"
                description="Svi proizvodi iz naših poslovnica dostupni su i u našoj online trgovini. Brza dostava na vašu adresu širom Bosne i Hercegovine. Iste fabričke cijene, ista kvaliteta, udobnost kupovine od kuće."
                className="mb-8"
              />
              
              {/* Benefits list */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-orange flex items-center justify-center">
                    <Heart className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-poppins text-gray-700">Besplatna dostava za narudžbe preko 50 KM</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-orange flex items-center justify-center">
                    <Heart className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-poppins text-gray-700">Sigurno plaćanje karticom ili pouzećem</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-orange flex items-center justify-center">
                    <Heart className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-poppins text-gray-700">Dostava u roku od 24-48 sati</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link href="/shop">
                  <Button variant="brand" className="font-oswald uppercase px-8 py-6 text-lg rounded-full">
                    Posjetite Webshop
                  </Button>
                </Link>
                <Link href="/kontakt">
                  <Button variant="outline" className="font-oswald uppercase px-8 py-6 text-lg rounded-full border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white">
                    Kontaktirajte Nas
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Image */}
            <div className="flex-1">
              <div className="cta-image relative w-full h-[400px] lg:h-[500px] rounded-[50px] overflow-hidden shadow-xl">
                <Image
                  src="/image2.svg"
                  alt="Maksuz Webshop"
                  fill
                  className="object-cover"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                {/* Floating badge */}
                <div className="absolute bottom-8 left-8 bg-white/95 backdrop-blur-sm rounded-[20px] p-4 shadow-lg">
                  <p className="font-oswald text-brand-orange text-sm font-bold uppercase">ONLINE SHOP</p>
                  <p className="font-poppins text-2xl font-bold text-gray-900">200+ Proizvoda</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
