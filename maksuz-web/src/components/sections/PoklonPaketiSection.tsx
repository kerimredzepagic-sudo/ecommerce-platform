"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { SectionHeader } from "../ui/section-header";
import {
  Gift,
  Package,
  Star,
  ArrowRight,
  CheckCircle,
  Heart,
  Users,
  Truck,
  Award,
  Plus,
  ShoppingBag,
  Sparkles,
  Box,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TestimonialCard } from "./TestimonialCard";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Benefits data
const corporateBenefits = [
  {
    icon: Gift,
    title: "Personalizacija",
    description: "Dodajte logo vaše firme na pakovanja i personalizirane poruke za poseban dodir.",
    color: "text-purple-500",
  },
  {
    icon: Package,
    title: "Masovne narudžbe",
    description: "Posebne cijene za veće količine. Rabat na narudžbu za korporativne klijente.",
    color: "text-blue-500",
  },
  {
    icon: Star,
    title: "Premium kvalitet",
    description: "100% prirodni proizvodi bez aditiva. HACCP i Halal certifikovani.",
    color: "text-yellow-500",
  },
  {
    icon: Truck,
    title: "Brza dostava",
    description: "Narudžbe do 12h dostavljamo isti dan. Veće količine po dogovoru.",
    color: "text-green-500",
  },
];

// Package categories
const packageCategories = [
  {
    id: "kutije",
    name: "Kutije sa personaliziranom porukom",
    description: "Za veće količine odobravamo rabat na narudžbu",
    icon: Box,
    packages: [
      {
        size: "M",
        name: "Paket M",
        items: ["Sok od 100% jabuke 1l", "Hurma krem 260g", "Hurma i tahin 250g", "Med od bagrema 270g", "Kikiriki puter 200g", "Badem u tegli 120g", "Lješnjak u tegli 120g"],
      },
      {
        size: "L",
        name: "Paket L",
        items: ["Sok od 100% jabuke 1l", "Hurma i tahin 260g", "Lješnjak puter 200g", "Badem puter 200g", "Med livada 270g", "Med bagrem 270g", "Imuno pekmez 330g"],
      },
      {
        size: "XL",
        name: "Paket XL",
        items: ["Nar sa jabukom 1l", "Med u saću 250g", "Puter od indijskog oraha 200g", "Puter od badema 200g", "Imuno pekmez 330g", "Med sa orašastim plodovima 270g", "Med medljikovac 950g"],
      },
    ],
  },
  {
    id: "celofan",
    name: "Poklon u celofanu",
    description: "Za veće količine odobravamo rabat na narudžbu",
    icon: Gift,
    packages: [
      {
        size: "M",
        name: "Paket M",
        items: ["Jabuka 100% 1l", "Hurma tahin 250g", "Prirodni sirup 0,72l", "Džem kajsija 330g", "Energy balls suha šljiva 80g", "Energy balls protein 80g"],
      },
      {
        size: "L",
        name: "Paket L",
        items: ["Jabuka 100% 1l", "Prirodni sirup 0,72l", "Hurma tahin 250g", "Med lješnjak 270g", "Imuno pekmez kiseli 330g", "Kikiriki puter 200g", "Energy balls brusnica 80g"],
      },
      {
        size: "XL",
        name: "Paket XL",
        items: ["100% nar 1l", "Sirup malina 0,72l", "Energy balls protein 80g", "Puter lješnjak 200g", "Hurma krem 260g", "Hurma tahin 250g", "Imuno slatki 330g", "Imuno kiseli 330g", "Med lješnjak 270g", "Med livada 270g"],
      },
    ],
  },
  {
    id: "daska",
    name: "Med na drvenoj dasci",
    description: "Elegantna prezentacija meda na prirodnoj drvenoj dasci",
    icon: Award,
    packages: [
      {
        size: "Med",
        name: "Med paket",
        items: ["Med kesten 270g", "Med medljikovac 270g", "Med šumski 270g"],
      },
      {
        size: "Mix",
        name: "Medna mješavina paket",
        items: ["Med kesten 270g", "Med medljikovac 270g", "Med šumski 270g"],
      },
    ],
  },
  {
    id: "kese",
    name: "Brendirane kese",
    description: "Praktične kese sa vašim brendiranjem",
    icon: ShoppingBag,
    packages: [
      {
        size: "Ceker",
        name: "Ceker",
        items: ["Hurma tahin 250g", "Hurma sa orašastim plodovima 200g"],
      },
      {
        size: "Vrećica",
        name: "Vrećica",
        items: ["Hurma tahin 250g", "Hurma sa orašastim plodovima 200g"],
      },
    ],
  },
];

