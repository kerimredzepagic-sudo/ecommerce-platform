"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import {
  ShoppingBag,
  Clock,
  MapPin,
  Gift,
  Percent,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Heart,
  Star,
  Package,
  Users,
} from "lucide-react";
import { SectionHeader } from "../ui/section-header";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const categories = [
  {
    name: "Med i Medne Mješavine",
    products: "30+ proizvoda",
    description: "Svi tipovi meda i mješavine sa dodacima",
    icon: Sparkles,
    color: "from-amber-500 to-orange-600",
  },
  {
    name: "Pića i Sirupi",
    products: "25+ proizvoda",
    description: "Voćni sokovi, biljni i voćni sirupi",
    icon: Package,
    color: "from-purple-500 to-violet-600",
  },
  {
    name: "Namazi i Pekmezi",
    products: "20+ proizvoda",
    description: "Džemovi, pekmezi i kremasti namazi",
    icon: Heart,
    color: "from-rose-500 to-pink-600",
  },
  {
    name: "Orašasti Plodovi",
    products: "40+ proizvoda",
    description: "Sirovi, prženi i čokoladirani",
    icon: Star,
    color: "from-green-500 to-emerald-600",
  },
  {
    name: "Poklon Paketi",
    products: "15+ paketa",
    description: "Gotovi poklon paketi za sve prilike",
    icon: Gift,
    color: "from-blue-500 to-indigo-600",
  },
  {
    name: "Pčelinji Proizvodi",
    products: "10+ proizvoda",
    description: "Propolis, polen, matična mliječ",
    icon: Sparkles,
    color: "from-yellow-500 to-amber-600",
  },
];

const benefits = [
  {
    icon: Percent,
    title: "Fabričke Cijene",
    description: "Kupujte direktno od proizvođača po najboljim cijenama bez posrednika",
    color: "text-green-500",
  },
  {
    icon: Gift,
    title: "Besplatne Degustacije",
    description: "Probajte sve naše proizvode besplatno prije nego što kupite",
    color: "text-purple-500",
  },
  {
    icon: Users,
    title: "Stručni Savjeti",
    description: "Naše osoblje će vam pomoći u odabiru idealnih proizvoda",
    color: "text-blue-500",
  },
];

const specialOffers = [
  { discount: "-10%", description: "na prvu kupovinu" },
  { discount: "-15%", description: "za članove kluba" },
  { discount: "BESPLATNA", description: "degustacija" },
];

const statistics = [
  { value: "200", suffix: "+", label: "Proizvoda" },
  { value: "6", suffix: "", label: "Kategorija" },
  { value: "100", suffix: "%", label: "Prirodno" },
  { value: "0", suffix: "", label: "Aditiva" },
];