// Statistics
const statistics = [
  { value: "100+", label: "Proizvoda", description: "Širok asortiman" },
  { value: "500+", label: "Korporativnih klijenata", description: "Zadovoljnih partnera" },
  { value: "24h", label: "Dostava", description: "Brza isporuka" },
  { value: "∞", label: "Mogućnosti", description: "Personalizacija" },
];

// FAQ items
const faqItems = [
  {
    id: 1,
    question: "Ko može koristiti naše korporativne poklone?",
    answer: "Naši korporativni pokloni idealni su za kompanije i posebne prilike, uključujući poslovne događaje, darivanje klijenata, ili nagrađivanje zaposlenika.",
  },
  {
    id: 2,
    question: "Da li nudite mogućnost personalizacije poklona?",
    answer: "Da, nudimo mogućnost personalizacije poklona kako bi oni odgovarali vašim specifičnim potrebama i željama. Molimo vas da nas kontaktirate za više informacija.",
  },
  {
    id: 3,
    question: "Koliko brzo mogu očekivati dostavu nakon narudžbe?",
    answer: "Ukoliko narudžbu zaprimimo do 12 sati, dostava se realizuje isti dan. Narudžbe primljene poslije 12 sati bit će dostavljene sutradan. Imajte na umu da veće količine mogu zahtijevati duži rok pripreme.",
  },
  {
    id: 4,
    question: "Postoje li minimalne količine za narudžbu?",
    answer: "Ne postoje minimalne količine za narudžbu. Međutim, u zavisnosti od iznosa narudžbe, možemo ponuditi određene rabate i popuste.",
  },
  {
    id: 5,
    question: "Koje su opcije plaćanja dostupne?",
    answer: "Plaćanje možete izvršiti virmanski ili kartično, prema vašim preferencijama.",
  },
  {
    id: 6,
    question: "Da li nudite popuste za veće narudžbe?",
    answer: "Da, nudimo popuste za veće narudžbe. Ovi popusti se dogovaraju nakon što je narudžba napravljena, a zavise od količine i ukupne vrijednosti narudžbe.",
  },
  {
    id: 7,
    question: "Kako su vaši proizvodi pakovani?",
    answer: "Naši proizvodi su pažljivo pakovani u kartonske kutije, PVC kese, cekere, ili celofan, kako bi osigurali njihovu sigurnost i prezentaciju.",
  },
  {
    id: 8,
    question: "Koje certifikate posjedujete?",
    answer: "Naši proizvodi imaju halal certifikat, članovi smo udruženja Kupujmo domaće 387, i posjedujemo ISO certifikat, što garantuje visoke standarde kvalitete.",
  },
];

// Testimonials
const testimonials = [
  {
    customerName: "Firma ABC d.o.o.",
    customerImage: "/womanAvatar.png",
    customerTitle: "Korporativni klijent",
    reviewText: "Odlični pokloni za naše zaposlenike! Kvalitet proizvoda je izvanredan, a personalizacija kutija sa našim logom je bila savršena.",
  },
  {
    customerName: "Hotel Grand",
    customerImage: "/womanAvatar.png",
    customerTitle: "Poslovni partner",
    reviewText: "Već godinama naručujemo Maksuz poklone za naše goste. Profesionalna usluga i vrhunski proizvodi.",
  },
  {
    customerName: "IT Solutions d.o.o.",
    customerImage: "/womanAvatar.png",
    customerTitle: "Korporativni klijent",
    reviewText: "Brza dostava i odlična komunikacija. Naši klijenti su oduševljeni poklon paketima!",
  },
  {
    customerName: "Banka XYZ",
    customerImage: "/womanAvatar.png",
    customerTitle: "VIP klijent",
    reviewText: "Premium kvalitet za premium klijente. Maksuz razumije potrebe korporativnog sektora.",
  },
];

export function PoklonPaketiSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const benefitsRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const statisticsRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);

  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState(0);

  // Duplicate testimonials for seamless infinite loop
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  useEffect(() => {
    // Benefits Section Animation
    if (benefitsRef.current) {
      const header = benefitsRef.current.querySelector(".benefits-header");
      const cards = benefitsRef.current.querySelectorAll(".benefit-card");
      const icons = benefitsRef.current.querySelectorAll(".benefit-icon");
      const timeline = benefitsRef.current.querySelectorAll(".timeline-element");

      gsap.fromTo(
        header,
        { opacity: 0, y: 30 },
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

      gsap.fromTo(
        timeline,
        { scaleX: 0, transformOrigin: "left center" },
        {
          scaleX: 1,
          duration: 1.2,
          ease: "power2.inOut",
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
      const tabs = categoriesRef.current.querySelectorAll(".category-tab");
      const content = categoriesRef.current.querySelector(".category-content");

      gsap.fromTo(
        header,
        { opacity: 0, y: 30 },
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
        tabs,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          delay: 0.3,
          ease: "power2.out",
          scrollTrigger: {
            trigger: categoriesRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        content,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: categoriesRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    // Statistics Section Animation
    if (statisticsRef.current) {
      const box = statisticsRef.current.querySelector(".stats-box");
      const items = statisticsRef.current.querySelectorAll(".stat-item");
      const numbers = statisticsRef.current.querySelectorAll(".stat-number");

      gsap.fromTo(
        box,
        { opacity: 0, y: 50, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: statisticsRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        items,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.15,
          delay: 0.4,
          ease: "power3.out",
          scrollTrigger: {
            trigger: statisticsRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        numbers,
        { scale: 0.5, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          stagger: 0.15,
          delay: 0.6,
          ease: "back.out(1.4)",
          scrollTrigger: {
            trigger: statisticsRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    // FAQ Section Animation
    if (faqRef.current) {
      const header = faqRef.current.querySelector(".faq-header");
      const items = faqRef.current.querySelectorAll(".faq-item");

      gsap.fromTo(
        header,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: faqRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        items,
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          stagger: 0.1,
          delay: 0.3,
          ease: "power2.out",
          scrollTrigger: {
            trigger: faqRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    // Testimonials Section Animation
    if (testimonialsRef.current) {
      const header = testimonialsRef.current.querySelector(".testimonials-header");
      const carousel = testimonialsRef.current.querySelector(".testimonials-carousel");

      gsap.fromTo(
        header,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: testimonialsRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        carousel,
        { opacity: 0, y: 50, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          delay: 0.4,
          ease: "power3.out",
          scrollTrigger: {
            trigger: testimonialsRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    // CTA Section Animation
    if (ctaRef.current) {
      gsap.fromTo(
        ctaRef.current,
        { opacity: 0, y: 50, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ctaRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    // Cleanup ScrollTrigger instances on unmount
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        trigger.kill();
      });
    };
  }, []);

  const toggleFaq = (id: number) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <section ref={sectionRef} className="w-full">
      {/* Benefits Section */}
      <div ref={benefitsRef} className="w-full py-24 px-4 md:px-8 bg-white">
        <div className="max-w-screen-extended mx-auto">
          <div className="benefits-header mb-16">
            <SectionHeader
              label="ZAŠTO MAKSUZ"
              title="Benefiti korporativnih poklona"
              description="Posebna pažnja sa najboljim sastojcima. Naši korporativni pokloni su savršen izbor za poslovne partnere, zaposlenike i posebne prilike."
              centered
            />
          </div>

          {/* Timeline decoration */}
          <div className="relative mb-8 hidden lg:block">
            <div className="timeline-element absolute top-1/2 left-0 right-0 h-0.5 border-t-2 border-dashed border-brand-orange/40 -translate-y-1/2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 relative">
            {corporateBenefits.map((benefit, index) => (
              <div
                key={benefit.title}
                className="benefit-card relative bg-[#F4F6F0] rounded-[40px] p-8 text-center hover:shadow-lg transition-shadow duration-300"
              >
                {/* Timeline dot - hidden on mobile */}
                <div className="hidden lg:block absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-brand-orange z-10 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-white" />
                </div>

                <div className={`benefit-icon w-20 h-20 rounded-full bg-brand-orange/10 flex items-center justify-center mx-auto mb-6`}>
                  <benefit.icon className={`w-10 h-10 ${benefit.color}`} />
                </div>
                <h3 className="font-oswald font-bold text-xl text-gray-900 mb-3 uppercase">
                  {benefit.title}
                </h3>
                <p className="font-poppins text-gray-600 text-sm leading-relaxed">
                  {benefit.description}
                </p>
                {/* Decorative element */}
                <div className="mt-6 flex justify-center items-center gap-2">
                  <div className="w-8 h-0.5 bg-brand-orange" />
                  <div className="w-2 h-2 rounded-full bg-brand-orange" />
                  <div className="w-8 h-0.5 bg-brand-orange" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Package Categories Section */}
      <div ref={categoriesRef} className="w-full py-24 px-4 md:px-8 bg-gray-900 text-white">
        <div className="max-w-screen-extended mx-auto">
          <div className="categories-header mb-16">
            <SectionHeader
              label="MAKSUZ POKLONI"
              title="Kategorije poklon paketa"
              description='Uz naše standardne proizvode, ponosno predstavljamo „Maksuz kutije", savršene za svaku priliku, te poklone zapakovane u elegantan celofan.'
              theme="dark"
              centered
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {packageCategories.map((category, index) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(index)}
                className={`category-tab flex items-center gap-3 px-6 py-4 rounded-full font-oswald uppercase tracking-wide transition-all duration-300 ${
                  activeCategory === index
                    ? "bg-brand-orange text-white"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                <category.icon className="w-5 h-5" />
                <span className="hidden sm:inline">{category.name}</span>
                <span className="sm:hidden">{category.id}</span>
              </button>
            ))}
          </div>

          {/* Category Content */}
          <div className="category-content">
            <div className="text-center mb-8">
              <h3 className="font-oswald text-2xl font-bold uppercase mb-2">
                {packageCategories[activeCategory].name}
              </h3>
              <p className="font-poppins text-gray-400">
                {packageCategories[activeCategory].description}
              </p>
            </div>

            {/* Package Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packageCategories[activeCategory].packages.map((pkg, index) => (
                <div
                  key={pkg.name}
                  className="bg-white/5 backdrop-blur-sm rounded-[30px] p-8 border border-white/10 hover:bg-white/10 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-oswald text-4xl font-bold text-brand-orange">
                      {pkg.size}
                    </span>
                    <div className="w-12 h-12 rounded-full bg-brand-orange/20 flex items-center justify-center">
                      <Package className="w-6 h-6 text-brand-orange" />
                    </div>
                  </div>
                  <h4 className="font-oswald font-bold text-xl text-white mb-4 uppercase">
                    {pkg.name}
                  </h4>
                  <ul className="space-y-2 mb-6">
                    {pkg.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400 shrink-0 mt-1" />
                        <span className="font-poppins text-sm text-gray-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                  {/* Decorative line */}
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-0.5 bg-brand-orange" />
                    <div className="w-2 h-2 rounded-full bg-brand-orange" />
                  </div>
                </div>
              ))}
            </div>

            {/* Order CTA */}
            <div className="text-center mt-12">
              <Button
                asChild
                className="bg-brand-orange hover:bg-brand-orange/90 font-oswald uppercase px-8 py-6 text-lg rounded-full"
              >
                <Link href="/kontakt">
                  Naruči poklon
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Section - Orange Overlapping Box */}
      <div ref={statisticsRef} className="w-full py-16 px-4 relative">
        <div className="max-w-screen-extended mx-auto relative">
          <div className="stats-box bg-brand-orange rounded-[50px] py-16 px-8 md:px-16 lg:px-24 shadow-xl relative overflow-hidden">
            {/* Decorative image */}
            <Image
              src="/flowerPots.svg"
              alt="Decorative"
              width={200}
              height={200}
              className="absolute top-[-30px] right-8 opacity-60 hidden lg:block"
            />
            
            <div className="relative z-10">
              <div className="mb-12">
                <SectionHeader
                  label="KORPORATIVNA IZVRSNOST"
                  title="Brojke govore za nas."
                  theme="brand"
                  centered
                />
              </div>

              {/* Divider */}
              <div className="w-full h-px bg-white/20 mb-12" />

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {statistics.map((stat, index) => (
                  <div key={index} className="stat-item text-center">
                    <p className="stat-number font-poppins text-5xl md:text-6xl lg:text-7xl font-normal text-gray-900 mb-2">
                      {stat.value}
                    </p>
                    <p className="font-oswald text-xl text-white font-bold uppercase mb-1">
                      {stat.label}
                    </p>
                    <p className="font-poppins text-sm text-white/80">
                      {stat.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div ref={testimonialsRef} className="w-full py-24 px-4 bg-[#F4F6F0] overflow-hidden">
        <div className="testimonials-header mb-16 max-w-screen-extended mx-auto">
          <SectionHeader
            label="REFERENCE"
            title="Šta naši klijenti kažu"
            description="Povjerenje korporativnih klijenata je naša najveća nagrada."
            centered
          />
        </div>

        {/* Carousel Container */}
        <div className="testimonials-carousel mx-auto max-w-screen-extended pt-[10px] overflow-x-hidden overflow-y-visible">
          <div
            className="testimonial-scroll-wrapper flex gap-6 items-start"
            style={{
              animation: "scroll 20s linear infinite",
            }}
          >
            {duplicatedTestimonials.map((testimonial, index) => (
              <div key={index} className="flex-shrink-0 w-[350px]">
                <TestimonialCard
                  customerName={testimonial.customerName}
                  customerImage={testimonial.customerImage}
                  customerTitle={testimonial.customerTitle}
                  reviewText={testimonial.reviewText}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div ref={faqRef} className="w-full py-24 px-4 md:px-8 bg-white">
        <div className="max-w-screen-extended mx-auto">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            {/* Left Side - Header */}
            <div className="lg:w-1/3">
              <div className="faq-header lg:sticky lg:top-24">
                <SectionHeader
                  label="FAQ"
                  title="Često postavljana pitanja"
                  description="Pronađite odgovore na najčešća pitanja o našim korporativnim poklonima."
                >
                  <Button
                    asChild
                    variant="outline"
                    className="border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white font-oswald uppercase mt-6"
                  >
                    <Link href="/kontakt">
                      Imate dodatnih pitanja?
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </SectionHeader>
              </div>
            </div>

            {/* Right Side - FAQ Items */}
            <div className="lg:w-2/3 space-y-4">
              {faqItems.map((item) => (
                <div
                  key={item.id}
                  className="faq-item border border-gray-200 rounded-[25px] overflow-hidden bg-white hover:shadow-md transition-shadow duration-300"
                >
                  <button
                    onClick={() => toggleFaq(item.id)}
                    className="w-full flex items-center justify-between p-6 text-left transition-colors"
                  >
                    <span className="font-poppins text-base md:text-lg text-gray-900 pr-4 font-medium">
                      {item.question}
                    </span>
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${
                      expandedFaq === item.id ? 'bg-brand-orange' : 'bg-gray-100'
                    }`}>
                      <Plus
                        className={`w-5 h-5 transition-all duration-300 ${
                          expandedFaq === item.id ? "rotate-45 text-white" : "text-gray-600"
                        }`}
                      />
                    </div>
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      expandedFaq === item.id
                        ? "max-h-96 opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="px-6 pb-6">
                      <p className="font-poppins text-sm md:text-base text-gray-600 leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div ref={ctaRef} className="w-full py-24 px-4 md:px-8 bg-[#F4F6F0]">
        <div className="max-w-screen-extended mx-auto">
          <div className="bg-gray-900 rounded-[50px] p-12 md:p-16 lg:p-20 text-center relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-32 h-32 rounded-full bg-brand-orange/20 -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-48 h-48 rounded-full bg-brand-orange/10 translate-x-1/4 translate-y-1/4" />
            <div className="absolute top-1/2 right-8 w-24 h-24 rounded-full bg-brand-orange/5 hidden lg:block" />
            
            <div className="relative z-10">
              <SectionHeader
                label="PERSONALIZIRANI PAKETI"
                title="Trebate poseban paket za vašu firmu?"
                description="Kontaktirajte nas za personalizirane ponude sa vašim logom i porukama. Nudimo posebne cijene za veće narudžbe i korporativne klijente."
                theme="dark"
                centered
                className="mb-10"
              />
              
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/kontakt">
                  <Button className="bg-brand-orange hover:bg-brand-orange/90 font-oswald uppercase px-8 py-6 text-lg">
                    Kontaktirajte nas
                  </Button>
                </Link>
                <Link href="/team-building">
                  <Button variant="outline" className="font-oswald uppercase px-8 py-6 text-lg border-white text-white bg-transparent hover:bg-white hover:text-gray-900">
                    Team Building Ponuda
                  </Button>
                </Link>
                <a href="/katalog-poklona.pdf" download>
                  <Button variant="outline" className="font-oswald uppercase px-8 py-6 text-lg border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white">
                    <Package className="w-5 h-5 mr-2" />
                    Preuzmi Katalog
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