export function TrgovinaSection() {
  const benefitsRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const offersRef = useRef<HTMLDivElement>(null);
  const visitRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Benefits Section Animation
    if (benefitsRef.current) {
      const header = benefitsRef.current.querySelector(".benefits-header");
      const cards = benefitsRef.current.querySelectorAll(".benefit-card");
      const stats = benefitsRef.current.querySelectorAll(".stat-item");

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
        stats,
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          delay: 0.6,
          ease: "back.out(1.5)",
          scrollTrigger: {
            trigger: benefitsRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    // Categories Section Animation
    if (categoriesRef.current) {
      const header = categoriesRef.current.querySelector(".categories-header");
      const cards = categoriesRef.current.querySelectorAll(".category-card");

      gsap.fromTo(
        header,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: categoriesRef.current,
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
          stagger: 0.1,
          delay: 0.3,
          ease: "power3.out",
          scrollTrigger: {
            trigger: categoriesRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    // Offers Section Animation
    if (offersRef.current) {
      const content = offersRef.current.querySelector(".offers-content");
      const badges = offersRef.current.querySelectorAll(".offer-badge");

      gsap.fromTo(
        content,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: offersRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        badges,
        { opacity: 0, scale: 0.8, rotation: -10 },
        {
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 0.6,
          stagger: 0.15,
          delay: 0.4,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: offersRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    // Visit Section Animation
    if (visitRef.current) {
      const content = visitRef.current.querySelector(".visit-content");
      const image = visitRef.current.querySelector(".visit-image");

      gsap.fromTo(
        content,
        { opacity: 0, x: -60 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: visitRef.current,
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
            trigger: visitRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    // CTA Section Animation
    if (ctaRef.current) {
      const content = ctaRef.current.querySelector(".cta-content");

      gsap.fromTo(
        content,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
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
          <div className="max-w-screen mx-auto">
            <div className="benefits-header mb-16">
              <SectionHeader
                label="ZAŠTO KUPOVATI KOD NAS"
                title="Prednosti kupovine u trgovini"
                centered
              />
            </div>

            {/* Benefits Cards */}
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="benefit-card bg-[#F4F6F0] rounded-[30px] p-8 text-center hover:shadow-lg transition-all duration-300"
              >
                <div className="w-20 h-20 mx-auto mb-6 bg-brand-orange/10 rounded-full flex items-center justify-center">
                  <benefit.icon className={`w-10 h-10 ${benefit.color}`} />
                </div>
                <h3 className="font-oswald font-bold text-xl text-gray-900 mb-3 uppercase">
                  {benefit.title}
                </h3>
                <p className="font-poppins text-gray-600 text-sm leading-relaxed">
                  {benefit.description}
                </p>
                {/* Decorative element */}
                <div className="mt-6 flex items-center justify-center gap-2">
                  <div className="w-8 h-0.5 bg-brand-orange" />
                  <div className="w-2 h-2 rounded-full bg-brand-orange" />
                  <div className="w-8 h-0.5 bg-brand-orange" />
                </div>
              </div>
            ))}
          </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {statistics.map((stat, index) => (
                <div key={index} className="stat-item text-center">
                  <p className="font-oswald text-4xl md:text-5xl font-bold text-brand-orange">
                    {stat.value}{stat.suffix}
                  </p>
                  <p className="font-poppins text-gray-600 text-sm mt-2">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div ref={categoriesRef} className="w-full py-24 px-4 md:px-8 bg-[#F4F6F0]">
        <div className="max-w-screen-extended mx-auto">
          <div className="max-w-screen mx-auto">
            <div className="categories-header mb-16">
              <div className="w-20 h-20 mx-auto mb-6 bg-brand-orange rounded-full flex items-center justify-center">
                <ShoppingBag className="w-10 h-10 text-white" />
              </div>
              <SectionHeader
                label="NAŠ ASORTIMAN"
                title="Preko 200 proizvoda na jednom mjestu"
                centered
              />
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <div
                key={index}
                className="category-card bg-white rounded-[30px] p-8 shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <div className={`w-16 h-16 mb-6 bg-gradient-to-br ${category.color} rounded-[15px] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <category.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-oswald text-xl font-bold text-gray-900 mb-2 uppercase">
                  {category.name}
                </h3>
                <p className="font-oswald text-brand-orange font-bold text-lg mb-3">
                  {category.products}
                </p>
                <p className="font-poppins text-gray-600 text-sm leading-relaxed">
                  {category.description}
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
      </div>

      {/* Special Offers Section - Orange Gradient */}
      <div ref={offersRef} className="w-full py-20 px-4 md:px-8 bg-gradient-to-br from-brand-orange via-orange-500 to-amber-500 text-white relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-2xl" />
        
        <div className="max-w-screen-extended mx-auto relative z-10">
          <div className="offers-content mb-12">
            <div className="w-20 h-20 mx-auto mb-6 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Percent className="w-10 h-10 text-white" />
            </div>
            <SectionHeader
              title="Ekskluzivne ponude u trgovini"
              description="Posjetite nas i iskoristite posebne popuste dostupne samo u našoj trgovini. Svake sedmice nove akcije i promocije!"
              label=""
              theme="brand"
              centered
            />
          </div>

          <div className="flex flex-wrap gap-6 justify-center">
            {specialOffers.map((offer, index) => (
              <div
                key={index}
                className="offer-badge bg-white/20 backdrop-blur-sm px-8 py-4 rounded-full border border-white/30 hover:bg-white/30 transition-all duration-300"
              >
                <span className="font-oswald font-bold text-2xl">{offer.discount}</span>
                <span className="font-poppins ml-2">{offer.description}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Visit Info Section */}
      <div ref={visitRef} className="w-full py-24 px-4 md:px-8 bg-white">
        <div className="max-w-screen-extended mx-auto">
          <div className="max-w-screen mx-auto">
            <div className="flex flex-col lg:flex-row gap-12 items-center">
            {/* Left Content */}
            <div className="flex-1 visit-content">
              <SectionHeader
                label="POSJETITE NAS"
                title="Maksuz Trgovina na pčelinjaku"
                className="mb-8"
              />
              
              <div className="space-y-6 mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-brand-orange/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-brand-orange" />
                  </div>
                  <div>
                    <p className="font-oswald font-bold text-lg text-gray-900 uppercase">Lokacija</p>
                    <p className="font-poppins text-gray-600">Blažuj bb, 71000 Sarajevo</p>
                    <p className="font-poppins text-gray-500 text-sm">U sklopu Maksuz Pčelinjaka</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-brand-orange/10 flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6 text-brand-orange" />
                  </div>
                  <div>
                    <p className="font-oswald font-bold text-lg text-gray-900 uppercase">Radno Vrijeme</p>
                    <p className="font-poppins text-gray-600">Pon - Pet: 08:00 - 18:00</p>
                    <p className="font-poppins text-gray-600">Subota: 09:00 - 15:00</p>
                    <p className="font-poppins text-gray-500 text-sm">Nedjelja: Zatvoreno</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <Button
                  asChild
                  className="bg-brand-orange hover:bg-brand-orange/90 font-oswald uppercase rounded-full px-8 py-6"
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
                <Button asChild variant="outline" className="font-oswald uppercase rounded-full px-8 py-6 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white">
                  <a href="tel:+38733123456">Pozovite Nas</a>
                </Button>
              </div>
            </div>

            {/* Right Image */}
            <div className="flex-1">
              <div className="visit-image relative w-full h-[400px] lg:h-[500px] rounded-[50px] overflow-hidden shadow-xl">
                <Image
                  src="/vegetables.svg"
                  alt="Maksuz Trgovina"
                  fill
                  className="object-cover"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                {/* Floating badge */}
                <div className="absolute bottom-8 left-8 bg-white/95 backdrop-blur-sm rounded-[20px] p-4 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-brand-orange rounded-full flex items-center justify-center">
                      <ShoppingBag className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-oswald text-brand-orange text-sm font-bold uppercase">NA PČELINJAKU</p>
                      <p className="font-poppins text-xl font-bold text-gray-900">Svi proizvodi</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div ref={ctaRef} className="w-full py-24 px-4 md:px-8 bg-gray-100">
        <div className="max-w-screen-extended mx-auto">
          <div className="cta-content max-w-3xl mx-auto text-center">
            <p className="font-oswald text-brand-orange text-lg md:text-xl uppercase tracking-widest mb-4 font-bold">
              NE MOŽETE DOĆI LIČNO?
            </p>
            <h2 className="font-poppins text-3xl md:text-4xl lg:text-5xl font-normal text-gray-900 mb-6">
              Naručite online s dostavom
            </h2>
            <p className="font-poppins text-base md:text-lg text-gray-700 leading-relaxed mb-8">
              Svi proizvodi iz naše trgovine dostupni su i u online shopu. 
              Naručite s dostavom na kućnu adresu širom BiH.
            </p>
            
            <Link href="/shop">
              <Button variant="brand" className="font-oswald uppercase px-10 py-6 text-lg rounded-full">
                Posjetite Webshop
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
